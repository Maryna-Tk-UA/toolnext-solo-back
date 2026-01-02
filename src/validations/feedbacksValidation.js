import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Невірний формат ідентифікатора')
    : value;
};

const objectIdSchema = Joi.string().custom(objectIdValidator);

export const getFeedbacksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object({
    toolId: objectIdSchema.required(),
    userId: objectIdSchema.required(),
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(10).max(1000).required(),
    rate: Joi.number().integer().min(1).max(5).required(),
  }),
};
