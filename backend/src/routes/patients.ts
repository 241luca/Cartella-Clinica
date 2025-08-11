import { Router } from 'express';
import { PatientController } from '../controllers/PatientController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Routes per i pazienti - tutte richiedono autenticazione
router.get('/', authenticate, PatientController.getAll);
router.get('/:id', authenticate, PatientController.getOne);
router.post('/', authenticate, PatientController.create);
router.put('/:id', authenticate, PatientController.update);
router.delete('/:id', 
  authenticate, 
  authorize('ADMIN', 'DOCTOR'),
  PatientController.delete
);
router.get('/:id/clinical-records', authenticate, PatientController.getClinicalRecords);

export default router;
