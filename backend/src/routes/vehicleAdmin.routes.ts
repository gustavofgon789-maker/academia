import { Router } from 'express';
import { VehicleAdminController } from '../controllers/vehicleAdmin.controller';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleStatusSchema,
  vehiclePriceSchema,
  vehicleFeaturedSchema,
  vehiclePromotionSchema,
} from '../schemas/vehicle.schema';

const router = Router();
const controller = new VehicleAdminController();

router.use(authMiddleware);

router.get('/stats', controller.getStats);
router.get('/', controller.listAll);
router.get('/:id', controller.getById);
router.post('/', validate(createVehicleSchema), controller.create);
router.put('/:id', validate(updateVehicleSchema), controller.update);
router.delete('/:id', controller.delete);
router.patch('/:id/status', validate(vehicleStatusSchema), controller.updateStatus);
router.patch('/:id/price', validate(vehiclePriceSchema), controller.updatePrice);
router.patch('/:id/featured', validate(vehicleFeaturedSchema), controller.toggleFeatured);
router.patch('/:id/promotion', validate(vehiclePromotionSchema), controller.togglePromotion);

export default router;
