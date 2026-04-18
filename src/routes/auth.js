import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema, resetPasswordSchema, sendResetEmailSchema } from '../validation/auth.js';
import {
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { valid } from 'joi';

const router = Router();
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);
export default router;
