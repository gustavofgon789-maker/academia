import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login);
router.get('/me', authMiddleware, controller.me);

export default router;
