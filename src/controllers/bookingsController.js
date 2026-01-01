import createHttpError from 'http-errors';
import { Booking } from '../models/booking.js';
import { Tool } from '../models/tool.js';

export const createBooking = async (req, res, next) => {
  try {
    const {
      userId,
      toolId,
      firstName,
      lastName,
      phone,
      deliveryCity,
      deliveryBranch,
      startDate,
      endDate,
    } = req.body;

    if (!userId || !toolId || !startDate || !endDate) {
      throw createHttpError(400, 'Необхідні поля відсутні');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw createHttpError(400, 'Невірний формат дат');
    }

    if (start > end) {
      throw createHttpError(
        400,
        'Дата початку не може бути пізніше дати завершення',
      );
    }

    const tool = await Tool.findById(toolId);

    if (!tool) {
      throw createHttpError(404, 'Інструмент не знайдено');
    }

    // перевірка на перетин з уже заброньованими датами
    const hasOverlap = tool.bookedDates.some((range) => {
      const existingStart = new Date(range.startDate);
      const existingEnd = new Date(range.endDate);

      return start <= existingEnd && end >= existingStart;
    });

    if (hasOverlap) {
      throw createHttpError(
        400,
        'Інструмент уже заброньований на обрані дати. Оберіть, будь ласка, інший період.',
      );
    }

    // створюю бронювання
    const booking = await Booking.create({
      userId,
      toolId,
      firstName,
      lastName,
      phone,
      deliveryCity,
      deliveryBranch,
      startDate: start,
      endDate: end,
    });

    // оновлюю bookedDates у Tool
    tool.bookedDates.push({
      startDate: start,
      endDate: end,
      bookedBy: userId,
      bookingId: booking._id,
    });

    await tool.save();

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('toolId', 'name images pricePerDay')
      .populate('userId', 'name email');

    if (!booking) {
      throw createHttpError(404, 'Бронювання не знайдено');
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      throw createHttpError(400, 'Користувача не знайдено');
    }

    const bookings = await Booking.find({ userId })
      .sort({ startDate: -1 })
      .populate('toolId', 'name images pricePerDay')
      .populate('userId', 'name email');

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};
