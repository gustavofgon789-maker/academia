import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { updateSettingsSchema } from '../schemas/settings.schema';

const controller = new SettingsController();

export const settingsPublicRouter = Router();
settingsPublicRouter.get('/', controller.get);

export const settingsAdminRouter = Router();
settingsAdminRouter.use(authMiddleware);
settingsAdminRouter.get('/', controller.get);
settingsAdminRouter.put('/', validate(updateSettingsSchema), controller.update);
