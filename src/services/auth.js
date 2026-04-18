import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import { setupSession } from '../utils/setupSession.js';
import { env } from '../utils/env.js';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashedPassword,
  });

  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};
export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Email or password is wrong');
  }
  const session = await setupSession(user._id);
  return session;
};
export const refreshUsersSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token is missing');
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, env('JWT_REFRESH'));
  } catch {
    throw createHttpError(401, 'Refresh token is expired or invalid');
  }
  const session = await SessionCollection.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Refresh token expired');
  }
  await SessionCollection.deleteOne({ _id: session._id });
  const newSession = await setupSession(decodedToken.userId);
  return newSession;
};
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  await SessionCollection.deleteOne({ refreshToken });
};
