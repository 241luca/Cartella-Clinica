# 🚀 Deployment e DevOps - Sistema Cartella Clinica

## 🏗️ Architettura Infrastructure

### Ambiente Production
```yaml
infrastructure:
  provider: AWS / Azure / On-Premise
  
  servers:
    web_servers:
      count: 2
      type: t3.large (AWS) / B2s (Azure)
      cpu: 2 vCPU
      ram: 8 GB
      disk: 100 GB SSD
    
    app_servers:
      count: 3
      type: t3.xlarge
      cpu: 4 vCPU
      ram: 16 GB
      disk: 200 GB SSD
    
    database_primary:
      type: db.r5.xlarge
      cpu: 4 vCPU
      ram: 32 GB
      disk: 500 GB SSD
      backup: continuous
    
    database_replica:
      type: db.r5.large
      cpu: 2 vCPU
      ram: 16 GB
      disk: 500 GB SSD
    
    cache_server:
      type: cache.t3.medium
      ram: 4 GB
      engine: Redis 7.0
    
  storage:
    type: S3 / Azure Blob
    size: 1 TB
    redundancy: geo-redundant
    encryption: AES-256
    
  network:
    vpc: 10.0.0.0/16
    subnets:
      public: 10.0.1.0/24
      private: 10.0.2.0/24
      database: 10.0.3.0/24
    
  load_balancer:
    type: Application Load Balancer
    ssl_certificate: ACM managed
    health_check: /api/health
```

## 🐳 Docker Configuration

### Dockerfile Backend
```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
```

### Dockerfile Frontend
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production image with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: cartella_clinica
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: cartella_clinica
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - backend

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      PORT: 3000
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: cartella_clinica
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      MONGO_URI: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
      - mongodb
      - redis
    ports:
      - "3000:3000"
    networks:
      - backend
      - frontend
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: http://backend:3000/api
    ports:
      - "80:80"
    networks:
      - frontend
    depends_on:
      - backend
    restart: unless-stopped

networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge

volumes:
  postgres_data:
  mongo_data:
  redis_data:
```

## ☸️ Kubernetes Deployment

### Deployment Manifests
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cartella-clinica

---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: cartella-clinica
data:
  NODE_ENV: "production"
  PORT: "3000"
  DB_HOST: "postgres-service"
  DB_PORT: "5432"
  DB_NAME: "cartella_clinica"

---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: cartella-clinica
type: Opaque
data:
  db-password: <base64-encoded>
  jwt-secret: <base64-encoded>
  redis-password: <base64-encoded>

---
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: cartella-clinica
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: cartella-clinica/backend:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: cartella-clinica
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: ClusterIP

---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: cartella-clinica
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.cartella-clinica.it
    secretName: api-tls
  rules:
  - host: api.cartella-clinica.it
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 3000
```

## 🔄 CI/CD Pipeline

### GitLab CI Configuration
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy

variables:
  DOCKER_REGISTRY: registry.gitlab.com
  IMAGE_NAME: $DOCKER_REGISTRY/$CI_PROJECT_PATH

before_script:
  - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

# Build Stage
build:
  stage: build
  script:
    - docker build -t $IMAGE_NAME:$CI_COMMIT_SHA ./backend
    - docker push $IMAGE_NAME:$CI_COMMIT_SHA
    - docker tag $IMAGE_NAME:$CI_COMMIT_SHA $IMAGE_NAME:latest
    - docker push $IMAGE_NAME:latest

# Test Stage
test:unit:
  stage: test
  script:
    - npm ci
    - npm run test:unit
  coverage: '/Coverage: \d+\.\d+%/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

test:integration:
  stage: test
  services:
    - postgres:14
    - mongo:6
    - redis:7
  script:
    - npm ci
    - npm run test:integration

# Security Stage
security:scan:
  stage: security
  script:
    - npm audit --production
    - docker run --rm -v "$PWD":/src \
        aquasec/trivy image $IMAGE_NAME:latest

security:sonarqube:
  stage: security
  script:
    - sonar-scanner \
        -Dsonar.projectKey=$CI_PROJECT_NAME \
        -Dsonar.sources=. \
        -Dsonar.host.url=$SONAR_URL \
        -Dsonar.login=$SONAR_TOKEN

# Deploy Stages
deploy:staging:
  stage: deploy
  environment:
    name: staging
    url: https://staging.cartella-clinica.it
  script:
    - kubectl set image deployment/backend \
        backend=$IMAGE_NAME:$CI_COMMIT_SHA \
        -n cartella-clinica-staging
  only:
    - develop

deploy:production:
  stage: deploy
  environment:
    name: production
    url: https://api.cartella-clinica.it
  script:
    - kubectl set image deployment/backend \
        backend=$IMAGE_NAME:$CI_COMMIT_SHA \
        -n cartella-clinica
  only:
    - main
  when: manual
```

## 📊 Monitoring e Logging

### Prometheus Configuration
```yaml
# prometheus-config.yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'cartella-clinica'
    static_configs:
      - targets: ['backend-service:3000']
    metrics_path: '/metrics'
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
      
  - job_name: 'mongodb'
    static_configs:
      - targets: ['mongodb-exporter:9216']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - '/etc/prometheus/alerts/*.yml'
