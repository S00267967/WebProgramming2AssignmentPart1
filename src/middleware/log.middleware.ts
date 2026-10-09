import { Request, Response, NextFunction } from 'express';

export const logRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { method, url, headers, body } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} ${url}`);
    next();
};