import { Router } from 'express';
import { TherapyController } from '../controllers/TherapyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Applica autenticazione a tutte le route
router.use(authMiddleware);

// Route per le terapie
router.get('/', TherapyController.getAll);
router.get('/types', TherapyController.getTherapyTypes);
router.get('/:id', TherapyController.getById);
router.post('/', TherapyController.create);
router.put('/:id', TherapyController.update);
router.put('/:id/status', TherapyController.updateStatus);
router.delete('/:id', TherapyController.delete);

// Route per le sessioni
router.get('/:id/sessions', TherapyController.getSessions);
router.post('/:id/sessions', TherapyController.createSession);
router.put('/:id/sessions/:sessionId', TherapyController.updateSession);

export default router;
