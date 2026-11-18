import { Request, Response, NextFunction } from 'express';
import { OrderEnquiry } from '../models/OrderEnquiry.js';
import { FoodItem } from '../models/FoodItem.js';
import { RestaurantSettings } from '../models/RestaurantSettings.js';
import { orderEnquirySchema, updateOrderStatusSchema } from '../validators/order.validator.js';

export const createOrderEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = orderEnquirySchema.parse(req.body);

    let estimatedPrice: number | undefined;

    if (data.foodItemId) {
      const foodItem = await FoodItem.findById(data.foodItemId);
      if (foodItem) {
        estimatedPrice = foodItem.price * data.quantity;
      }
    }

    const orderNumber = `SJ-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await OrderEnquiry.create({
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      foodItemId: data.foodItemId,
      foodItemName: data.foodItemName,
      quantity: data.quantity,
      deliveryType: data.deliveryType,
      deliveryAddress: data.deliveryAddress,
      additionalRequirements: data.additionalRequirements,
      estimatedPrice,
      source: data.source || 'website_form',
      status: 'new',
    });

    // Fetch restaurant WhatsApp settings to build formatted link (Guaranteed fallback to 8839290150)
    const settings = await RestaurantSettings.findOne();
    const rawPhone = settings?.whatsappNumber || settings?.phoneNumber || '8839290150';
    let cleanPhone = rawPhone.replace(/[^\d]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const whatsappMessage = encodeURIComponent(
      `*New Order #${orderNumber} - Shree Ji Fast Food*\n\n` +
      `👤 *Customer Name:* ${data.customerName}\n` +
      `📞 *Phone:* ${data.customerPhone}\n` +
      `🍲 *Requested Item:* ${data.foodItemName}\n` +
      `🔢 *Quantity:* ${data.quantity}\n` +
      `🚚 *Service:* ${data.deliveryType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}\n` +
      (data.deliveryAddress ? `📍 *Address:* ${data.deliveryAddress}\n` : '') +
      (data.additionalRequirements ? `📝 *Customization / Note:* ${data.additionalRequirements}\n` : '') +
      `\n_Order ID: ${orderNumber} | Please confirm availability._`
    );

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMessage}`;

    res.status(201).json({
      success: true,
      message: 'Order inquiry submitted successfully. The restaurant will review and confirm availability.',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        foodItemName: order.foodItemName,
        quantity: order.quantity,
        deliveryType: order.deliveryType,
        status: order.status,
        createdAt: order.createdAt,
      },
      whatsappUrl,
      whatsappMessageText: decodeURIComponent(whatsappMessage),
      confirmationDisclaimer: 'Important: This is an inquiry. Your order will be confirmed once the restaurant verifies availability and preparation time.',
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderEnquiries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    const filter: Record<string, any> = {};

    if (status && typeof status === 'string' && status !== 'all') {
      filter.status = status;
    }

    if (search && typeof search === 'string') {
      const sanitized = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      filter.$or = [
        { customerName: { $regex: sanitized, $options: 'i' } },
        { customerPhone: { $regex: sanitized, $options: 'i' } },
        { foodItemName: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const [orders, total] = await Promise.all([
      OrderEnquiry.find(filter)
        .populate('foodItemId', 'name price imageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OrderEnquiry.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderEnquiryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await OrderEnquiry.findById(id).populate('foodItemId');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order inquiry not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = updateOrderStatusSchema.parse(req.body);

    const order = await OrderEnquiry.findById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order inquiry not found.' });
      return;
    }

    order.status = data.status;
    order.statusUpdatedAt = new Date();
    if (data.adminNotes !== undefined) {
      order.adminNotes = data.adminNotes;
    }
    if ((req.body as any).estimatedTime !== undefined) {
      order.estimatedTime = (req.body as any).estimatedTime;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to '${data.status}'.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const phone = req.query.phone as string;
    if (!phone) {
      res.status(400).json({ success: false, message: 'Phone number is required' });
      return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const shortPhone = cleanDigits.length === 12 && cleanDigits.startsWith('91') ? cleanDigits.substring(2) : cleanDigits;

    const orders = await OrderEnquiry.find({
      $or: [
        { customerPhone: cleanDigits },
        { customerPhone: shortPhone },
        { customerPhone: { $regex: shortPhone } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [total, newOrders, contacted, accepted, rejected, completed] = await Promise.all([
      OrderEnquiry.countDocuments(),
      OrderEnquiry.countDocuments({ status: 'new' }),
      OrderEnquiry.countDocuments({ status: 'contacted' }),
      OrderEnquiry.countDocuments({ status: 'accepted' }),
      OrderEnquiry.countDocuments({ status: 'rejected' }),
      OrderEnquiry.countDocuments({ status: 'completed' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        new: newOrders,
        contacted,
        accepted,
        rejected,
        completed,
        pending: newOrders + contacted,
      },
    });
  } catch (error) {
    next(error);
  }
};
