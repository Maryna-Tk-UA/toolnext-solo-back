import { Router } from 'express';
import {
  createBooking,
  getBookingById,
  getUserBookings,
} from '../controllers/bookingsController.js';
import { celebrate } from 'celebrate';
import {
  bookingIdParamsSchema,
  createBookingSchema,
  getUserBookingsSchema,
} from '../validations/bookingsValidation.js';

const router = Router();

router.post('/', celebrate(createBookingSchema), createBooking);

router.get('/:bookingId', celebrate(bookingIdParamsSchema), getBookingById);

router.get('/', celebrate(getUserBookingsSchema), getUserBookings);

export default router;
