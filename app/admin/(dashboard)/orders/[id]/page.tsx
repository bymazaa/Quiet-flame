import type { Metadata } from 'next';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    MapPin,
    Package,
    Phone,
    Printer,
    ReceiptText,
    Truck,
    User,
    XCircle,
} from 'lucide-react';

import { getOrderById } from '@/services/order.service';

import { formatDate, formatDateTime, formatPrice } from '@/lib/utils';
import { PrintOrderButton } from '@/app/components/admin/PrintButton';

export const metadata: Metadata = {
    title: 'Order Details',
};

type OrderDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function getOrderStatusStyle(status: string) {
    switch (status) {
        case 'confirmed':
            return {
                wrapper:
                    'border-blue-100 bg-blue-50 text-blue-700',
                dot: 'bg-blue-500',
                icon: (
                    <CheckCircle2
                        className="h-4 w-4"
                        strokeWidth={1.8}
                    />
                ),
            };

        case 'delivered':
            return {
                wrapper:
                    'border-emerald-100 bg-emerald-50 text-emerald-700',
                dot: 'bg-emerald-500',
                icon: (
                    <Truck
                        className="h-4 w-4"
                        strokeWidth={1.8}
                    />
                ),
            };

        case 'cancelled':
            return {
                wrapper:
                    'border-red-100 bg-red-50 text-red-700',
                dot: 'bg-red-500',
                icon: (
                    <XCircle
                        className="h-4 w-4"
                        strokeWidth={1.8}
                    />
                ),
            };

        default:
            return {
                wrapper:
                    'border-amber-100 bg-amber-50 text-amber-700',
                dot: 'bg-amber-500',
                icon: (
                    <Clock3
                        className="h-4 w-4"
                        strokeWidth={1.8}
                    />
                ),
            };
    }
}

function getPaymentStatusStyle(status: string) {
    if (status === 'paid') {
        return {
            wrapper:
                'border-emerald-100 bg-emerald-50 text-emerald-700',
            dot: 'bg-emerald-500',
        };
    }

    return {
        wrapper:
            'border-amber-100 bg-amber-50 text-amber-700',
        dot: 'bg-amber-500',
    };
}

