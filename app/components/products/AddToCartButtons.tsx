'use client';

import type { MouseEvent } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import {
    ShoppingBag,
    Zap,
} from 'lucide-react';

import { useCartStore } from '@/store/cart.store';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/app/components/ui/Button';

export function AddToCartButtons({
    productId,
    productName,
    quantity = 1,
    layout = 'row',
}: {
    productId: string;
    productName: string;
    quantity?: number;
    layout?: 'row' | 'stack';
}) {
    const router = useRouter();

    const addItem = useCartStore(
        (state) => state.addItem,
    );

    const handleAddToCart = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        addItem(productId, quantity);

        toast.success(
            `${productName} added to cart.`,
        );
    };

    const handleBuyNow = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        addItem(productId, quantity);

        router.push('/cart');
    };

    const isStack = layout === 'stack';

    return (
        <div
            className={cn(
                'flex w-full gap-2',
                isStack
                    ? 'flex-col'
                    : 'flex-row',
            )}
        >
            {/* Add to Cart */}
            <button
                type="button"
                onClick={handleAddToCart}
                className={buttonVariants({
                    variant: 'secondary',
                    size: isStack ? 'lg' : 'sm',
                    className: cn(
                        'min-w-0 flex-1 gap-1.5 whitespace-nowrap px-2.5',
                        'border-orange-200 bg-white text-chocolate',
                        'shadow-2xl shadow-gray-50',
                        'transition-all duration-200',
                        'hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700',
                        'active:scale-[0.98]',
                        isStack && 'w-full px-4',
                    ),
                })}
            >
                <ShoppingBag
                    className="h-4 w-4 shrink-0"
                    strokeWidth={1.75}
                />

                <span className="truncate">
                    Add to Cart
                </span>
            </button>

            {/* Buy Now */}
            <button
                type="button"
                onClick={handleBuyNow}
                className={buttonVariants({
                    size: isStack ? 'lg' : 'sm',
                    className: cn(
                        'min-w-0 flex-1 gap-1.5 whitespace-nowrap px-2.5',
                        'bg-orange-500 text-white',
                        'shadow-lg shadow-orange-100',
                        'transition-all duration-200',
                        'hover:bg-orange-600 hover:shadow-orange-200',
                        'active:scale-[0.98]',
                        isStack && 'w-full px-4',
                    ),
                })}
            >
                <Zap
                    className="h-4 w-4 shrink-0"
                    fill="currentColor"
                    strokeWidth={1.6}
                />

                <span className="truncate">
                    Buy Now
                </span>
            </button>
        </div>
    );
}