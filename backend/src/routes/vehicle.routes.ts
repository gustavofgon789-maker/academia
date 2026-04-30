import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';

const router = Router();
const controller = new VehicleController();

router.get('/', controller.list);
router.get('/featured', controller.featured);
router.get('/brands', controller.getBrands);
router.get('/:slug', controller.getBySlug);

export default router;
