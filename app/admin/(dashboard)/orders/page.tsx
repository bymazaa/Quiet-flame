import type { Metadata } from 'next';
import { ClipboardList } from 'lucide-react';
import { getAdminOrders } from '@/services/order.service';
import { OrderTable } from '@/app/components/admin/OrderTable';
import { OrdersToolbar } from '@/app/components/admin/OrdersToolbar';
import { Pagination } from '@/app/components/admin/Pagination';
import { Card } from '@/app/components/ui/Card';
import type { OrderStatus, PaymentStatus } from '@/lib/constants';
import type { OrderSort } from '@/lib/validation/order.schema';
import { OrdersSummary } from '@/app/components/admin/OrdersSummary';

export const metadata: Metadata = { title: 'Orders' };

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        search?: string;
        orderStatus?: string;
        paymentStatus?: string;
        sort?: string;
    }>;
}) {
    const params = await searchParams;
    const result = await getAdminOrders(params);

    const data = result.success ? result.data : undefined;
    const orders = data?.orders ?? [];
    const hasFilters = !!(params.search || params.orderStatus || params.paymentStatus);

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-chocolate">Orders</h1>
                <p className="mt-1 text-sm text-chocolate-soft">
                    {data
                        ? `${data.total} order${data.total === 1 ? '' : 's'}`
                        : 'Manage customer orders'}
                </p>
            </div>

            {data && <OrdersSummary summary={data.summary} />}

            <OrdersToolbar
                basePath="/admin/orders"
            />

            <Card>
                {orders.length > 0 ? (
                    <>
                        <OrderTable orders={orders} />
                        {data ? (
                            <Pagination
                                basePath="/admin/orders"
                                page={data.page}
                                totalPages={data.totalPages}
                                searchParams={{
                                    search: params.search,
                                    orderStatus: params.orderStatus,
                                    paymentStatus: params.paymentStatus,
                                    sort: params.sort,
                                }}
                            />
                        ) : null}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <ClipboardList className="h-8 w-8 text-chocolate-muted" strokeWidth={1.5} />
                        <p className="text-sm text-chocolate-soft">
                            {hasFilters
                                ? 'No orders match your search.'
                                : 'No orders have been placed yet.'}
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
