import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { generateOrderNumber } from '../utils/generateOrderNumber';
import { generateQRCode } from '../utils/generateQRCode';
import { NotFoundError, ValidationError } from '../utils/errorHandler';
import { createNotification } from '../services/notification.service';
import { OrderStatus } from '../models/Order';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { items, paymentMethod, notes } = req.body;
    const userId = req.user!._id;

    if (!items || items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    // Validate and fetch products
    const productIds = items.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      throw new ValidationError('One or more products not found');
    }

    // Build order items with prices and names
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new ValidationError(`Product ${item.productId} not found`);
      }

      if (!product.isAvailable || product.stock < item.quantity) {
        throw new ValidationError(`Product ${product.name.fr} is not available in requested quantity`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    }

    // Generate order number and QR code
    const orderNumber = generateOrderNumber();
    const qrCode = await generateQRCode(orderNumber);

    // Create order
    const order = await Order.create({
      orderNumber,
      qrCode,
      student: userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
      status: 'pending',
      notes,
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Send notification
    await createNotification(
      userId.toString(),
      'order_confirmed',
      {
        fr: 'Commande confirmée',
        ar: 'تم تأكيد الطلب',
        en: 'Order confirmed',
      },
      {
        fr: `Votre commande #${orderNumber} a été confirmée`,
        ar: `تم تأكيد طلبك #${orderNumber}`,
        en: `Your order #${orderNumber} has been confirmed`,
      },
      { orderId: order._id.toString() }
    );

    await order.populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { status, page = 1, limit = 20 } = req.query;

    const query: any = { student: userId };
    if (status) {
      query.status = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('items.product');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, student: userId }).populate(
      'items.product'
    );

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: OrderStatus[] = [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'completed',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status');
    }

    const order = await Order.findById(id).populate('student');

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.status = status;
    if (status === 'completed') {
      order.completedAt = new Date();
    }
    await order.save();

    // Send notification when order is ready
    if (status === 'ready') {
      const studentId = typeof order.student === 'object' && order.student?._id 
        ? order.student._id.toString() 
        : order.student.toString();
      await createNotification(
        studentId,
        'order_ready',
        {
          fr: 'Commande prête! 🎉',
          ar: 'الطلب جاهز! 🎉',
          en: 'Order ready! 🎉',
        },
        {
          fr: `Votre commande #${order.orderNumber} est prête à être récupérée`,
          ar: `طلبك #${order.orderNumber} جاهز للاستلام`,
          en: `Your order #${order.orderNumber} is ready for pickup`,
        },
        { orderId: order._id.toString() }
      );
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user!._id;

    const order = await Order.findOne({ _id: id, student: userId }).populate(
      'items.product'
    );

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new ValidationError('Order cannot be cancelled at this stage');
    }

    order.status = 'cancelled';
    order.cancellationReason = cancellationReason;
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

