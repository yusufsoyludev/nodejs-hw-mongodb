import { parseCookies } from '../utils/parseCookies.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
} from '../services/auth.js';

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
