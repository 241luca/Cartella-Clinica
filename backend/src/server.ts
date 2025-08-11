import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import patientRoutes from './routes/patients';
import clinicalRecordRoutes from './routes/clinical-records';
import therapyRoutes from './routes/therapies';
import therapySessionRoutes from './routes/therapy-sessions';
import therapyTypeRoutes from './routes/therapy-types';

// Carica variabili ambiente
dotenv.config();

// Inizializza Express
const app = express();
const PORT = process.env.PORT || 3100;

// Inizializza Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Middleware di sicurezza
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5183',
  credentials: true,
}));

// Parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compressione
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: PORT,
  });
});

// API base endpoint
app.get('/api', (_req, res) => {
  res.json({
    message: 'Cartella Clinica API - Medicina Ravenna',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      patients: '/api/patients',
      records: '/api/clinical-records',
      therapies: '/api/therapies',
      sessions: '/api/therapy-sessions',
    }
  });
});

// Routes API
app.use('/api/auth', authRoutes); // Auth routes (pubbliche e protette)
app.use('/api/dashboard', dashboardRoutes); // Dashboard routes (protette)
app.use('/api/patients', patientRoutes); // Routes protette
app.use('/api/clinical-records', clinicalRecordRoutes); // Routes protette
app.use('/api/therapies', therapyRoutes); // Routes protette
app.use('/api/therapy-sessions', therapySessionRoutes); // Routes protette
app.use('/api/therapy-types', therapyTypeRoutes); // Routes protette

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Gestione chiusura pulita
process.on('SIGINT', async () => {
  console.log('\n🔴 Chiusura server...');
  await prisma.$disconnect();
  process.exit(0);
});

// Avvia il server
async function startServer() {
  try {
    // Testa connessione database
    await prisma.$connect();
    console.log('✅ Database connesso');

    app.listen(PORT, () => {
      console.log(`
🚀 Server Cartella Clinica avviato!
📍 URL: http://localhost:${PORT}
📍 Health: http://localhost:${PORT}/health
📍 API: http://localhost:${PORT}/api
🏥 Medicina Ravenna - Sistema Cartella Clinica Digitale
      `);
    });
  } catch (error) {
    console.error('❌ Errore avvio server:', error);
    process.exit(1);
  }
}

startServer();
