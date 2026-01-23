import createHttpError from 'http-errors';
import { Tool } from '../models/tool.js';
import { saveToolImageToCloudinary } from '../utils/saveFileToCloudinary.js';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary.js';

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

export const createTool = async (req, res, next) => {
  try {
    const tool = await Tool.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).json({ tool, toolId: tool._id });
  } catch (error) {
    next(error);
  }
};

export const deleteTool = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const tool = await Tool.findOne({
      _id: toolId,
      owner: req.user._id,
    });

    if (!tool) {
      throw createHttpError(404, 'Інструмент не знайдено');
    }

    const publicId = `toolnext-app/tools/tool_${toolId}`;

    try {
      await deleteFromCloudinary(publicId);
    } catch (error) {
      void error;
    }

    await Tool.deleteOne({ _id: toolId });

    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
};

export const updateTool = async (req, res, next) => {
  try {
    const { toolId } = req.params;

    const tool = await Tool.findOneAndUpdate(
      { _id: toolId, owner: req.user._id },
      req.body,
      {
        new: true,
      },
    );

    if (!tool) {
      throw createHttpError(404, 'Інструмент не знайдено');
    }

    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
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

export const updateToolImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, 'Файл відсутній');
    }

    const { toolId } = req.params;

    const tool = await Tool.findOne({ _id: toolId, owner: req.user._id });
    if (!tool) throw createHttpError(404, 'Інструмент не знайдено');

    const oldPublicId = tool.imagePublicId;

    const result = await saveToolImageToCloudinary(req.file.buffer, toolId);

    const updatedTool = await Tool.findByIdAndUpdate(
      toolId,
      {
        images: result.secure_url,
        imagePublicId: result.public_id,
      },
      { new: true },
    );

    if (oldPublicId && oldPublicId !== result.public._id) {
      await deleteFromCloudinary(oldPublicId);
    }

    res.status(200).json({ url: updatedTool.images });
  } catch (error) {
    next(error);
  }
};
