import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(pinoHttp());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
