'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
    ShoppingBag,
    Zap,
} from 'lucide-react';

import { useCartStore } from '@/store/cart.store';

export function ProductDetailsActions({
    productId,
    productName,
}: {
    productId: string;
    productName: string;
}) {
    const router = useRouter();

    const addItem = useCartStore(
        (state) => state.addItem,
    );

    const handleAddToCart = () => {
        addItem(productId, 1);

        toast.success(
            `${productName} added to cart.`,
        );
    };

    const handleBuyNow = () => {
        addItem(productId, 1);

        router.push('/cart');
    };

    return (
        <div className="mt-7 flex w-full max-w-lg flex-col gap-3 mx-auto lg:flex-row">
            {/* Add to Cart */}

            <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-5 text-sm cursor-pointer font-bold text-chocolate shadow-sm transition hover:border-orange-300 hover:bg-orange-50 lg:flex-1"
            >
                <ShoppingBag
                    className="h-5 w-5 shrink-0"
                    strokeWidth={1.75}
                />

                Add to Cart
            </button>

            {/* Buy Now */}

            <button
                type="button"
                onClick={handleBuyNow}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-sm font-bold cursor-pointer text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 lg:flex-1"
            >
                <Zap
                    className="h-5 w-5 shrink-0"
                    fill="currentColor"
                    strokeWidth={1.6}
                />

                Buy Now
            </button>
        </div>
    );
}