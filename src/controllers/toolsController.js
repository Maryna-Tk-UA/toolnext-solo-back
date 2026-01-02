import createHttpError from 'http-errors';
import { Tool } from '../models/tool.js';

export const getAllTools = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const perPage = Number(req.query.perPage ?? 10);
    const categoryId = req.query.categoryId;
    const search = (req.query.search ?? '').trim();

    const skip = (page - 1) * perPage;

    const toolsQuery = Tool.find();

    if (search.length > 0) {
      toolsQuery.where({ $text: { $search: search } });
    }

    if (categoryId) {
      toolsQuery.where('category').equals(categoryId);
    }

    const filter = toolsQuery.getFilter();

    const [totalItems, tools] = await Promise.all([
      Tool.countDocuments(filter),
      toolsQuery.sort({ createdAt: -1 }).skip(skip).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      page,
      perPage,
      totalItems,
      totalPages,
      tools,
    });
  } catch (error) {
    next(error);
  }
};

export const getToolById = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const tool = await Tool.findById(toolId);

    if (!tool) {
      throw createHttpError(404, 'Інструмент не знайдено');
    }

    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
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
    const page = Number(req.query.page ?? 1);
    const perPage = Number(req.query.perPage ?? 10);

    const skip = (page - 1) * perPage;

    const toolsQuery = Tool.find({ owner: userId }).sort({ createdAt: -1 });
    // .populate() можливо

    const [totalItems, tools] = await Promise.all([
      toolsQuery.clone().countDocuments(),
      toolsQuery.skip(skip).limit(perPage),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      page,
      perPage,
      totalItems,
      totalPages,
      tools,
    });
  } catch (error) {
    next(error);
  }
};
