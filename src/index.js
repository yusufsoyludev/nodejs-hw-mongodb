import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstap = async () => {
  dotenv.config();
  await initMongoConnection();
  setupServer();
};
bootstap();
