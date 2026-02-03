import rateLimit from 'express-rate-limit';

export const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Забагато спроб входу. Спробуйте пізніше.' },
});

export const authRegisterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Забагато реєстрацій. Спробуйте пізніше.' },
});

export const authRefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Забагато запитів на оновлення сесії.' },
});
