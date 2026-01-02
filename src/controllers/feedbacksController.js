import { Feedback } from '../models/feedback.js';
import { Tool } from '../models/tool.js';
import createHttpError from 'http-errors';

export const getFeedbacks = async (req, res, next) => {
  try {
    const { toolId, limit } = req.query;

    const page = Number(req.query.page ?? 1);
    const perPage = Number(req.query.perPage ?? 10);

    const skip = (page - 1) * perPage;

    const filter = {};
    if (toolId) filter.toolId = toolId;

    const feedbacksQuery = Feedback.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatarUrl');

    if (limit) {
      const limitNum = Number(limit);
      const feedbacks = await feedbacksQuery.limit(limitNum);
      return res.status(200).json({ totalItems: feedbacks.length, feedbacks });
    }

    const [totalItems, feedbacks] = await Promise.all([
      Feedback.countDocuments(filter),
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
    const userId = req.user._id;
    const { toolId, name, description, rate } = req.body;

    const tool = await Tool.findById(toolId);
    if (!tool) throw createHttpError(404, 'Інструмент не знайдено');

    const feedback = await Feedback.create({
      toolId,
      userId,
      name,
      description,
      rate,
    });

    await Tool.findByIdAndUpdate(toolId, {
      $push: { feedbacks: feedback._id },
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};
