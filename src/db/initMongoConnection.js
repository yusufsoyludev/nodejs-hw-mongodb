import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

  const mongoUrl = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;
  await mongoose.connect(mongoUrl);

  console.log('MongoDB connection established');
};