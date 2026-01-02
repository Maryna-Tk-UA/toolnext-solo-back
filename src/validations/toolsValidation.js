import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value)
    ? helpers.message('Невірний формат ідентифікатора')
    : value;
};

const objectIdSchema = Joi.string().custom(objectIdValidator);

// Валідуємо об'єкт зі specifications
const specsObjectSchema = Joi.object()
  .pattern(
    Joi.string().min(1).max(50), //ключ
    Joi.string().min(1).max(200),
  )
  .max(10); // максимум пар ключ-значення

// Валідація у випадку, коли specifications приходить рядком з JSON
const jsonObjectValidator = (value, helpers) => {
  // перевірка типу
  if (typeof value !== 'string') return value;
  try {
    // розпарсимо і перевіримо структуру об'єкта
    const parsed = JSON.parse(value);
    const { error } = specsObjectSchema.validate(parsed);
    if (error) return helpers.message('Невірно введені дані');
    return parsed;
    // якщо JSON.parse впав
  } catch {
    return helpers.message('specifications must be valid JSON');
  }
};

export const getAllToolsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    categoryId: objectIdSchema.optional(),
    search: Joi.string().trim().allow(''),
  }),
};

export const toolIdParamsSchema = {
  [Segments.PARAMS]: Joi.object({
    toolId: objectIdSchema.required(),
  }),
};

export const createToolSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(96).required(),
    pricePerDay: Joi.number().min(0).required(),
    category: objectIdSchema.required(),
    description: Joi.string().min(20).max(2000).required(),
    rentalTerms: Joi.string().min(20).max(1000).required(),
    specifications: Joi.alternatives()
      .try(
        specsObjectSchema,
        Joi.string().max(1000).custom(jsonObjectValidator),
      )
      .optional(),
  }),
};

export const updateToolSchema = {
  [Segments.PARAMS]: Joi.object({
    toolId: objectIdSchema.required(),
  }),
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(96),
    pricePerDay: Joi.number().min(0),
    category: objectIdSchema,
    description: Joi.string().min(20).max(2000),
    rentalTerms: Joi.string().min(20).max(1000),
    specifications: Joi.alternatives().try(
      specsObjectSchema,
      Joi.string().custom(jsonObjectValidator),
    ),
  }).min(1),
};
