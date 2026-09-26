import type { Metadata } from 'next';
import Link from 'next/link';
import {
    CheckCircle2,
    MapPin,
    Mail,
    Package,
    Phone,
} from 'lucide-react';


import { formatPrice } from '@/lib/utils';
import { getOrderByConfirmationToken } from '@/services/order.service';

export const metadata: Metadata = {
    title: 'Order Confirmation',
    robots: {
        index: false,
        follow: false,
    },
};

interface PageProps {
    params: Promise<{
        orderNumber: string;
    }>;
}

export default async function OrderConfirmationPage({
    params,
}: PageProps) {
    const { orderNumber } = await params;

    const order = await getOrderByConfirmationToken(orderNumber);

    if (!order) {
        return (
            <main className="bg-[#fff8f2]">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
                    <div className="rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-2xl shadow-gray-50">
                        <Package className="mx-auto h-12 w-12 text-orange-500" />

                        <h1 className="mt-5 font-serif text-3xl font-bold text-[#3b2419]">
                            Order Not Found
                        </h1>

                        <p className="mt-3 text-gray-500">
                            This order confirmation link is invalid.
                        </p>

                        <Link
                            href="/products"
                            className="mt-6 inline-flex rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#fff8f2]">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle2 className="h-9 w-9" />
                    </div>

                    <h1 className="mt-5 font-serif text-3xl font-bold text-[#3b2419] sm:text-4xl">
                        Order Confirmed!
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-gray-500">
                        Thank you for your order. We&apos;ve received your order
                        and will start processing it shortly.
                    </p>

                    <div className="mt-5 inline-flex rounded-full border border-orange-100 bg-white px-5 py-2 text-sm shadow-sm">
                        <span className="text-gray-500">Order</span>

                        <span className="ml-2 font-semibold text-[#3b2419]">
                            #{order.orderNumber}
                        </span>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-6">
                        {/* Customer */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
                            <h2 className="font-serif text-xl font-bold text-[#3b2419]">
                                Customer Information
                            </h2>

                            <div className="mt-5 space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-4 w-4 text-orange-500" />

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Email
                                        </p>

                                        <p className="font-medium text-gray-700">
                                            {order.customer.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-4 w-4 text-orange-500" />

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Phone
                                        </p>

                                        <p className="font-medium text-gray-700">
                                            {order.customer.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Shipping */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
                            <h2 className="font-serif text-xl font-bold text-[#3b2419]">
                                Shipping Address
                            </h2>

                            <div className="mt-5 flex gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

                                <div className="text-sm leading-6 text-gray-600">
                                    <p>{order.shippingAddress.address}</p>

                                    <p>
                                        {order.shippingAddress.city},{' '}
                                        {order.shippingAddress.state}
                                    </p>

                                    <p>
                                        {order.shippingAddress.postalCode}
                                    </p>

                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </section>

                        {/* Items */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
                            <h2 className="font-serif text-xl font-bold text-[#3b2419]">
                                Order Items
                            </h2>

                            <div className="mt-5 divide-y divide-orange-100">
                                {order.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fff7f0]">
                                            {item.productImage ? (
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Package className="h-5 w-5 text-orange-300" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-[#3b2419]">
                                                {item.productName}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="shrink-0 font-semibold text-[#3b2419]">
                                            {formatPrice(
                                                item.totalPrice,
                                                order.currency,
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Summary */}
                    <div className="lg:sticky lg:top-24 lg:self-start">
                        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
                            <h2 className="font-serif text-xl font-bold text-[#3b2419]">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        {formatPrice(
                                            order.subtotal,
                                            order.currency,
                                        )}
                                    </span>
                                </div>

                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>

                                        <span>
                                            -
                                            {formatPrice(
                                                order.discountAmount,
                                                order.currency,
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        {order.shippingCost === 0
                                            ? 'Free'
                                            : formatPrice(
                                                  order.shippingCost,
                                                  order.currency,
                                              )}
                                    </span>
                                </div>
                            </div>

                            <div className="my-5 border-t border-orange-100" />

                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-700">
                                    Total
                                </span>

                                <span className="font-serif text-2xl font-bold text-[#3b2419]">
                                    {formatPrice(
                                        order.totalAmount,
                                        order.currency,
                                    )}
                                </span>
                            </div>

                            <div className="mt-6 space-y-3 rounded-2xl bg-[#fff8f2] p-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Order Status
                                    </span>

                                    <span className="font-semibold capitalize text-[#3b2419]">
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Payment Method
                                    </span>

                                    <span className="font-semibold uppercase text-[#3b2419]">
                                        {order.paymentMethod}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Payment Status
                                    </span>

                                    <span className="font-semibold capitalize text-[#3b2419]">
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/products"
                                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                            >
                                Continue Shopping
                            </Link>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}