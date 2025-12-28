import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      newOrdersCount,
      preparingCount,
      readyCount,
      completedTodayCount,
      lowStockProducts,
    ] = await Promise.all([
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'preparing' }),
      Order.countDocuments({ status: 'ready' }),
      Order.countDocuments({
        status: 'completed',
        createdAt: { $gte: today },
      }),
      Product.countDocuments({ stock: { $lte: 5, $gt: 0 } }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          newOrders: newOrdersCount,
          preparing: preparingCount,
          ready: readyCount,
          completedToday: completedTodayCount,
          lowStock: lowStockProducts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.params;

    const orders = await Order.find({ status })
      .sort({ createdAt: 1 }) // FIFO - oldest first
      .populate('student', 'fullName email studentId')
      .populate('items.product');

    res.json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query: any = {};
    if (status) query.status = status;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('student', 'fullName email studentId')
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

