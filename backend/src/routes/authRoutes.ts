import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route pubbliche
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh', AuthController.refreshToken);

// Route protette
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post('/register', authenticate, AuthController.register); // Solo admin possono registrare

export default router;
