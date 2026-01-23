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

/**
 * @openapi
 * /bookings:
 *   post:
 *     summary: Create booking
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreateInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/', authenticate, celebrate(createBookingSchema), createBooking);

/**
 * @openapi
 * /bookings/{bookingId}:
 *   get:
 *     summary: Get booking by id
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingPopulated'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:bookingId',
  authenticate,
  celebrate(bookingIdParamsSchema),
  getBookingById,
);

/**
 * @openapi
 * /bookings:
 *   get:
 *     summary: Get current user bookings
 *     tags: [Bookings]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer, minimum: 5, maximum: 20, default: 10 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingsListResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/',
  authenticate,
  celebrate(getUserBookingsSchema),
  getUserBookings,
);

export default router;
