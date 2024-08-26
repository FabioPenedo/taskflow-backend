import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/router';

dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

server.use(apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
    const statusCode = err.statusCode || 500
    const errorMessage = err.statusCode ? err.message : 'Internal Server Error.'
    res.status(statusCode).json({errorMessage})
    console.log(err);
}

server.use(errorHandler);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});