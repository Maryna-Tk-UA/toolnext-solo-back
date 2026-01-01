import { Feedback } from '../models/feedback.js';

export const getFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find();
  res.status(200).json(feedbacks);
};

export const createFeedback = async (req, res) => {
  const feedback = await Feedback.create(req.body);
  res.status(201).json(feedback);
};
