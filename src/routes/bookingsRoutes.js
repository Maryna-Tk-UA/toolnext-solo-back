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
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/', authenticate, celebrate(createBookingSchema), createBooking);

router.get(
  '/:bookingId',
  authenticate,
  celebrate(bookingIdParamsSchema),
  getBookingById,
);

router.get(
  '/',
  authenticate,
  celebrate(getUserBookingsSchema),
  getUserBookings,
);

export default router;
