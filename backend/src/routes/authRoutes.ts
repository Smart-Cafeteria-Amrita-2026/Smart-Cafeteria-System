import { Router } from 'express'
import { registerUser, signInUser, logoutUser, forgotPassword, updatePassword } from '../controllers/authController'
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/signIn', signInUser);
router.post('/signOut', requireAuth, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', updatePassword);

export default router;