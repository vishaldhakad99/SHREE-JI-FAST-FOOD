import { Request, Response, NextFunction } from 'express';
import { DailyMenu } from '../models/DailyMenu.js';
import { dailyMenuSchema, dailyMenuUpdateSchema } from '../validators/dailyMenu.validator.js';
import { AuthenticatedRequest } from '../types/index.js';

const getLocalDateString = (d: Date = new Date()): string => {
  return d.toISOString().split('T')[0];
};

export const getTodayMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requestedDate = (req.query.date as string) || getLocalDateString();

    const menu = await DailyMenu.findOne({
      dateString: requestedDate,
      isActive: true,
    }).populate('items.foodItem', 'name description price imageUrl isVegetarian');

    if (!menu) {
      res.status(200).json({
        success: true,
        date: requestedDate,
        hasMenu: false,
        message: "Today's menu will be updated soon. Please contact us for availability.",
        menu: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      date: requestedDate,
      hasMenu: true,
      menu,
    });
  } catch (error) {
    next(error);
  }
};

export const listMenus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [menus, total] = await Promise.all([
      DailyMenu.find()
        .sort({ dateString: -1 })
        .skip(skip)
        .limit(limit),
      DailyMenu.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      menus,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateDailyMenu = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = dailyMenuSchema.parse(req.body);

    const dateObj = new Date(data.date + 'T00:00:00.000Z');

    let menu = await DailyMenu.findOne({ dateString: data.date });

    if (menu) {
      // Update existing menu
      menu.title = data.title;
      menu.specialAnnouncement = data.specialAnnouncement;
      menu.items = data.items as any;
      menu.isActive = data.isActive;
      menu.date = dateObj;
      if (req.admin?.id) menu.createdBy = req.admin.id as any;
      await menu.save();

      res.status(200).json({
        success: true,
        message: 'Daily menu updated successfully.',
        menu,
      });
      return;
    }

    // Create new daily menu
    menu = await DailyMenu.create({
      date: dateObj,
      dateString: data.date,
      title: data.title,
      specialAnnouncement: data.specialAnnouncement,
      items: data.items,
      isActive: data.isActive,
      createdBy: req.admin?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Daily menu created successfully.',
      menu,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDailyMenuById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = dailyMenuUpdateSchema.parse(req.body);

    const menu = await DailyMenu.findById(id);
    if (!menu) {
      res.status(404).json({ success: false, message: 'Daily menu not found.' });
      return;
    }

    if (data.title !== undefined) menu.title = data.title;
    if (data.specialAnnouncement !== undefined) menu.specialAnnouncement = data.specialAnnouncement;
    if (data.items !== undefined) menu.items = data.items as any;
    if (data.isActive !== undefined) menu.isActive = data.isActive;
    if (data.date !== undefined) {
      menu.dateString = data.date;
      menu.date = new Date(data.date + 'T00:00:00.000Z');
    }

    await menu.save();

    res.status(200).json({
      success: true,
      message: 'Daily menu updated successfully.',
      menu,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDailyMenu = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const menu = await DailyMenu.findByIdAndDelete(id);

    if (!menu) {
      res.status(404).json({ success: false, message: 'Daily menu not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Daily menu removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
