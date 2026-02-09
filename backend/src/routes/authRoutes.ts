import { Router } from 'express'
import { registerUser, signInUser, logoutUser, forgotPassword, updatePassword } from '../controllers/authController'
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', signInUser);
router.post('/logout', requireAuth, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', updatePassword);

export default router;