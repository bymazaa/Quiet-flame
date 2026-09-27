
import {
    Flame,
    Sparkles,
} from 'lucide-react';

import type { ProductDTO } from '@/services/product.service';

import { ProductCard } from './ProductCard';

export function ProductGrid({
    products,
}: {
    products: ProductDTO[];
}) {
    /*
     * ============================================================
     * Empty State
     * ============================================================
     */

    if (products.length === 0) {
        return (
            <div className="rounded-3xl border border-orange-100 bg-[#fffaf6] px-5 py-16 text-center shadow-2xl shadow-gray-50 sm:px-6 sm:py-20">
                {/* Icon */}

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-400 sm:h-16 sm:w-16">
                    <Flame
                        className="h-6 w-6 sm:h-7 sm:w-7"
                        strokeWidth={1.6}
                    />
                </div>

                {/* Heading */}

                <h3 className="mt-5 font-serif text-xl text-chocolate sm:text-2xl">
                    No candles available
                </h3>

                {/* Description */}

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-chocolate-soft">
                    We&apos;re preparing something beautiful.
                    Please check back soon for our latest
                    handcrafted candles.
                </p>
            </div>
        );
    }

    /*
     * ============================================================
     * Product Grid
     * ============================================================
     */

    return (
        <div className="w-full min-w-0 space-y-6 sm:space-y-8">

            {/* =====================================================
                Product Count
            ===================================================== */}

            <div className="flex min-w-0 items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-2 text-sm text-chocolate-soft">

                    <Sparkles
                        className="h-4 w-4 shrink-0 text-orange-500"
                        strokeWidth={1.7}
                    />

                    <span className="truncate">
                        {products.length}{' '}
                        {products.length === 1
                            ? 'candle'
                            : 'candles'}{' '}
                        available
                    </span>

                </div>
            </div>

            {/* =====================================================
                Products
            ===================================================== */}

            <div className="grid min-w-0 grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:gap-6 lg:grid-cols-4">

                {products.map((product) => (
                    <div
                        key={product.id}
                        className="min-w-0"
                    >
                        <ProductCard
                            product={product}
                        />
                    </div>
                ))}

            </div>
        </div>
    );
}
