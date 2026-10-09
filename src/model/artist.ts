import { Schema, model } from 'mongoose';
import { z } from 'zod';

export interface IArtist {
  name: string;
  country?: string;
  formedYear?: number;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ArtistInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: Radiohead
 *         country:
 *           type: string
 *           example: United Kingdom
 *         formedYear:
 *           type: integer
 *           example: 1985
 *     Artist:
 *       allOf:
 *         - $ref: '#/components/schemas/ArtistInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

// Zod checks the request body before it reaches the database
export const artistZodSchema = z.object({
  name: z.string().min(1).max(100),
  country: z.string().min(1).max(100).optional(),
  formedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
});

const artistSchema = new Schema<IArtist>({
  name: { type: String, required: true },
  country: { type: String },
  formedYear: { type: Number, min: 1900 },
});

export const ArtistModel = model<IArtist>('Artist', artistSchema);
