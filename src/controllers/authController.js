import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import {
  clearSessionCookies,
  createSession,
  setSessionCookies,
} from '../services/auth.js';
import { Session } from '../models/session.js';
import { safeCompare } from '../utils/safeCompare.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'Email використовується');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const newSession = await createSession(newUser._id);

    setSessionCookies(res, newSession);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw createHttpError(401, 'Невалідні данні');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw createHttpError(401, 'Невалідні данні');
    }

    // видалення старої сесії користувача
    await Session.deleteOne({ userId: user._id });

    // створення нової сесії
    const newSession = await createSession(user._id);

    setSessionCookies(res, newSession);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    clearSessionCookies(res);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.cookies.sessionId);
    if (!session) {
      throw createHttpError(401, 'Сесії не знайдено');
    }

    const isValid = safeCompare(session.refreshToken, req.cookies.refreshToken);
    if (!isValid) {
      throw createHttpError(401, 'Сесії не знайдено');
    }

    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Термін дії сесії минув');
    }

    await Session.deleteOne({ _id: session._id });

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: 'Сесію оновлено' });
  } catch (error) {
    next(error);
  }
};
