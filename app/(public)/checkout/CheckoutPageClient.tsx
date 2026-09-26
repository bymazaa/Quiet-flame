'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { checkoutSchema } from '@/lib/validation/order.schema';
import { DEFAULT_CURRENCY } from '@/lib/constants';

import { useCartStore } from '@/store/cart.store';

import {
    getCheckoutSummaryAction,
    placeOrderAction,
    type CheckoutSummaryDTO,
} from './action';

import { ContactInformation } from './components/ContactInformation';

import { ShippingAddress } from './components/ShippingAddress';

import {
    PaymentMethod,
    type PaymentMethodValue,
} from './components/PaymentMethod';

import { OrderSummary } from './components/OrderSummary';

interface ContactInfo {
    name: string;
    email: string;
    phone: string;
}

interface ShippingAddressInfo {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface FieldErrors {
    name?: string;
    email?: string;
    phone?: string;

    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;

    paymentMethod?: string;
}

export function CheckoutPageClient() {
    const router = useRouter();

    const cartItems = useCartStore(
        (state) => state.items,
    );

    const clearCart = useCartStore(
        (state) => state.clear,
    );

    const [contact, setContact] =
        useState<ContactInfo>({
            name: '',
            email: '',
            phone: '',
        });

    const [shippingAddress, setShippingAddress] =
        useState<ShippingAddressInfo>({
            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'United States',
        });

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethodValue>('cod');

    const [summary, setSummary] =
        useState<CheckoutSummaryDTO | null>(
            null,
        );

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState('');

    const [fieldErrors, setFieldErrors] =
        useState<FieldErrors>({});

    /*
     * Re-validates cart against the database
     * before showing checkout.
     */
    useEffect(() => {
        let cancelled = false;

        async function loadCheckout() {
            if (cartItems.length === 0) {
                if (!cancelled) {
                    setLoading(false);
                    setSummary(null);
                }

                return;
            }

            setLoading(true);
            setError('');

            const result =
                await getCheckoutSummaryAction(
                    cartItems,
                );

            if (cancelled) return;

            if (!result.success) {
                setError(
                    result.error ||
                        'Unable to validate your cart.',
                );

                setSummary(null);
                setLoading(false);

                return;
            }

            if (!result.data) {
                setError(
                    'Unable to load checkout details.',
                );

                setSummary(null);
                setLoading(false);

                return;
            }

            setSummary(result.data);
            setLoading(false);
        }

        loadCheckout();

        return () => {
            cancelled = true;
        };
    }, [cartItems]);

    const hasUnavailableItems =
        useMemo(() => {
            if (!summary) return true;

            return (
                summary.removedProductIds.length >
                    0 ||
                summary.items.some(
                    (item) =>
                        !item.isActive,
                )
            );
        }, [summary]);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError('');
        setFieldErrors({});

        if (!summary) {
            setError(
                'Unable to load your order summary.',
            );

            return;
        }

        if (hasUnavailableItems) {
            setError(
                'Please update your cart before placing the order.',
            );

            return;
        }

        /*
         * Client-side validation.
         * This is only for showing field errors.
         * Server validates again.
         */
        const checkoutData = {
            customer: contact,
            shippingAddress,
            paymentMethod,
        };

        const parsed =
            checkoutSchema.safeParse(
                checkoutData,
            );

        if (!parsed.success) {
            const errors: FieldErrors = {};

            for (const issue of parsed.error
                .issues) {
                const path =
                    issue.path.join('.');

                if (
                    path === 'customer.name' &&
                    !errors.name
                ) {
                    errors.name =
                        issue.message;
                }

                if (
                    path === 'customer.email' &&
                    !errors.email
                ) {
                    errors.email =
                        issue.message;
                }

                if (
                    path === 'customer.phone' &&
                    !errors.phone
                ) {
                    errors.phone =
                        issue.message;
                }

                if (
                    path ===
                        'shippingAddress.address' &&
                    !errors.address
                ) {
                    errors.address =
                        issue.message;
                }

                if (
                    path ===
                        'shippingAddress.city' &&
                    !errors.city
                ) {
                    errors.city =
                        issue.message;
                }

                if (
                    path ===
                        'shippingAddress.state' &&
                    !errors.state
                ) {
                    errors.state =
                        issue.message;
                }

                if (
                    path ===
                        'shippingAddress.postalCode' &&
                    !errors.postalCode
                ) {
                    errors.postalCode =
                        issue.message;
                }

                if (
                    path ===
                        'shippingAddress.country' &&
                    !errors.country
                ) {
                    errors.country =
                        issue.message;
                }

                if (
                    path === 'paymentMethod' &&
                    !errors.paymentMethod
                ) {
                    errors.paymentMethod =
                        issue.message;
                }
            }

            setFieldErrors(errors);

            return;
        }

        setSubmitting(true);

        /*
         * Server receives only:
         * customer
         * shippingAddress
         * paymentMethod
         * cart item ids + quantities
         *
         * No prices are trusted from client.
         */
        const result =
            await placeOrderAction({
                ...parsed.data,
                items: cartItems,
            });

        if (!result.success) {
            setError(
                result.error ||
                    'Unable to place your order.',
            );

            setSubmitting(false);

            return;
        }

        if (!result.data) {
            setError(
                'Order was created but no order number was returned.',
            );

            setSubmitting(false);

            return;
        }

        clearCart();

        router.push(
    `/order-confirmation/${result.data.confirmationToken}`,
);
    };

