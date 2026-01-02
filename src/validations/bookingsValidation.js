import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Невірний формат ідентифікатора')
    : value;
};

const objectIdSchema = Joi.string().custom(objectIdValidator);

const dateStringSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .messages({
    'string.pattern.base': 'Дата має бути у форматі YYYY-MM-DD',
  });

// local midnight
const toDateMidnight = (yyyyMmDd) => {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};

const validateStartDateMinToday = (value, helpers) => {
  const dt = toDateMidnight(value);
  if (Number.isNaN(dt.getTime())) return helpers.message('Невірна дата');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dt < today) {
    return helpers.message(
      'Дата початку оренди не може бути раніше поточної дати',
    );
  }

  return value;
};

const validateEndDateMinStartDate = (value, helpers) => {
  const { startDate } = helpers.state.ancestors[0];
  if (!startDate) return value;

  const start = toDateMidnight(startDate);
  const end = toDateMidnight(value);

  if (Number.isNaN(end.getTime()) || Number.isNaN(start.getTime())) {
    return helpers.message('Невірний формат дат');
  }

  if (end < start) {
    return helpers.message(
      'Дата закінчення оренди не може бути раніше дати початку оренди',
    );
  }

  return value;
};

const phoneSchema = Joi.string()
  .trim()
  .pattern(/^\+?\d{10,12}$/)
  .messages({
    'string.pattern.base': 'Невірний формат номера телефону',
  });

export const createBookingSchema = {
  [Segments.BODY]: Joi.object({
    toolId: objectIdSchema.required(),
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    phone: phoneSchema.required(),
    startDate: dateStringSchema.custom(validateStartDateMinToday).required(),
    endDate: dateStringSchema.custom(validateEndDateMinStartDate).required(),
    deliveryCity: Joi.string().trim().min(2).max(100).required(),
    deliveryBranch: Joi.string().trim().min(1).max(200).required(),
  }),
};

export const bookingIdParamsSchema = {
  [Segments.PARAMS]: Joi.object({
    bookingId: objectIdSchema.required(),
  }),
};

// export const getUserBookingsSchema = {
//   [Segments.QUERY]: Joi.object({
//     userId: objectIdSchema.required(),
//   }),
// };

export const getUserBookingsSchema = {
  [Segments.QUERY]: Joi.object({
    userId: objectIdSchema.required(),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};
