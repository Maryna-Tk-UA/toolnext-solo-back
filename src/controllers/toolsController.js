import createHttpError from 'http-errors';
import { Tool } from '../models/tool.js';

export const getAllTools = async (req, res) => {
  const tools = await Tool.find();
  res.status(200).json(tools);
};

export const getToolById = async (req, res) => {
  const { toolId } = req.params;
  const tool = await Tool.findById(toolId);

  if (!tool) {
    throw createHttpError(404, 'Інструмент не знайдено');
  }

  res.status(200).json(tool);
};

export const createTool = async (req, res) => {
  const tool = await Tool.create(req.body);
  res.status(201).json(tool);
};

export const deleteTool = async (req, res) => {
  const { toolId } = req.params;
  const tool = await Tool.findOneAndDelete({
    _id: toolId,
  });

  if (!tool) {
    throw createHttpError(404, 'Інструмент не знайдено');
  }

  res.status(200).json(tool);
};

export const updateTool = async (req, res) => {
  const { toolId } = req.params;

  const tool = await Tool.findOneAndUpdate({ _id: toolId }, req.body, {
    new: true,
  });

  if (!tool) {
    throw createHttpError(404, 'Інструмент не знайдено');
  }

  res.status(200).json(tool);
};

export const getUserTools = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw createHttpError(400, 'Користувача не знайдено');
    }

    const tools = await Tool.find({ owner: userId }).sort({ createdAt: -1 });
    // .populate() можливо

    res.status(200).json(tools);
  } catch (error) {
    next(error);
  }
};
