import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';    
import swaggerUi from 'swagger-ui-express';
import albumRoutes from './routes/albums';
import artistRoutes from './routes/artist';
import { authenticateKey } from './middleware/auth.middleware';
import { logRequest } from './middleware/log.middleware';
import { swaggerSpec } from './config/swagger';

export const app: Application = express();

// CORS must come first so the browser's OPTIONS preflight (which has no api key) succeeds
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(logRequest);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/albums', authenticateKey, albumRoutes);
app.use('/api/v1/artists', authenticateKey, artistRoutes);

// unknown route -> JSON 404 instead of Express's default HTML page
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// last-resort error handler (e.g. malformed JSON body) -> JSON instead of an HTML stack trace
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status =
    typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
      ? err.status
      : 500;
  res.status(status).json({ message: status === 500 ? 'Internal server error' : 'Bad request' });
});
