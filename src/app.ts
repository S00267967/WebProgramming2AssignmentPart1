import express, { Application, Request, Response } from "express";
import swaggerUi from 'swagger-ui-express';
import albumRoutes from './routes/albums';
import artistRoutes from './routes/artist';
import { authenticateKey } from './middleware/auth.middleware';
import { swaggerSpec } from "./config/swagger";

export const app: Application = express();

app.use(express.json());

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/albums', authenticateKey, albumRoutes);
app.use('/api/v1/artists', authenticateKey, artistRoutes);
