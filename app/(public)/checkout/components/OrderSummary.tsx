'use client';

import Image from 'next/image';

import {
    Loader2,
    ShoppingBag,
} from 'lucide-react';

import { formatPrice } from '@/lib/utils';

interface OrderItem {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    lineTotal: number;
}

interface OrderSummaryProps {
    items: OrderItem[];
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    totalAmount: number;
    currency: string;
    submitting: boolean;
    disabled: boolean;
}

export function OrderSummary({
    items,
    subtotal,
    discountAmount,
    shippingCost,
    totalAmount,
    currency,
    submitting,
    disabled,
}: OrderSummaryProps) {
    return (
        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6 lg:sticky lg:top-24">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <ShoppingBag className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="font-serif text-xl font-bold text-[#3b2419]">
                        Order Summary
                    </h2>

                    <p className="text-sm text-gray-500">
                        Review your order.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.productId}
                        className="flex items-center gap-3"
                    >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#fff7f0]">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#3b2419]">
                                {item.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Qty: {item.quantity}
                            </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-[#3b2419]">
                            {formatPrice(
                                item.lineTotal,
                                currency,
                            )}
                        </p>
                    </div>
                ))}
            </div>

            <div className="my-6 border-t border-orange-100" />

            <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 text-gray-600">
                    <span>Subtotal</span>

                    <span className="font-medium text-gray-900">
                        {formatPrice(
                            subtotal,
                            currency,
                        )}
                    </span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between gap-4 text-green-600">
                        <span>You save</span>

                        <span className="font-medium">
                            -
                            {formatPrice(
                                discountAmount,
                                currency,
                            )}
                        </span>
                    </div>
                )}

                <div className="flex justify-between gap-4 text-gray-600">
                    <span>Shipping</span>

                    <span className="font-medium text-gray-900">
                        {shippingCost === 0
                            ? 'Free'
                            : formatPrice(
                                  shippingCost,
                                  currency,
                              )}
                    </span>
                </div>
            </div>

            <div className="my-5 border-t border-orange-100" />

            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">
                        Total
                    </p>

                    <p className="mt-1 font-serif text-2xl font-bold text-[#3b2419]">
                        {formatPrice(
                            totalAmount,
                            currency,
                        )}
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={
                    disabled || submitting
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {submitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing Order...
                    </>
                ) : (
                    'Place Order'
                )}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                By placing your order, you agree to
                our terms and purchase conditions.
            </p>
        </section>
    );
}