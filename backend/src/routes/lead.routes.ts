import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createLeadSchema, leadStatusSchema } from '../schemas/lead.schema';

const router = Router();
const controller = new LeadController();

// Public
router.post('/', validate(createLeadSchema), controller.create);

// Admin
router.get('/admin', authMiddleware, controller.list);
router.patch('/admin/:id/status', authMiddleware, validate(leadStatusSchema), controller.updateStatus);

export default router;
