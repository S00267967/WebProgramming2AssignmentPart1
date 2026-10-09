import { Router } from 'express';
import { ArtistController } from '../controllers/artist';
import { validate } from '../middleware/validate.middleware';
import { artistZodSchema } from '../model/artist';

const router = Router();
const controller = new ArtistController();

router.get('/', controller.getArtists);
router.get('/:id', controller.getArtistById);
router.get('/:id/albums', controller.getAlbumsByArtist);
router.post('/', validate(artistZodSchema), controller.createArtist);
router.put('/:id', validate(artistZodSchema), controller.updateArtist);
router.delete('/:id', controller.deleteArtist);

export default router;