```

### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "Cartella Clinica Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds)"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~'5..'}[5m])"
          }
        ]
      },
      {
        "title": "Database Connections",
        "targets": [
          {
            "expr": "pg_stat_database_numbackends"
          }
        ]
      }
    ]
  }
}
```

### ELK Stack Setup
```yaml
# elasticsearch.yaml
apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
spec:
  ports:
  - port: 9200
    name: http
  - port: 9300
    name: transport
  selector:
    app: elasticsearch

---
# logstash-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: logstash-config
data:
  logstash.conf: |
    input {
      beats {
        port => 5044
      }
    }
    
    filter {
      if [kubernetes][container][name] == "backend" {
        json {
          source => "message"
        }
        
        date {
          match => [ "timestamp", "ISO8601" ]
        }
      }
    }
    
    output {
      elasticsearch {
        hosts => ["elasticsearch:9200"]
        index => "cartella-clinica-%{+YYYY.MM.dd}"
      }
    }
```

## 🔄 Backup e Disaster Recovery

### Backup Strategy
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/${DATE}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup PostgreSQL
echo "Backing up PostgreSQL..."
pg_dump -h postgres-service \
        -U ${DB_USER} \
        -d cartella_clinica \
        -f ${BACKUP_DIR}/postgres_backup.sql

# Backup MongoDB
echo "Backing up MongoDB..."
mongodump --host mongodb-service:27017 \
          --db cartella_clinica \
          --out ${BACKUP_DIR}/mongodb_backup

# Backup files from S3
echo "Backing up files..."
aws s3 sync s3://cartella-clinica-files \
            ${BACKUP_DIR}/files

# Compress backup
tar -czf ${BACKUP_DIR}.tar.gz ${BACKUP_DIR}

# Upload to backup storage
aws s3 cp ${BACKUP_DIR}.tar.gz \
          s3://cartella-clinica-backups/${DATE}.tar.gz

# Clean up local files
rm -rf ${BACKUP_DIR} ${BACKUP_DIR}.tar.gz

# Rotate old backups (keep 30 days)
aws s3 ls s3://cartella-clinica-backups/ \
  | awk '{print $4}' \
  | sort -r \
  | tail -n +31 \
  | xargs -I {} aws s3 rm s3://cartella-clinica-backups/{}

echo "Backup completed: ${DATE}"
```

### Disaster Recovery Plan
```yaml
disaster_recovery:
  rto: 4 hours  # Recovery Time Objective
  rpo: 1 hour   # Recovery Point Objective
  
  backup_schedule:
    full_backup: daily at 02:00
    incremental: every 1 hour
    retention: 30 days
    
  recovery_procedures:
    1_assess_damage:
      - Identify affected components
      - Determine recovery scope
      
    2_activate_dr_site:
      - Switch DNS to DR site
      - Start DR environment
      
    3_restore_data:
      - Restore latest backup
      - Apply transaction logs
      - Verify data integrity
      
    4_validate_system:
      - Run health checks
      - Test critical functions
      - Verify user access
      
    5_communicate:
      - Notify stakeholders
      - Update status page
      - Document incident
```

## 🚦 Deployment Checklist

### Pre-Deployment
- [ ] Code review completed
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Documentation updated
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Backup taken

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests on staging
- [ ] Get approval from stakeholders
- [ ] Schedule maintenance window
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Update DNS if needed

### Post-Deployment
- [ ] Monitor metrics for 30 minutes
- [ ] Check error logs
- [ ] Verify all services running
- [ ] Test critical user flows
- [ ] Send deployment notification
- [ ] Update documentation
- [ ] Close deployment ticket

## 📈 Performance Optimization

### Database Optimization
```sql
-- Create indexes
CREATE INDEX idx_patients_cf ON patients(codice_fiscale);
CREATE INDEX idx_cartelle_paziente ON cartelle_cliniche(paziente_id);
CREATE INDEX idx_terapie_cartella ON terapie(cartella_id);
CREATE INDEX idx_sedute_data ON sedute_terapia(data_seduta);

-- Analyze tables
ANALYZE patients;
ANALYZE cartelle_cliniche;
ANALYZE terapie;

-- Configure autovacuum
ALTER TABLE patients SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE sedute_terapia SET (autovacuum_vacuum_scale_factor = 0.05);
```

### CDN Configuration
```nginx
# nginx.conf for CDN
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    gzip_static on;
}

location /api {
    proxy_pass http://backend:3000;
    proxy_cache api_cache;
    proxy_cache_valid 200 1m;
    proxy_cache_valid 404 1m;
    proxy_cache_bypass $http_cache_control;
    add_header X-Cache-Status $upstream_cache_status;
}
```

## 🔐 Security Hardening

### Server Hardening
```bash
# Firewall rules
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw enable

# Fail2ban configuration
cat > /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
maxretry = 3
findtime = 600
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 60
bantime = 600
EOF

# Security headers in nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

---

**Version**: 1.0
**Last Updated**: August 2025
**Maintained by**: DevOps Team
