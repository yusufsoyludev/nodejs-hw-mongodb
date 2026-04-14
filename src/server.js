import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contacts.js';

export const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());
  app.use('/contacts', contactsRouter);
  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
