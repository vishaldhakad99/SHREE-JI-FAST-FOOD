import { Request, Response, NextFunction } from 'express';
import { FoodItem } from '../models/FoodItem.js';
import { FoodCategory } from '../models/FoodCategory.js';
import { foodItemSchema, foodItemUpdateSchema, foodCategorySchema } from '../validators/food.validator.js';

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============ CATEGORIES ============
export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await FoodCategory.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = foodCategorySchema.parse(req.body);
    const slug = generateSlug(data.name);

    const existing = await FoodCategory.findOne({ slug });
    if (existing) {
      res.status(409).json({ success: false, message: 'A category with this name already exists.' });
      return;
    }

    const category = await FoodCategory.create({
      ...data,
      slug,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// ============ FOOD ITEMS ============
export const getFoodItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, availableOnly, featuredOnly, specialOnly } = req.query;

    const query: Record<string, any> = {};

    if (category) {
      // Find category by slug or id
      const catDoc = await FoodCategory.findOne({
        $or: [{ slug: category }, { _id: category }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (search && typeof search === 'string') {
      const sanitizedSearch = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    if (featuredOnly === 'true') {
      query.isFeatured = true;
    }

    if (specialOnly === 'true') {
      query.isSpecial = true;
    }

    const items = await FoodItem.find(query)
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

export const getFoodItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await FoodItem.findById(id).populate('category', 'name slug');

    if (!item) {
      res.status(404).json({ success: false, message: 'Food item not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

export const createFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = foodItemSchema.parse(req.body);

    const category = await FoodCategory.findById(data.categoryId);
    if (!category) {
      res.status(400).json({ success: false, message: 'Selected category does not exist.' });
      return;
    }

    let baseSlug = generateSlug(data.name);
    let slug = baseSlug;
    let counter = 1;
    while (await FoodItem.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const foodItem = await FoodItem.create({
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      category: category._id,
      imageUrl: data.imageUrl,
      imagePublicId: data.imagePublicId,
      isVegetarian: data.isVegetarian,
      isAvailable: data.isAvailable,
      isSpecial: data.isSpecial,
      isTodaysSpecial: data.isTodaysSpecial,
      isFeatured: data.isFeatured,
      spiceLevel: data.spiceLevel,
      preparationTimeMinutes: data.preparationTimeMinutes,
      customizationOptions: data.customizationOptions,
      sortOrder: data.sortOrder,
    });

    const populated = await FoodItem.findById(foodItem._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Food item added successfully.',
      item: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = foodItemUpdateSchema.parse(req.body);

    const item = await FoodItem.findById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Food item not found.' });
      return;
    }

    if (data.categoryId) {
      const category = await FoodCategory.findById(data.categoryId);
      if (!category) {
        res.status(400).json({ success: false, message: 'Selected category does not exist.' });
        return;
      }
      item.category = category._id;
    }

    if (data.name && data.name !== item.name) {
      item.name = data.name;
      item.slug = `${generateSlug(data.name)}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    if (data.description !== undefined) item.description = data.description;
    if (data.price !== undefined) item.price = data.price;
    if (data.imageUrl !== undefined) item.imageUrl = data.imageUrl;
    if (data.imagePublicId !== undefined) item.imagePublicId = data.imagePublicId;
    if (data.isVegetarian !== undefined) item.isVegetarian = data.isVegetarian;
    if (data.isAvailable !== undefined) item.isAvailable = data.isAvailable;
    if (data.isSpecial !== undefined) item.isSpecial = data.isSpecial;
    if (data.isTodaysSpecial !== undefined) item.isTodaysSpecial = data.isTodaysSpecial;
    if (data.isFeatured !== undefined) item.isFeatured = data.isFeatured;
    if (data.spiceLevel !== undefined) item.spiceLevel = data.spiceLevel;
    if (data.preparationTimeMinutes !== undefined) item.preparationTimeMinutes = data.preparationTimeMinutes;
    if (data.customizationOptions !== undefined) item.customizationOptions = data.customizationOptions;
    if (data.sortOrder !== undefined) item.sortOrder = data.sortOrder;

    await item.save();

    const populated = await FoodItem.findById(item._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Food item updated successfully.',
      item: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await FoodItem.findByIdAndDelete(id);

    if (!item) {
      res.status(404).json({ success: false, message: 'Food item not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Food item deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
