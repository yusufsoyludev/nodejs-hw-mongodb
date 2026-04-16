import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, env('JWT_SECRET'));
  } catch (err) {
    return next(createHttpError(401, 'Access token expired'));
  }
  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Acces token expired'));
  }
  const user = await UserCollection.findById(decodedToken.userID);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }
  req.user = user;
  next();
};
