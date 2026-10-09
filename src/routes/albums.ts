import { Router } from 'express';
import { CarController } from '../controllers/album';
import {validate} from '../middleware/validate.middleware';
import { carZodSchema } from '../model/albums';

const router = Router();
const carController = new CarController();

router.get('/', carController.getCars);

router.get('/:id', carController.getCarById);
router.post('/', validate(carZodSchema), carController.createCar);
router.put('/:id', validate(carZodSchema), carController.updateCar);
router.delete('/:id', carController.deleteCar);

export default router;
