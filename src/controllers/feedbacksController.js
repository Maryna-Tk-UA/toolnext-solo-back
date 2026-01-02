import { Feedback } from '../models/feedback.js';

export const getFeedbacks = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const perPage = Number(req.query.perPage ?? 10);

    const skip = (page - 1) * perPage;

    const feedbacksQuery = Feedback.find();

    const [totalItems, feedbacks] = await Promise.all([
      feedbacksQuery.clone().countDocuments(),
      feedbacksQuery.skip(skip).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      page,
      perPage,
      totalItems,
      totalPages,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

export const createFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};