    /*
     * Empty cart
     */
    if (cartItems.length === 0) {
        return (
            <main className="bg-[#fff8f2]">
                <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                    <div className="rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-2xl shadow-gray-50">
                        <h1 className="font-serif text-3xl font-bold text-[#3b2419]">
                            Your cart is empty
                        </h1>

                        <p className="mt-3 text-gray-500">
                            Add some candles before
                            continuing to checkout.
                        </p>

                        <Link
                            href="/products"
                            className="mt-6 inline-flex rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                        >
                            Shop Candles
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#fff8f2]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cart
                    </Link>

                    <h1 className="mt-4 font-serif text-3xl font-bold text-[#3b2419] sm:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Complete your details and
                        place your order.
                    </p>
                </div>

                {/* General error */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <p>{error}</p>
                    </div>
                )}

                {/* Unavailable products */}
                {summary &&
                    hasUnavailableItems && (
                        <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                            <p className="font-semibold">
                                Some items are no longer
                                available.
                            </p>

                            <p className="mt-1">
                                Please return to your cart
                                and update it before placing
                                the order.
                            </p>

                            <Link
                                href="/cart"
                                className="mt-3 inline-flex font-semibold text-yellow-900 underline"
                            >
                                Update Cart
                            </Link>
                        </div>
                    )}

                {/* Loading */}
                {loading ? (
                    <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-2xl shadow-gray-50">
                        <p className="text-sm text-gray-500">
                            Checking your cart...
                        </p>
                    </div>
                ) : summary ? (
                    <form
                        onSubmit={handleSubmit}
                        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
                    >
                        {/* Left */}
                        <div className="space-y-6">
                            <ContactInformation
                                value={contact}
                                onChange={
                                    setContact
                                }
                                errors={{
                                    name: fieldErrors.name,
                                    email: fieldErrors.email,
                                    phone: fieldErrors.phone,
                                }}
                            />

                            <ShippingAddress
                                value={
                                    shippingAddress
                                }
                                onChange={
                                    setShippingAddress
                                }
                                errors={{
                                    address:
                                        fieldErrors.address,
                                    city:
                                        fieldErrors.city,
                                    state:
                                        fieldErrors.state,
                                    postalCode:
                                        fieldErrors.postalCode,
                                    country:
                                        fieldErrors.country,
                                }}
                            />

                            <PaymentMethod
                                value={
                                    paymentMethod
                                }
                                onChange={
                                    setPaymentMethod
                                }
                                error={
                                    fieldErrors.paymentMethod
                                }
                            />
                        </div>

                        {/* Right */}
                        <OrderSummary
                            items={summary.items.map(
                                (item) => ({
                                    productId:
                                        item.productId,
                                    name: item.name,
                                    image: item.image,
                                    quantity:
                                        item.quantity,
                                    lineTotal:
                                        item.lineTotal,
                                }),
                            )}
                            subtotal={
                                summary.subtotal
                            }
                            discountAmount={
                                summary.discountAmount
                            }
                            shippingCost={
                                summary.shippingCost
                            }
                            totalAmount={
                                summary.totalAmount
                            }
                            currency={
                                DEFAULT_CURRENCY
                            }
                            submitting={
                                submitting
                            }
                            disabled={
                                hasUnavailableItems
                            }
                        />
                    </form>
                ) : null}
            </div>
        </main>
    );
}