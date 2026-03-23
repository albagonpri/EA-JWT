import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/config';
import Logging from './library/Logging';
import organizacionRoutes from './routes/Organizacion';
import usuarioRoutes from './routes/Usuario';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const router = express();

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('Mongo connected successfully.');
    StartServer();
  })
  .catch((error) => Logging.error(error));

const StartServer = () => {
  router.use((req, res, next) => {
    Logging.info(
      `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      Logging.info(
        `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(cookieParser());

  router.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
      credentials: true
    })
  );

  router.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  router.use('/auth', authRoutes);
  router.use('/organizaciones', organizacionRoutes);
  router.use('/usuarios', usuarioRoutes);
  router.use('/admin', adminRoutes);

  router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }));

  router.use((req, res, next) => {
    const error = new Error('Not found');
    Logging.error(error);
    res.status(404).json({ message: error.message });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}`)
    );
};