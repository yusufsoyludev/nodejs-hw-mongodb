import { parseCookies } from '../utils/parseCookies.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';
import { sendEmail } from '../utils/sendEmail.js';
import { createResetToken } from '../utils/createResetToken.js';
const setRefreshTokenCookie = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: session.refreshTokenValidUntil,
  });
};
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered user!',
    data: user,
  });
};
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  setRefreshTokenCookie(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export const refreshUserSessionController = async (req, res) => {
  const { refreshToken } = parseCookies(req);
  const session = await refreshUsersSession(refreshToken);
  setRefreshTokenCookie(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export const logoutUserController = async (req, res) => {
  const { refreshToken } = parseCookies(req);
  await logoutUser(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
};
export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const token = createResetToken(email);
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
  try {
    await sendEmail({
      to: email,
      subject: 'Reset password',
      html: `<a href="${resetLink}">Reset Password</a>`,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};
export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
  await SessionCollection.deleteMany({ userId: user._id });
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
