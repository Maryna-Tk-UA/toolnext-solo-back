import { Router } from 'express';
import {
  createBooking,
  getBookingById,
  getUserBookings,
} from '../controllers/bookingsController.js';

const router = Router();

router.post('/', createBooking);

router.get('/:bookingId', getBookingById);

router.get('/', getUserBookings);

export default router;
