import createHttpError from 'http-errors';
import { User } from '../models/user.js';

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, 'Користувач не знайдений');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const allowedFields = ['name', 'avatarUrl'];
    const updateData = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw createHttpError(400, 'Немає даних для оновлення');
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select('-password');

    if (!updatedUser) {
      throw createHttpError(404, 'Користувача не знайдено');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
