import type { Metadata } from 'next';

import {
    Package,
    ShoppingBag,
    DollarSign,
    Clock,
    CircleCheck,
    Truck,
    XCircle,
    Timer,
} from 'lucide-react';

import { getDashboardSummary } from '@/services/dashboard.service';

import { StatCard } from '@/app/components/admin/StatCard';

import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default async function AdminDashboardPage() {
    const summary = await getDashboardSummary();

    return (
        <div className="min-h-screen bg-[#fff8f2]">
            <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-5 rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                            Store Overview
                        </div>

                        <h1 className="font-serif text-3xl text-chocolate">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-chocolate-soft">
                            Here&apos;s an overview of your store
                            right now.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-orange-50 px-4 py-3">
                        <p className="text-xs font-medium text-orange-600">
                            Store activity
                        </p>

                        <p className="mt-1 text-sm font-semibold text-chocolate">
                            Live overview
                        </p>
                    </div>
                </div>

                {/* Orders */}
                <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-chocolate">
                                Orders
                            </h2>

                            <p className="mt-1 text-xs text-chocolate-muted">
                                Track your current order activity.
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                            <ShoppingBag
                                className="h-5 w-5"
                                strokeWidth={1.8}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                        <StatCard
                            label="Total orders"
                            value={summary.totalOrders}
                            icon={
                                <ShoppingBag
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />

                        <StatCard
                            label="Pending"
                            value={summary.pendingOrders}
                            accent="var(--color-status-pending)"
                            icon={
                                <Timer
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />

                        <StatCard
                            label="Confirmed"
                            value={summary.confirmedOrders}
                            accent="var(--color-status-confirmed)"
                            icon={
                                <CircleCheck
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />

                        <StatCard
                            label="Delivered"
                            value={summary.deliveredOrders}
                            accent="var(--color-status-delivered)"
                            icon={
                                <Truck
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />

                        <StatCard
                            label="Cancelled"
                            value={summary.cancelledOrders}
                            accent="var(--color-status-cancelled)"
                            icon={
                                <XCircle
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />
                    </div>
                </section>

                {/* Revenue */}
                <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-chocolate">
                                Revenue & Payments
                            </h2>

                            <p className="mt-1 text-xs text-chocolate-muted">
                                Monitor revenue and outstanding payments.
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <DollarSign
                                className="h-5 w-5"
                                strokeWidth={1.8}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <StatCard
                            label="Total revenue"
                            value={formatPrice(
                                summary.totalRevenue,
                            )}
                            sublabel="From paid orders"
                            icon={
                                <DollarSign
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />

                        <StatCard
                            label="Pending payments"
                            value={summary.pendingPayments.count}
                            sublabel={`${formatPrice(
                                summary.pendingPayments.amount,
                            )} awaiting payment`}
                            accent="var(--color-status-pending)"
                            icon={
                                <Clock
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />
                    </div>
                </section>

                {/* Products */}
                <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-chocolate">
                                Products
                            </h2>

                            <p className="mt-1 text-xs text-chocolate-muted">
                                Overview of your product catalog.
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Package
                                className="h-5 w-5"
                                strokeWidth={1.8}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:max-w-lg">
                        <StatCard
                            label="Total products"
                            value={summary.totalProducts}
                            icon={
                                <Package
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />

                        <StatCard
                            label="Active products"
                            value={summary.activeProducts}
                            accent="var(--color-status-delivered)"
                            icon={
                                <CircleCheck
                                    className="h-4 w-4"
                                    strokeWidth={1.75}
                                />
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}