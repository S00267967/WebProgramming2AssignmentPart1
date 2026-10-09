import express, { Application, Request, Response } from "express";
import carRoutes from './routes/cars';
import { authenticateKey } from './middleware/auth.middleware';
import { swaggerSpec } from "./config/swagger";
import swaggerUi from 'swagger-ui-express';

export const app: Application = express();

app.use(express.json());

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.get("/ping", (_req: Request, res: Response) => {
    res.json({ message: "hello from Una" });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/cars', authenticateKey, carRoutes);