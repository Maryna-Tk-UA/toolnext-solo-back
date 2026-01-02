import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Невірний формат ідентифікатора')
    : value;
};

const objectIdSchema = Joi.string().custom(objectIdValidator);

export const userIdParamsSchema = {
  [Segments.PARAMS]: Joi.object({
    userId: objectIdSchema.required(),
  }),
};

export const usersToolsSchema = {
  ...userIdParamsSchema,
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(64),
    avatarUrl: Joi.string().uri(),
  }).min(1),
};
