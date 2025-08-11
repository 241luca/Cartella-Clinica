import { Router } from 'express';
import { ClinicalRecordController } from '../controllers/ClinicalRecordController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Routes per le cartelle cliniche - tutte richiedono autenticazione
router.get('/', authenticate, ClinicalRecordController.getAll);
router.get('/:id', authenticate, ClinicalRecordController.getOne);
router.post('/', 
  authenticate,
  authorize('ADMIN', 'DOCTOR', 'THERAPIST'),
  ClinicalRecordController.create
);
router.put('/:id', 
  authenticate,
  authorize('ADMIN', 'DOCTOR', 'THERAPIST'),
  ClinicalRecordController.update
);
router.post('/:id/close', 
  authenticate,
  authorize('ADMIN', 'DOCTOR'),
  ClinicalRecordController.close
);
router.post('/:id/reopen', 
  authenticate,
  authorize('ADMIN', 'DOCTOR'),
  ClinicalRecordController.reopen
);
router.get('/:id/therapies', authenticate, ClinicalRecordController.getTherapies);

export default router;
