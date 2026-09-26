'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Minus,
    Plus,
    RefreshCw,
    ShoppingBag,
    Trash2,
} from 'lucide-react';

import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import { toast } from 'sonner';

import { useCartStore } from '@/store/cart.store';

import {
    formatPrice,
    hasDiscount,
} from '@/lib/utils';

import type {
    CartValidationDTO,
    CartValidationItemDTO,
} from '@/services/order.service';

import { validateCartAction } from './action';

type ValidationState = {
    data: CartValidationDTO | null;
    loading: boolean;
    error: string | null;
};

export default function CartPageClient() {
    const items = useCartStore(
        (state) => state.items,
    );

    const removeItem = useCartStore(
        (state) => state.removeItem,
    );

    const setQuantity = useCartStore(
        (state) => state.setQuantity,
    );

    const clear = useCartStore(
        (state) => state.clear,
    );

    const [validation, setValidation] =
        useState<ValidationState>({
            data: null,
            loading: true,
            error: null,
        });

    /*
     * Re-check the local cart against the database.
     *
     * Zustand/localStorage contains only:
     * productId + quantity
     *
     * The database remains the source of truth
     * for product name, price and availability.
     */
    useEffect(() => {
        let cancelled = false;

        async function validate() {
            setValidation((prev) => ({
                ...prev,
                loading: true,
                error: null,
            }));

            const result =
                await validateCartAction(items);

            if (cancelled) return;

            /*
             * Action failed
             */
            if (!result.success) {
                setValidation({
                    data: null,
                    loading: false,
                    error: result.error,
                });

                return;
            }

            /*
             * Action succeeded, but data is optional
             * in ActionResult, so explicitly guard it.
             */
            const data = result.data;

            if (!data) {
                setValidation({
                    data: null,
                    loading: false,
                    error:
                        'Unable to validate your cart.',
                });

                return;
            }

            /*
             * Products that no longer exist.
             *
             * Remove them from Zustand/localStorage.
             */
            if (
                data.removedProductIds.length > 0
            ) {
                for (const productId of
                    data.removedProductIds) {
                    removeItem(productId);
                }

                toast.error(
                    data.removedProductIds.length ===
                        1
                        ? 'A product was removed from your cart because it is no longer available.'
                        : 'Some products were removed from your cart because they are no longer available.',
                );
            }

            setValidation({
                data,
                loading: false,
                error: null,
            });
        }

        validate();

        return () => {
            cancelled = true;
        };
    }, [items, removeItem]);

    /*
     * Current validated products
     */
    const validatedItems =
        validation.data?.items ?? [];

    /*
     * Active products
     */
    const activeItems = useMemo(
        () =>
            validatedItems.filter(
                (item) => item.isActive,
            ),
        [validatedItems],
    );

    /*
     * Products that still exist but
     * are currently inactive.
     */
    const unavailableItems = useMemo(
        () =>
            validatedItems.filter(
                (item) => !item.isActive,
            ),
        [validatedItems],
    );

    /*
     * Checkout is allowed only when:
     *
     * 1. validation finished
     * 2. there is at least one active item
     * 3. no inactive item remains
     */
    const canCheckout =
        !validation.loading &&
        activeItems.length > 0 &&
        unavailableItems.length === 0;

    /*
     * Total quantity of active products
     */
    const itemCount = useMemo(
        () =>
            activeItems.reduce(
                (total, item) =>
                    total + item.quantity,
                0,
            ),
        [activeItems],
    );

    const handleIncrease = (
        productId: string,
        quantity: number,
    ) => {
        setQuantity(
            productId,
            quantity + 1,
        );
    };

    const handleDecrease = (
        productId: string,
        quantity: number,
    ) => {
        setQuantity(
            productId,
            quantity - 1,
        );
    };

    const handleRemove = (
        productId: string,
        productName: string,
    ) => {
        removeItem(productId);

        toast.success(
            `${productName} removed from cart.`,
        );
    };

    const handleClear = () => {
        clear();

        toast.success(
            'Your cart has been cleared.',
        );
    };

    /*
     * Empty cart
     */
    if (
        !validation.loading &&
        items.length === 0
    ) {
        return (
            <main className="min-h-[70vh] bg-[#fff8f2]">
                <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16 sm:px-6">
                    <div className="w-full rounded-[2rem] border border-orange-100 bg-white px-6 py-14 text-center shadow-2xl shadow-gray-50 sm:px-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                            <ShoppingBag
                                className="h-7 w-7"
                                strokeWidth={1.6}
                            />
                        </div>

                        <h1 className="mt-6 font-serif text-3xl text-chocolate">
                            Your cart is empty
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-chocolate-soft">
                            Looks like you haven&apos;t added
                            anything yet. Explore our handcrafted
                            candles and find something you love.
                        </p>

                        <Link
                            href="/products"
                            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600"
                        >
                            Explore Candles

                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fff8f2] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <div className="mb-8">
                    <Link
                        href="/products"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-chocolate-soft transition hover:text-orange-600"
                    >
                        <ArrowLeft className="h-4 w-4" />

                        Continue Shopping
                    </Link>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
                                Shopping Cart
                            </p>

                            <h1 className="mt-2 font-serif text-3xl text-chocolate sm:text-4xl">
                                Your Cart
                            </h1>

                            <p className="mt-2 text-sm text-chocolate-soft">
                                {validation.loading
                                    ? 'Checking your cart...'
                                    : `${itemCount} ${
                                          itemCount ===
                                          1
                                              ? 'item'
                                              : 'items'
                                      } ready for checkout`}
                            </p>
                        </div>

                        {items.length > 0 ? (
                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={
                                    validation.loading
                                }
                                className="inline-flex items-center gap-2 self-start rounded-xl border border-red-100 bg-white px-3.5 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                            >
                                <Trash2 className="h-3.5 w-3.5" />

                                Clear Cart
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* ================================================= */}
                {/* Validation Error */}
                {/* ================================================= */}

                {validation.error ? (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="text-sm font-semibold">
                                Couldn&apos;t validate your cart
                            </p>

                            <p className="mt-1 text-xs leading-5">
                                {validation.error}
                            </p>
                        </div>
                    </div>
                ) : null}

                {/* ================================================= */}
                {/* Loading */}
                {/* ================================================= */}

                {validation.loading ? (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-4 text-sm text-chocolate-soft shadow-2xl shadow-gray-50">
                        <RefreshCw className="h-4 w-4 animate-spin text-orange-500" />

                        Checking latest product prices and
                        availability...
                    </div>
                ) : null}

                {/* ================================================= */}
                {/* Main Grid */}
                {/* ================================================= */}

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    {/* ================================================= */}
                    {/* Cart Items */}
                    {/* ================================================= */}

                    <section className="space-y-4">
                        {/* Unavailable products */}
                        {unavailableItems.map(
                            (item) => (
                                <CartItemCard
                                    key={item.productId}
                                    item={item}
                                    unavailable
                                    onRemove={() =>
                                        handleRemove(
                                            item.productId,
                                            item.name,
                                        )
                                    }
                                    onIncrease={() =>
                                        handleIncrease(
                                            item.productId,
                                            item.quantity,
                                        )
                                    }
                                    onDecrease={() =>
                                        handleDecrease(
                                            item.productId,
                                            item.quantity,
                                        )
                                    }
                                />
                            ),
                        )}

                        {/* Active products */}
                        {activeItems.map(
                            (item) => (
                                <CartItemCard
                                    key={item.productId}
                                    item={item}
                                    onRemove={() =>
                                        handleRemove(
                                            item.productId,
                                            item.name,
                                        )
                                    }
                                    onIncrease={() =>
                                        handleIncrease(
                                            item.productId,
                                            item.quantity,
                                        )
                                    }
                                    onDecrease={() =>
                                        handleDecrease(
                                            item.productId,
                                            item.quantity,
                                        )
                                    }
                                />
                            ),
                        )}

                        {/* Nothing available */}
                        {!validation.loading &&
                        validatedItems.length ===
                            0 &&
                        items.length > 0 ? (
                            <div className="rounded-3xl border border-orange-100 bg-white px-6 py-16 text-center shadow-2xl shadow-gray-50">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>

                                <h2 className="mt-5 font-serif text-xl text-chocolate">
                                    Nothing available
                                </h2>

                                <p className="mt-2 text-sm text-chocolate-soft">
                                    The products in your cart are no
                                    longer available.
                                </p>

                                <Link
                                    href="/products"
                                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
                                >
                                    Shop Candles

                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        ) : null}
                    </section>

                    {/* ================================================= */}
                    {/* Summary */}
                    {/* ================================================= */}

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50">
                            <div className="mb-6">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
                                    Order Summary
                                </p>

                                <h2 className="mt-2 font-serif text-2xl text-chocolate">
                                    Cart Total
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-chocolate-soft">
                                        Items
                                    </span>

                                    <span className="font-semibold text-chocolate">
                                        {itemCount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-chocolate-soft">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold text-chocolate">
                                        {validation.data
                                            ? formatPrice(
                                                  validation.data
                                                      .subtotal,
                                              )
                                            : '--'}
                                    </span>
                                </div>

                                <div className="border-t border-orange-100 pt-4">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-chocolate-muted">
                                                Total
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-chocolate">
                                                {validation.data
                                                    ? formatPrice(
                                                          validation.data
                                                              .subtotal,
                                                      )
                                                    : '--'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Unavailable Warning */}
                            {unavailableItems.length >
                            0 ? (
                                <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                                        <p className="text-xs leading-5 text-amber-700">
                                            Remove unavailable products
                                            before proceeding to
                                            checkout.
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            {/* Checkout */}
                            <Link
                                href={
                                    canCheckout
                                        ? '/checkout'
                                        : '#'
                                }
                                aria-disabled={
                                    !canCheckout
                                }
                                onClick={(event) => {
                                    if (
                                        !canCheckout
                                    ) {
                                        event.preventDefault();
                                    }
                                }}
                                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-lg transition ${
                                    canCheckout
                                        ? 'bg-orange-500 text-white shadow-orange-100 hover:bg-orange-600'
                                        : 'cursor-not-allowed bg-gray-100 text-gray-400 shadow-none'
                                }`}
                            >
                                Proceed to Checkout

                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <p className="mt-4 text-center text-[11px] leading-5 text-chocolate-muted">
                                Shipping and final order totals are
                                calculated again during checkout.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

/* =============================================================== */
/* Cart Item Card                                                   */
/* =============================================================== */

function CartItemCard({
    item,
    unavailable = false,
    onRemove,
    onIncrease,
    onDecrease,
}: {
    item: CartValidationItemDTO;
    unavailable?: boolean;
    onRemove: () => void;
    onIncrease: () => void;
    onDecrease: () => void;
}) {
    const discounted = hasDiscount(
        item.price,
        item.compareAtPrice,
    );

    return (
        <article
            className={`rounded-3xl border bg-white p-4 shadow-2xl shadow-gray-50 sm:p-5 ${
                unavailable
                    ? 'border-amber-200'
                    : 'border-orange-100'
            }`}
        >
            {/* Unavailable Banner */}
            {unavailable ? (
                <div className="mb-4 flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                    <AlertCircle className="h-4 w-4" />

                    This product is currently unavailable.
                </div>
            ) : null}

            <div className="flex flex-col gap-4 sm:flex-row">
                {/* Image */}
                <Link
                    href={`/products/${item.slug}`}
                    className="shrink-0"
                >
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-orange-100 bg-[#fff7f0] sm:h-28 sm:w-28">
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="112px"
                                className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-xs text-chocolate-muted">
                                No image
                            </div>
                        )}
                    </div>
                </Link>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <Link
                                href={`/products/${item.slug}`}
                            >
                                <h2 className="line-clamp-2 font-serif text-lg leading-tight text-chocolate transition-colors hover:text-orange-600">
                                    {item.name}
                                </h2>
                            </Link>

                            {/* Price */}
                            {discounted ? (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-bold text-chocolate">
                                        {formatPrice(
                                            item.price,
                                        )}
                                    </span>

                                    <span className="text-xs text-chocolate-muted line-through">
                                        {formatPrice(
                                            item.compareAtPrice as number,
                                        )}
                                    </span>

                                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">
                                        Sale
                                    </span>
                                </div>
                            ) : (
                                <p className="mt-2 text-sm font-bold text-chocolate">
                                    {formatPrice(
                                        item.price,
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Remove */}
                        <button
                            type="button"
                            onClick={onRemove}
                            className="shrink-0 rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            aria-label={`Remove ${item.name}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Bottom */}
                    <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-end sm:justify-between">
                        {/* Quantity */}
                        <div>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-chocolate-muted">
                                Quantity
                            </p>

                            <div className="inline-flex items-center rounded-xl border border-orange-100 bg-[#fffaf6]">
                                <button
                                    type="button"
                                    onClick={
                                        onDecrease
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-chocolate-soft transition hover:bg-orange-50 hover:text-chocolate"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>

                                <span className="flex h-9 min-w-10 items-center justify-center border-x border-orange-100 px-2 text-sm font-bold text-chocolate">
                                    {item.quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        onIncrease
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-chocolate-soft transition hover:bg-orange-50 hover:text-chocolate"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Item Total */}
                        <div className="sm:text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-chocolate-muted">
                                Item Total
                            </p>

                            <p className="mt-1 text-lg font-bold text-chocolate">
                                {formatPrice(
                                    item.lineTotal,
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}