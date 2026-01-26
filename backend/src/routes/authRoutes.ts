import { Router } from 'express'
import { registerUser, signInUser, logoutUser } from '../controllers/authController'
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/signIn', signInUser);
router.post('/signOut', requireAuth, logoutUser);

export default router;