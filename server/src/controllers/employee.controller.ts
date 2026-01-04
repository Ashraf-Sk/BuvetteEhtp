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

export const getReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 30); // Default to last 30 days

    const end = endDate ? new Date(endDate as string) : new Date();
    end.setHours(23, 59, 59, 999);

    // Get all completed orders in date range
    const orders = await Order.find({
      status: 'completed',
      completedAt: { $gte: start, $lte: end },
    })
      .populate('items.product')
      .populate('student', 'fullName');

    // Calculate statistics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Top products
    const productStats: Record<string, { product: any; quantity: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product.toString();
        if (!productStats[productId]) {
          productStats[productId] = {
            product: item.product,
            quantity: 0,
            revenue: 0,
          };
        }
        productStats[productId].quantity += item.quantity;
        productStats[productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Orders by status (all time)
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap: Record<string, number> = {};
    ordersByStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    // Revenue by day
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const revenueByDayFormatted = revenueByDay.map((item) => ({
      date: item._id,
      revenue: item.revenue,
      orders: item.orders,
    }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topProducts,
        ordersByStatus: statusMap,
        revenueByDay: revenueByDayFormatted,
      },
    });
  } catch (error) {
    next(error);
  }
};

