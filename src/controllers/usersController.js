import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError(404, 'Користувач не знайдений');
  }
  res.status(200).json(user);
};
