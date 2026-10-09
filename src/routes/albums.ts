import { Router } from 'express';
import { AlbumController } from '../controllers/album';
import { validate } from '../middleware/validate.middleware';
import { albumZodSchema } from '../model/albums';

const router = Router();
const controller = new AlbumController();

router.get('/', controller.getAlbums);
router.get('/:id', controller.getAlbumById);
router.post('/', validate(albumZodSchema), controller.createAlbum);
router.put('/:id', validate(albumZodSchema), controller.updateAlbum);
router.delete('/:id', controller.deleteAlbum);

export default router;
