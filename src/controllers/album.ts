import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { AlbumService } from '../services/albums';
import { ArtistService } from '../services/artist';`
`
const albumService = new AlbumService();
const artistService = new ArtistService();

const getId = (req: Request): string => String(req.params.id);

// query string values can be strings, arrays or objects, we only want strings
const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value !== '' ? value : undefined;

export class AlbumController {
  getAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
      const filter: Record<string, string> = {};
      const genre = asString(req.query.genre);
      const artist = asString(req.query.artist);
      if (genre) filter.genre = genre;
      if (artist) {
        if (!isValidObjectId(artist)) {
          res.status(400).json({ message: 'Invalid artist id' });
          return;
        }
        filter.artist = artist;
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

      const albums = await albumService.getAll({
        filter,
        sort: asString(req.query.sort),
        fields: asString(req.query.fields)?.split(',').join(' '),
        page,
        limit,
      });
      res.status(200).json(albums);
    } catch {
      res.status(500).json({ message: 'Error fetching albums' });
    }
  };

  getAlbumById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getId(req);
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const album = await albumService.getById(id);
      if (!album) {
        res.status(404).json({ message: 'Album not found' });
        return;
      }
      res.status(200).json(album);
    } catch {
      res.status(500).json({ message: 'Error fetching album' });
    }
  };

  createAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
       if (!(await artistService.getById(req.body.artist))) {
         res.status(404).json({ message: 'Artist not found' });
         return;
       }
      res.status(201).json(await albumService.create(req.body));
    } catch {
      res.status(500).json({ message: 'Error creating album' });
    }
  };

  updateAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getId(req);
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
       if (!(await artistService.getById(req.body.artist))) {
        res.status(404).json({ message: 'Artist not found' });
         return;
       }
      const album = await albumService.update(id, req.body);
      if (!album) {
        res.status(404).json({ message: 'Album not found' });
        return;
      }
      res.status(200).json(album);
    } catch {
      res.status(500).json({ message: 'Error updating album' });
    }
  };

  deleteAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getId(req);
      if (!isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const album = await albumService.delete(id);
      if (!album) {
        res.status(404).json({ message: 'Album not found' });
        return;
      }
      res.status(200).json(album);
    } catch {
      res.status(500).json({ message: 'Error deleting album' });
    }
  };
}
