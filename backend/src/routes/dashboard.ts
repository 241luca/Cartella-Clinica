import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Tutte le route della dashboard richiedono autenticazione
router.use(authenticate);

// Dashboard stats
router.get('/stats', DashboardController.getStats);
router.get('/today-sessions', DashboardController.getTodaySessions);
router.get('/therapy-stats', DashboardController.getTherapyStats);
router.get('/recent-activities', DashboardController.getRecentActivities);

export default router;
