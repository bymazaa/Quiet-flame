import { Flame, Sparkles } from 'lucide-react';

import type { ProductDTO } from '@/services/product.service';
import { ProductCard } from './ProductCard';



export function ProductGrid({
    products,
}: {
    products: ProductDTO[];
}) {
    if (products.length === 0) {
        return (
            <div className="rounded-3xl border border-orange-100 bg-[#fffaf6] px-6 py-20 text-center shadow-2xl shadow-gray-50">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
                    <Flame
                        className="h-6 w-6"
                        strokeWidth={1.6}
                    />
                </div>

                <h3 className="mt-5 font-serif text-xl text-chocolate">
                    No candles available
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-chocolate-soft">
                    We&apos;re preparing something beautiful.
                    Please check back soon for our latest
                    handcrafted candles.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Product count */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-chocolate-soft">
                    <Sparkles
                        className="h-4 w-4 text-orange-500"
                        strokeWidth={1.7}
                    />

                    <span>
                        {products.length}{' '}
                        {products.length === 1
                            ? 'candle'
                            : 'candles'}{' '}
                        available
                    </span>
                </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="min-w-0"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}