import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const authenticateKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Missing x-api-key header',
    });
    return;
  }

  if (apiKey !== env.apiKey) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Invalid x-api-key',
    });
    return;
  }
  next();
};