export default async function OrderDetailsPage({
    params,
}: OrderDetailsPageProps) {
    const { id } = await params;

    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    const orderStatus = getOrderStatusStyle(
        order.orderStatus,
    );

    const paymentStatus =
        getPaymentStatusStyle(
            order.paymentStatus,
        );

    return (
        <main className="min-h-screen bg-[#fff8f2] p-4 print:bg-white print:p-0 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="print:hidden">
                            <Link
                                href="/admin/orders"
                                className="mb-4 inline-flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm font-semibold text-chocolate-soft shadow-2xl shadow-gray-50 transition hover:border-orange-200 hover:bg-orange-50 hover:text-chocolate"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to orders
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                                    Order Details
                                </p>

                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-chocolate">
                                    {order.orderNumber}
                                </h1>
                            </div>

                            <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${orderStatus.wrapper}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${orderStatus.dot}`}
                                />

                                {orderStatus.icon}

                                {order.orderStatus}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-chocolate-soft">
                            Placed on{' '}
                             {formatDateTime(order.createdAt)}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Print */}
                      <PrintOrderButton />

                        {/* Total */}
                        <div className="rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-2xl shadow-gray-50 print:border-gray-200 print:shadow-none">
                            <p className="text-xs font-medium uppercase tracking-wide text-chocolate-muted">
                                Order total
                            </p>

                            <p className="mt-1 text-2xl font-bold text-chocolate">
                                {formatPrice(
                                    order.totalAmount,
                                    order.currency,
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* Summary Cards */}
                {/* ================================================= */}

                <div className="grid gap-4 md:grid-cols-3">
                    {/* Customer */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-chocolate-muted">
                                    Customer
                                </p>

                                <p className="mt-2 text-lg font-bold text-chocolate">
                                    {order.customer.name}
                                </p>

                                <p className="mt-1 break-all text-sm text-chocolate-soft">
                                    {order.customer.email}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 print:hidden">
                                <User
                                    className="h-5 w-5"
                                    strokeWidth={1.8}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-chocolate-muted">
                                    Payment
                                </p>

                                <p className="mt-2 text-lg font-bold capitalize text-chocolate">
                                    {order.paymentMethod}
                                </p>

                                <span
                                    className={`mt-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${paymentStatus.wrapper}`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${paymentStatus.dot}`}
                                    />

                                    {order.paymentStatus}
                                </span>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 print:hidden">
                                <CreditCard
                                    className="h-5 w-5"
                                    strokeWidth={1.8}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Date */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-chocolate-muted">
                                    Order date
                                </p>

                                <p className="mt-2 text-lg font-bold text-chocolate">
                                    {formatDate(
                                        order.createdAt,
                                    )}
                                </p>

                                <p className="mt-1 text-sm text-chocolate-soft">
                                    Updated{' '}
                                    {formatDate(
                                        order.updatedAt,
                                    )}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 print:hidden">
                                <CalendarDays
                                    className="h-5 w-5"
                                    strokeWidth={1.8}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* ================================================= */}
                {/* Main */}
                {/* ================================================= */}

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                    {/* ================================================= */}
                    {/* Left */}
                    {/* ================================================= */}

                    <div className="space-y-6">

                        {/* Order Items */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none sm:p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-chocolate">
                                        Order Items
                                    </h2>

                                    <p className="mt-1 text-sm text-chocolate-soft">
                                        {order.items.length}{' '}
                                        {order.items.length === 1
                                            ? 'product'
                                            : 'products'}{' '}
                                        in this order
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 print:hidden">
                                    <Package
                                        className="h-5 w-5"
                                        strokeWidth={1.8}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map(
                                    (item, index) => (
                                        <div
                                            key={`${item.productId}-${index}`}
                                            className="flex flex-col gap-4 rounded-2xl border border-orange-50 bg-[#fffaf6] p-4 print:rounded-none print:border-gray-200 print:bg-white sm:flex-row sm:items-center"
                                        >
                                            {/* Image */}
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-100 bg-white">
                                                {item.productImage ? (
                                                    <img
                                                        src={
                                                            item.productImage
                                                        }
                                                        alt={
                                                            item.productName
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package
                                                        className="h-6 w-6 text-orange-300"
                                                        strokeWidth={
                                                            1.6
                                                        }
                                                    />
                                                )}
                                            </div>

                                            {/* Product */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-chocolate">
                                                    {
                                                        item.productName
                                                    }
                                                </h3>

                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-chocolate-muted">
                                                    <span>
                                                        Qty:{' '}
                                                        <span className="font-semibold text-chocolate-soft">
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>
                                                    </span>

                                                    <span>
                                                        Unit price:{' '}
                                                        <span className="font-semibold text-chocolate-soft">
                                                            {formatPrice(
                                                                item.unitPrice,
                                                                order.currency,
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Item Total */}
                                            <div className="shrink-0 sm:text-right">
                                                <p className="text-xs text-chocolate-muted">
                                                    Total
                                                </p>

                                                <p className="mt-1 text-base font-bold text-chocolate">
                                                    {formatPrice(
                                                        item.totalPrice,
                                                        order.currency,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </section>

                        {/* Customer Information */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none sm:p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-chocolate">
                                    Customer Information
                                </h2>

                                <p className="mt-1 text-sm text-chocolate-soft">
                                    Contact details provided at checkout.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl bg-gray-50 p-4 shadow-2xl shadow-gray-50 print:border print:border-gray-200 print:bg-white print:shadow-none">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-chocolate-muted">
                                        <User className="h-4 w-4" />
                                        Name
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-chocolate">
                                        {order.customer.name}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-4 shadow-2xl shadow-gray-50 print:border print:border-gray-200 print:bg-white print:shadow-none">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-chocolate-muted">
                                        <ReceiptText className="h-4 w-4" />
                                        Email
                                    </div>

                                    <p className="mt-2 break-all text-sm font-semibold text-chocolate">
                                        {order.customer.email}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-gray-50 p-4 shadow-2xl shadow-gray-50 print:border print:border-gray-200 print:bg-white print:shadow-none">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-chocolate-muted">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-chocolate">
                                        {order.customer.phone}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none sm:p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-chocolate">
                                        Shipping Address
                                    </h2>

                                    <p className="mt-1 text-sm text-chocolate-soft">
                                        Delivery destination for this order.
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 print:hidden">
                                    <MapPin
                                        className="h-5 w-5"
                                        strokeWidth={1.8}
                                    />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-orange-100 bg-[#fffaf6] p-5 print:rounded-none print:border-gray-200 print:bg-white">
                                <p className="text-sm font-semibold leading-6 text-chocolate">
                                    {
                                        order
                                            .shippingAddress
                                            .address
                                    }
                                </p>

                                <p className="mt-1 text-sm leading-6 text-chocolate-soft">
                                    {
                                        order
                                            .shippingAddress
                                            .city
                                    }
                                    ,{' '}
                                    {
                                        order
                                            .shippingAddress
                                            .state
                                    }
                                    <br />
                                    {
                                        order
                                            .shippingAddress
                                            .postalCode
                                    }
                                    ,{' '}
                                    {
                                        order
                                            .shippingAddress
                                            .country
                                    }
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* ================================================= */}
                    {/* Right */}
                    {/* ================================================= */}

                    <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">

                        {/* Order Summary */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 print:hidden">
                                    <ReceiptText
                                        className="h-5 w-5"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-chocolate">
                                        Order Summary
                                    </h2>

                                    <p className="text-xs text-chocolate-muted">
                                        Payment breakdown
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-chocolate-soft">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold text-chocolate">
                                        {formatPrice(
                                            order.subtotal,
                                            order.currency,
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-chocolate-soft">
                                        Discount
                                    </span>

                                    <span className="font-semibold text-emerald-600">
                                        -
                                        {formatPrice(
                                            order.discountAmount,
                                            order.currency,
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-chocolate-soft">
                                        Shipping
                                    </span>

                                    <span className="font-semibold text-chocolate">
                                        {formatPrice(
                                            order.shippingCost,
                                            order.currency,
                                        )}
                                    </span>
                                </div>

                                <div className="border-t border-orange-100 pt-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-chocolate-muted">
                                                Total
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-chocolate">
                                                {formatPrice(
                                                    order.totalAmount,
                                                    order.currency,
                                                )}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
                                            {order.currency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Details */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none">
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-chocolate">
                                    Payment Details
                                </h2>

                                <p className="mt-1 text-sm text-chocolate-soft">
                                    Transaction information.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-chocolate-soft">
                                        Method
                                    </span>

                                    <span className="text-sm font-semibold capitalize text-chocolate">
                                        {order.paymentMethod}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-chocolate-soft">
                                        Status
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${paymentStatus.wrapper}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${paymentStatus.dot}`}
                                        />

                                        {order.paymentStatus}
                                    </span>
                                </div>

                                <div className="border-t border-orange-100 pt-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-chocolate-muted">
                                        Transaction ID
                                    </p>

                                    <p className="mt-2 break-all rounded-xl bg-gray-50 px-3 py-2.5 font-mono text-xs text-chocolate-soft print:border print:border-gray-200 print:bg-white">
                                        {order.transactionId ??
                                            'No transaction ID'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Order Status Information */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50 print:rounded-none print:border-gray-200 print:shadow-none">
                            <div className="mb-5">
                                <h2 className="text-lg font-bold text-chocolate">
                                    Order Status
                                </h2>

                                <p className="mt-1 text-sm text-chocolate-soft">
                                    Current status of this order.
                                </p>
                            </div>

                            <div
                                className={`flex items-center gap-3 rounded-2xl border p-4 ${orderStatus.wrapper}`}
                            >
                                {orderStatus.icon}

                                <div>
                                    <p className="text-xs opacity-70">
                                        Current status
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold capitalize">
                                        {order.orderStatus}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}
