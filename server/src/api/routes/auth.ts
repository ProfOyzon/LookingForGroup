import { Router } from 'express';
import getAuth from '#controllers/auth/authController.ts';

const router = Router();

// Receives authorization response to check if user is guest or not
router.get('/', getAuth);

export default router;
