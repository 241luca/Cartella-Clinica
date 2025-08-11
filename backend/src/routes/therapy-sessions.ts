import { Router } from 'express';
import { TherapySessionController } from '../controllers/TherapySessionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Tutte le routes richiedono autenticazione
router.use(authenticate);

// Routes per le sedute
router.get('/', TherapySessionController.getAll);
router.get('/calendar', TherapySessionController.getCalendar);
router.get('/:id', TherapySessionController.getOne);
router.post('/', 
  authorize('ADMIN', 'DOCTOR', 'THERAPIST', 'NURSE'),
  TherapySessionController.create
);
router.put('/:id', 
  authorize('ADMIN', 'DOCTOR', 'THERAPIST', 'NURSE'),
  TherapySessionController.update
);

// Azioni sulle sedute
router.post('/:id/complete', 
  authorize('ADMIN', 'DOCTOR', 'THERAPIST', 'NURSE'),
  TherapySessionController.complete
);
router.post('/:id/cancel', 
  authorize('ADMIN', 'DOCTOR', 'THERAPIST'),
  TherapySessionController.cancel
);
router.post('/:id/reschedule', 
  authorize('ADMIN', 'DOCTOR', 'THERAPIST', 'RECEPTIONIST'),
  TherapySessionController.reschedule
);

export default router;
