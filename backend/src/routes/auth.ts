import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

// Routes pubbliche
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// Routes protette
router.get('/me', AuthMiddleware.authenticate, AuthController.getCurrentUser);

// Route per registrazione (solo ADMIN può registrare nuovi utenti)
router.post(
  '/register',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('ADMIN'),
  AuthController.register
);

export default router;
