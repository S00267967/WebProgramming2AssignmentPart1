import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

export interface IAlbum {
  title: string;
  artist: Types.ObjectId;
  releaseYear?: number;
  genre?: string;
  rating?: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AlbumInput:
 *       type: object
 *       required: [title, artist]
 *       properties:
 *         title:
 *           type: string
 *           example: OK Computer
 *         artist:
 *           type: string
 *           description: The _id of an existing artist
 *           example: 665f1c2e8f1b2a0012a4b3c4
 *         releaseYear:
 *           type: integer
 *           example: 1997
 *         genre:
 *           type: string
 *           example: Rock
 *         rating:
 *           type: number
 *           example: 9.5
 *     Album:
 *       allOf:
 *         - $ref: '#/components/schemas/AlbumInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 */

// Zod checks the request body before it reaches the database
export const albumZodSchema = z.object({
  title: z.string().min(1).max(100),
  artist: z.string().regex(/^[0-9a-fA-F]{24}$/, 'artist must be a valid id'),
  releaseYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  genre: z.string().min(1).max(50).optional(),
  rating: z.number().min(0).max(10).optional(),
});

const albumSchema = new Schema<IAlbum>({
  title: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  releaseYear: { type: Number, min: 1900 },
  genre: { type: String },
  rating: { type: Number, min: 0, max: 10 },
});

export const AlbumModel = model<IAlbum>('Album', albumSchema);
