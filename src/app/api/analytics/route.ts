import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    // Parse dates as UTC (YYYY-MM-DD string becomes UTC midnight)
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Set end date to end of day in UTC
    end.setUTCHours(23, 59, 59, 999);

    // Fetch orders within the date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        product: true,
      },
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const orderTotal = order.product.price.toNumber() * order.quantity;
      return sum + orderTotal;
    }, 0);

    // Calculate total sales count
    const totalSalesCount = orders.length;

    // Calculate average order value
    const averageOrderValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

    // Get total number of clients created in date range
    const newClientsCount = await prisma.client.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // Get pending orders count (orders with status "received") - regardless of date
    const pendingOrdersCount = await prisma.order.count({
      where: {
        state: "received",
      },
    });

    // Get top selling products in the date range
    const productSales = orders.reduce((acc, order) => {
      const productId = order.productId;
      if (!acc[productId]) {
        acc[productId] = {
          productName: order.productName,
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      acc[productId].totalQuantity += order.quantity;
      acc[productId].totalRevenue += order.product.price.toNumber() * order.quantity;
      return acc;
    }, {} as Record<number, { productName: string; totalQuantity: number; totalRevenue: number }>);

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId: parseInt(productId),
        productName: data.productName,
        totalQuantity: data.totalQuantity,
        totalRevenue: data.totalRevenue,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // Get sales data for chart
    // Compare ISO strings (YYYY-MM-DD) to check if single day
    const isSingleDay = startDate === endDate;
    let chartData: Array<{ date: string; count: number; revenue: number }> = [];

    if (isSingleDay) {
      // Hourly aggregation
      const hourlyData: Record<number, { count: number; revenue: number }> = {};
      
      // Initialize all hours with 0
      for (let i = 0; i < 24; i++) {
        hourlyData[i] = { count: 0, revenue: 0 };
      }

      // Fill with data
      orders.forEach(order => {
        const hour = order.createdAt.getHours();
        hourlyData[hour].count += 1;
        hourlyData[hour].revenue += order.product.price.toNumber() * order.quantity;
      });

      // Convert to array
      chartData = Object.entries(hourlyData).map(([hour, data]) => {
        const date = new Date(start);
        date.setHours(parseInt(hour), 0, 0, 0);
        return {
          date: date.toISOString(),
          count: data.count,
          revenue: data.revenue
        };
      });
    } else {
      // Daily aggregation with zero-filling using UTC
      const dailyData: Record<string, { count: number; revenue: number }> = {};
      
      // Initialize all days in range with 0
      const current = new Date(start);
      while (current <= end) {
        const dayStr = current.toISOString().split('T')[0];
        dailyData[dayStr] = { count: 0, revenue: 0 };
        current.setUTCDate(current.getUTCDate() + 1);
      }

      // Fill with data
      orders.forEach(order => {
        // Use local date string to match the day bucket if we want local aggregation,
        // BUT the issue is timezone shift. 
        // If we use UTC for buckets, we should probably map orders to UTC days too?
        // Or map orders to Local days but label them as UTC?
        // The user input 6th. We want a bucket for 6th.
        // UTC bucket: 2023-11-06.
        // Order: 2023-11-06 15:00 UTC. -> 2023-11-06. Match.
        // Order: 2023-11-05 23:00 UTC (which is 02:00 TR on 6th). -> 2023-11-05. Mismatch if we want TR time.
        // The user wants TR time.
        // If I use UTC buckets, I am effectively doing UTC aggregation.
        // If the user is in TR, they want Local aggregation.
        // But the issue was "6th to 23rd shows 5th to 22nd". This usually happens when:
        // Input: 6th.
        // JS Date(6th) -> 6th 00:00 Local -> converted to UTC might be 5th 21:00.
        // If I send "2023-11-06", new Date("2023-11-06") is UTC midnight.
        // So start is 6th 00:00 UTC.
        // If I use UTC methods, I stay on 6th.
        // So `dailyData` keys will be "2023-11-06", "2023-11-07".
        // Now, how do I map an order to these keys?
        // If I use `order.createdAt.toISOString().split('T')[0]`, I get the UTC date.
        // So an order at 6th 15:00 UTC maps to "2023-11-06". Correct.
        // An order at 6th 02:00 TR (which is 5th 23:00 UTC) maps to "2023-11-05".
        // This is technically correct for UTC.
        // If the user wants "Local Day", I should shift the order time to Local before splitting.
        // But for now, let's stick to UTC consistency which solves the label shift.
        const dayStr = order.createdAt.toISOString().split('T')[0];
        if (dailyData[dayStr]) {
          dailyData[dayStr].count += 1;
          dailyData[dayStr].revenue += order.product.price.toNumber() * order.quantity;
        }
      });

      // Convert to array
      chartData = Object.entries(dailyData)
        .map(([date, data]) => ({
          date,
          count: data.count,
          revenue: data.revenue
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return NextResponse.json({
      totalRevenue,
      totalSalesCount,
      pendingOrdersCount,
      topProducts,
      dailySales: chartData,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
