import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { roundMoney } from '@/lib/utils';

export interface DashboardSummaryDTO {
    totalProducts: number;
    activeProducts: number;

    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;

    totalRevenue: number; // sum of totalAmount where paymentStatus = "paid"

    pendingPayments: {
        count: number;
        amount: number; // sum of totalAmount where paymentStatus = "pending"
    };
}

/** Sums totalAmount for orders matching a payment status. 0 if there are none. */
async function sumAmountByPaymentStatus(paymentStatus: string): Promise<number> {
    const result = await Order.aggregate<{ total: number }>([
        { $match: { paymentStatus } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    return result[0]?.total ?? 0;
}

/**
 * All admin dashboard summary numbers, fetched in parallel for speed.
 *
 *   const summary = await getDashboardSummary();
 */
export async function getDashboardSummary(): Promise<DashboardSummaryDTO> {
    await connectDB();

    const [
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        pendingPaymentsCount,
        pendingPaymentsAmount,
    ] = await Promise.all([
        Product.countDocuments({ deletedAt: null }),
        Product.countDocuments({ deletedAt: null, isActive: true }),
        Order.countDocuments({}),
        Order.countDocuments({ orderStatus: 'pending' }),
        Order.countDocuments({ orderStatus: 'confirmed' }),
        Order.countDocuments({ orderStatus: 'delivered' }),
        Order.countDocuments({ orderStatus: 'cancelled' }),
        sumAmountByPaymentStatus('paid'),
        Order.countDocuments({ paymentStatus: 'pending' }),
        sumAmountByPaymentStatus('pending'),
    ]);

    return {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: roundMoney(totalRevenue),
        pendingPayments: {
            count: pendingPaymentsCount,
            amount: roundMoney(pendingPaymentsAmount),
        },
    };
}
