import { Router } from 'express';
import { TherapyController } from '../controllers/TherapyController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Tutte le routes richiedono autenticazione
router.use(authenticate);

// Inizializzazione tipi di terapia (solo admin)
router.post('/initialize-types',
  authorize('ADMIN'),
  TherapyController.initializeTypes
);

// Routes base per le terapie
router.get('/',
  TherapyController.getAll
);

router.get('/:id',
  TherapyController.getById
);

router.post('/', 
  authorize('ADMIN', 'DOCTOR', 'THERAPIST'),
  TherapyController.create
);

// Pianificazione e gestione sedute
router.post('/schedule-session',
  authorize('ADMIN', 'DOCTOR', 'THERAPIST'),
  TherapyController.scheduleSession
);

router.put('/sessions/:sessionId/progress',
  authorize('ADMIN', 'DOCTOR', 'THERAPIST', 'NURSE'),
  TherapyController.updateSessionProgress
);

router.post('/sessions/:sessionId/cancel',
  authorize('ADMIN', 'DOCTOR', 'THERAPIST'),
  TherapyController.cancelSession
);

router.post('/sessions/:sessionId/reschedule',
  authorize('ADMIN', 'DOCTOR', 'THERAPIST'),
  TherapyController.rescheduleSession
);

// Statistiche e report
router.get('/:id/vas-improvement',
  TherapyController.getVASImprovement
);

router.get('/:id/statistics',
  TherapyController.getStatistics
);

router.get('/:id/report',
  authorize('ADMIN', 'DOCTOR'),
  TherapyController.generateReport
);

// Terapie per cartella clinica
router.get('/clinical-record/:recordId',
  TherapyController.getByClinicalRecord
);

// Sedute del giorno per terapista
router.get('/therapist/:therapistId/today',
  TherapyController.getTodaySessionsForTherapist
);

// Schema parametri per tipo di terapia
router.get('/types/:typeCode/parameters',
  TherapyController.getParameterSchema
);

export default router;
