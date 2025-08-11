import { Router } from 'express';
import { TherapyController } from '../controllers/TherapyController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

// Applica autenticazione a tutte le route
router.use(AuthMiddleware.authenticate);

// Route per i tipi di terapia (deve essere prima di /:id per evitare conflitti)
router.get('/therapy-types', TherapyController.getTherapyTypes);
router.post('/initialize-types', TherapyController.initializeTypes);
router.get('/types/:typeCode/parameters', TherapyController.getParameterSchema);

// Route per le terapie per cartella clinica
router.get('/clinical-record/:recordId', TherapyController.getByClinicalRecord);

// Route per terapista
router.get('/therapist/:therapistId/today', TherapyController.getTodaySessionsForTherapist);

// Route per le sessioni (operazioni generali)
router.post('/sessions/:sessionId/cancel', TherapyController.cancelSession);
router.post('/sessions/:sessionId/reschedule', TherapyController.rescheduleSession);
router.put('/sessions/:sessionId/progress', TherapyController.updateSessionProgress);

// Route per le terapie principali
router.get('/', TherapyController.getAll);
router.get('/:id', TherapyController.getById);
router.post('/', TherapyController.create);
router.put('/:id', TherapyController.update);
router.delete('/:id', TherapyController.delete);
router.put('/:id/status', TherapyController.updateStatus);

// Route per statistiche e report
router.get('/:id/vas-improvement', TherapyController.getVASImprovement);
router.get('/:id/statistics', TherapyController.getStatistics);
router.get('/:id/report', TherapyController.generateReport);

// Route per le sessioni di una terapia specifica
router.get('/:id/sessions', TherapyController.getSessions);
router.post('/:id/sessions', TherapyController.createSession);
router.put('/:id/sessions/:sessionId', TherapyController.updateSession);

// Route aggiuntive
router.post('/schedule-session', TherapyController.scheduleSession);

export default router;
