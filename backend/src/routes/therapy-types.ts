import { Router } from 'express';
import { TherapyTypeController } from '../controllers/TherapyTypeController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Tutte le routes richiedono autenticazione
router.use(authenticate);

// Routes pubbliche (per utenti autenticati)
router.get('/', TherapyTypeController.getAll);
router.get('/categories', TherapyTypeController.getCategories);
router.get('/:id', TherapyTypeController.getOne);

// Routes amministrative (solo ADMIN)
router.post('/', 
  authorize('ADMIN'),
  TherapyTypeController.create
);
router.put('/:id', 
  authorize('ADMIN'),
  TherapyTypeController.update
);
router.post('/:id/deactivate', 
  authorize('ADMIN'),
  TherapyTypeController.deactivate
);
router.post('/:id/activate', 
  authorize('ADMIN'),
  TherapyTypeController.activate
);

export default router;
