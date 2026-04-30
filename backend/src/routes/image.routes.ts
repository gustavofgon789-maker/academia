import { Router } from 'express';
import { ImageController } from '../controllers/image.controller';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();
const controller = new ImageController();

router.use(authMiddleware);

router.post('/vehicles/:id/images', upload.array('images', 20), controller.upload);
router.delete('/vehicle-images/:imageId', controller.delete);
router.patch('/vehicle-images/:imageId/main', controller.setMain);
router.patch('/vehicle-images/reorder', controller.reorder);

export default router;
