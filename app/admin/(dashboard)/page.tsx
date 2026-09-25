import type { Metadata } from 'next';
import { Package, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import { getDashboardSummary } from '@/services/dashboard.service';
import { StatCard } from '@/app/components/admin/StatCard';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
    const summary = await getDashboardSummary();

    return (
        <div className="max-w-5xl space-y-8">
            <div>
                <h1 className="font-serif text-2xl text-chocolate">Dashboard</h1>
                <p className="mt-1 text-sm text-chocolate-soft">
                    An overview of your store right now.
                </p>
            </div>

            {/* Orders */}
            <section>
                <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-chocolate-muted">
                    Orders
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    <StatCard
                        label="Total orders"
                        value={summary.totalOrders}
                        icon={<ShoppingBag className="h-4 w-4" strokeWidth={1.75} />}
                    />
                    <StatCard
                        label="Pending"
                        value={summary.pendingOrders}
                        accent="var(--color-status-pending)"
                    />
                    <StatCard
                        label="Confirmed"
                        value={summary.confirmedOrders}
                        accent="var(--color-status-confirmed)"
                    />
                    <StatCard
                        label="Delivered"
                        value={summary.deliveredOrders}
                        accent="var(--color-status-delivered)"
                    />
                    <StatCard
                        label="Cancelled"
                        value={summary.cancelledOrders}
                        accent="var(--color-status-cancelled)"
                    />
                </div>
            </section>

            {/* Revenue & payments */}
            <section>
                <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-chocolate-muted">
                    Revenue
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard
                        label="Total revenue"
                        value={formatPrice(summary.totalRevenue)}
                        sublabel="From paid orders"
                        icon={<DollarSign className="h-4 w-4" strokeWidth={1.75} />}
                    />
                    <StatCard
                        label="Pending payments"
                        value={summary.pendingPayments.count}
                        sublabel={`${formatPrice(summary.pendingPayments.amount)} awaiting payment`}
                        accent="var(--color-status-pending)"
                        icon={<Clock className="h-4 w-4" strokeWidth={1.75} />}
                    />
                </div>
            </section>

            {/* Products */}
            <section>
                <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-chocolate-muted">
                    Products
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                    <StatCard
                        label="Total products"
                        value={summary.totalProducts}
                        icon={<Package className="h-4 w-4" strokeWidth={1.75} />}
                    />
                    <StatCard label="Active products" value={summary.activeProducts} />
                </div>
            </section>
        </div>
    );
}
