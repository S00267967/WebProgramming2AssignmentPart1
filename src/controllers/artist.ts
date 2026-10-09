import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { ArtistService } from '../services/artist';
import { AlbumService } from '../services/albums';

const artistService = new ArtistService();
const albumService = new AlbumService();

// Express types req.params.id as string | string[], so make it a string
const getId = (req: Request): string => String(req.params.id);

export class ArtistController {
  getArtists = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await artistService.getAll());
    } catch {
      res.status(500).json({ message: 'Error fetching artists' });
    }
  };

  getArtistById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getId(req);
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const artist = await artistService.getById(id);
      if (!artist) {
        res.status(404).json({ message: 'Artist not found' });
        return;
      }
      res.status(200).json(artist);
    } catch {
      res.status(500).json({ message: 'Error fetching artist' });
    }
  };

  getAlbumsByArtist = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getId(req);
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      if (!(await artistService.getById(id))) {
        res.status(404).json({ message: 'Artist not found' });
        return;
      }
      res.status(200).json(await albumService.getByArtist(id));
    } catch {
      res.status(500).json({ message: 'Error fetching albums' });
    }
  };

  createArtist = async (req: Request, res: Response): Promise<void> => {
    try {
      // the body was already checked by the validate middleware
      res.status(201).json(await artistService.create(req.body));
    } catch {
      res.status(500).json({ message: 'Error creating artist' });
    }
  };

  updateArtist = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getId(req);
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const artist = await artistService.update(id, req.body);
      if (!artist) {
        res.status(404).json({ message: 'Artist not found' });
        return;
      }
      res.status(200).json(artist);
    } catch {
      res.status(500).json({ message: 'Error updating artist' });
    }
  };

  deleteArtist = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getId(req);
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const artist = await artistService.delete(id);
      if (!artist) {
        res.status(404).json({ message: 'Artist not found' });
        return;
      }
      await albumService.deleteByArtist(id); // remove their albums too
      res.status(200).json(artist);
    } catch {
      res.status(500).json({ message: 'Error deleting artist' });
    }
  };
}
