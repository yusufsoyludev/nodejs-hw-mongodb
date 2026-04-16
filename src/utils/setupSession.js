import jwt from 'jsonwebtoken';
import { SessionCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAY } from '../constants/index.js';
import { env } from '../utils/env.js';

export const setupSession = async (userId) => {
  await SessionCollection.deleteOne({ userId });
  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + THIRTY_DAY);
  const accessToken = jwt.sign({ userId }, env('JWT_SECRET'), {
    expireIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, env('JWT_REFRESH'), {
    expireIn: '30d',
  });
  const session = await SessionCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  return session;
};
