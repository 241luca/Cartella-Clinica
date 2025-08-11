-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DOCTOR', 'THERAPIST', 'RECEPTIONIST', 'NURSE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "TherapyStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'MISSED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PRESCRIPTION', 'REPORT', 'XRAY', 'MRI', 'CT_SCAN', 'ULTRASOUND', 'LAB_RESULTS', 'CONSENT_FORM', 'DISCHARGE_REPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('PRIVACY', 'TREATMENT', 'DATA_PROCESSING', 'RESEARCH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'INSURANCE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "fiscal_code" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "birth_place" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "phone" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "general_practitioner" TEXT,
    "prescribing_doctor" TEXT,
    "privacy_consent" BOOLEAN NOT NULL DEFAULT false,
    "marketing_consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_records" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "record_number" TEXT NOT NULL,
    "acceptance_date" TIMESTAMP(3) NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "diagnostic_details" TEXT,
    "symptomatology" TEXT,
    "objective_examination" TEXT,
    "instrumental_exams" TEXT,
    "intervention_date" TIMESTAMP(3),
    "intervention_doctor" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "clinical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapy_types" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "default_duration" INTEGER NOT NULL DEFAULT 30,
    "default_sessions" INTEGER NOT NULL DEFAULT 10,
    "requires_doctor" BOOLEAN NOT NULL DEFAULT false,
    "requires_equipment" BOOLEAN NOT NULL DEFAULT false,
    "parameters_schema" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapy_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapies" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "therapy_type_id" TEXT NOT NULL,
    "prescribed_sessions" INTEGER NOT NULL,
    "completed_sessions" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" "TherapyStatus" NOT NULL DEFAULT 'SCHEDULED',
    "frequency" TEXT,
    "district" TEXT,
    "notes" TEXT,
    "parameters" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "therapy_sessions" (
    "id" TEXT NOT NULL,
    "therapy_id" TEXT NOT NULL,
    "therapist_id" TEXT NOT NULL,
    "session_number" INTEGER NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "vas_score_before" INTEGER,
    "vas_score_after" INTEGER,
    "variations" TEXT,
    "notes" TEXT,
    "parameters" JSONB,
    "therapist_signature" TEXT,
    "patient_signature" TEXT,
    "signed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapy_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "functional_evaluations" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "evaluation_date" TIMESTAMP(3) NOT NULL,
    "evaluation_type" TEXT NOT NULL,
    "articulation" TEXT,
    "district" TEXT,
    "flexion_initial" DOUBLE PRECISION,
    "flexion_final" DOUBLE PRECISION,
    "extension_initial" DOUBLE PRECISION,
    "extension_final" DOUBLE PRECISION,
    "abduction_initial" DOUBLE PRECISION,
    "abduction_final" DOUBLE PRECISION,
    "adduction_initial" DOUBLE PRECISION,
    "adduction_final" DOUBLE PRECISION,
    "rotation_initial" DOUBLE PRECISION,
    "rotation_final" DOUBLE PRECISION,
    "functional_score" INTEGER,
    "vas_score" INTEGER,
    "final_score" INTEGER,
    "result" TEXT,
    "notes" TEXT,
    "evaluator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "functional_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anamnesis" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "record_date" TIMESTAMP(3) NOT NULL,
    "infectious_diseases" TEXT,
    "previous_surgeries" TEXT,
    "bone_fractures" TEXT,
    "current_pathologies" TEXT,
    "genetic_risks" TEXT,
    "environmental_risks" TEXT,
    "family_predispositions" TEXT,
    "lifestyle" TEXT,
    "social_data" TEXT,
    "previous_therapies" TEXT,
    "allergies" TEXT,
    "infections" TEXT,
    "traumas" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anamnesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vital_signs" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "measurement_date" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION,
    "heart_rate" INTEGER,
    "respiratory_rate" INTEGER,
    "blood_pressure_sys" INTEGER,
    "blood_pressure_dia" INTEGER,
    "oxygen_saturation" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "notes" TEXT,
    "measured_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_controls" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "control_date" TIMESTAMP(3) NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "recommendations" TEXT,
    "next_control_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinical_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discharge_reports" (
    "id" TEXT NOT NULL,
    "clinical_record_id" TEXT NOT NULL,
    "discharge_date" TIMESTAMP(3) NOT NULL,
    "therapy_cycles" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "clinical_result" TEXT NOT NULL,
    "functional_result" TEXT NOT NULL,
    "recommendations" TEXT,
    "next_control_date" TIMESTAMP(3),
    "doctor_name" TEXT NOT NULL,
    "doctor_signature" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discharge_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "description" TEXT,
    "uploaded_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consents" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "consent_type" "ConsentType" NOT NULL,
    "is_granted" BOOLEAN NOT NULL,
    "granted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "signature" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "therapist_id" TEXT,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "reminder_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "net_amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" "PaymentMethod",
    "paid_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "tax_rate" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "patients_fiscal_code_key" ON "patients"("fiscal_code");

-- CreateIndex
CREATE INDEX "patients_fiscal_code_idx" ON "patients"("fiscal_code");

-- CreateIndex
CREATE INDEX "patients_last_name_first_name_idx" ON "patients"("last_name", "first_name");

-- CreateIndex
CREATE UNIQUE INDEX "clinical_records_record_number_key" ON "clinical_records"("record_number");

-- CreateIndex
CREATE INDEX "clinical_records_patient_id_idx" ON "clinical_records"("patient_id");

-- CreateIndex
CREATE INDEX "clinical_records_record_number_idx" ON "clinical_records"("record_number");

-- CreateIndex
CREATE INDEX "clinical_records_acceptance_date_idx" ON "clinical_records"("acceptance_date");

-- CreateIndex
CREATE UNIQUE INDEX "therapy_types_code_key" ON "therapy_types"("code");

-- CreateIndex
CREATE INDEX "therapy_types_code_idx" ON "therapy_types"("code");

-- CreateIndex
CREATE INDEX "therapy_types_category_idx" ON "therapy_types"("category");

-- CreateIndex
CREATE INDEX "therapies_clinical_record_id_idx" ON "therapies"("clinical_record_id");

-- CreateIndex
CREATE INDEX "therapies_therapy_type_id_idx" ON "therapies"("therapy_type_id");

-- CreateIndex
CREATE INDEX "therapies_status_idx" ON "therapies"("status");

-- CreateIndex
CREATE INDEX "therapy_sessions_therapy_id_idx" ON "therapy_sessions"("therapy_id");

-- CreateIndex
CREATE INDEX "therapy_sessions_therapist_id_idx" ON "therapy_sessions"("therapist_id");

-- CreateIndex
CREATE INDEX "therapy_sessions_session_date_idx" ON "therapy_sessions"("session_date");

-- CreateIndex
CREATE UNIQUE INDEX "therapy_sessions_therapy_id_session_number_key" ON "therapy_sessions"("therapy_id", "session_number");

-- CreateIndex
CREATE INDEX "functional_evaluations_clinical_record_id_idx" ON "functional_evaluations"("clinical_record_id");

-- CreateIndex
CREATE INDEX "functional_evaluations_evaluation_date_idx" ON "functional_evaluations"("evaluation_date");

-- CreateIndex
CREATE INDEX "anamnesis_patient_id_idx" ON "anamnesis"("patient_id");

-- CreateIndex
CREATE INDEX "vital_signs_patient_id_idx" ON "vital_signs"("patient_id");

-- CreateIndex
CREATE INDEX "vital_signs_measurement_date_idx" ON "vital_signs"("measurement_date");

-- CreateIndex
CREATE INDEX "clinical_controls_clinical_record_id_idx" ON "clinical_controls"("clinical_record_id");

-- CreateIndex
CREATE INDEX "clinical_controls_control_date_idx" ON "clinical_controls"("control_date");

-- CreateIndex
CREATE UNIQUE INDEX "discharge_reports_clinical_record_id_key" ON "discharge_reports"("clinical_record_id");

-- CreateIndex
CREATE INDEX "documents_patient_id_idx" ON "documents"("patient_id");

-- CreateIndex
CREATE INDEX "documents_document_type_idx" ON "documents"("document_type");

-- CreateIndex
CREATE INDEX "consents_patient_id_idx" ON "consents"("patient_id");

-- CreateIndex
CREATE INDEX "consents_consent_type_idx" ON "consents"("consent_type");

-- CreateIndex
CREATE INDEX "appointments_patient_id_idx" ON "appointments"("patient_id");

-- CreateIndex
CREATE INDEX "appointments_therapist_id_idx" ON "appointments"("therapist_id");

-- CreateIndex
CREATE INDEX "appointments_appointment_date_idx" ON "appointments"("appointment_date");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_patient_id_idx" ON "invoices"("patient_id");

-- CreateIndex
CREATE INDEX "invoices_invoice_number_idx" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_records" ADD CONSTRAINT "clinical_records_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapies" ADD CONSTRAINT "therapies_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapies" ADD CONSTRAINT "therapies_therapy_type_id_fkey" FOREIGN KEY ("therapy_type_id") REFERENCES "therapy_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapy_sessions" ADD CONSTRAINT "therapy_sessions_therapy_id_fkey" FOREIGN KEY ("therapy_id") REFERENCES "therapies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapy_sessions" ADD CONSTRAINT "therapy_sessions_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "functional_evaluations" ADD CONSTRAINT "functional_evaluations_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anamnesis" ADD CONSTRAINT "anamnesis_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_controls" ADD CONSTRAINT "clinical_controls_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_controls" ADD CONSTRAINT "clinical_controls_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discharge_reports" ADD CONSTRAINT "discharge_reports_clinical_record_id_fkey" FOREIGN KEY ("clinical_record_id") REFERENCES "clinical_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
