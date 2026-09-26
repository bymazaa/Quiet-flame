import type { Metadata } from 'next';

import { getActiveProducts } from '@/services/product.service';
import { ProductGrid } from '@/app/components/products/productGrid';

export const metadata: Metadata = {
    title: 'Shop Candles',
    description:
        'Browse Quiet Flame Co. handcrafted soy candles made in small batches with premium fragrances for everyday moments.',

    alternates: {
        canonical: '/products',
    },

    openGraph: {
        title: 'Shop Candles | Quiet Flame Co.',
        description:
            'Explore handcrafted soy candles from Quiet Flame Co., made in small batches with premium fragrances.',
        url: '/products',
        images: [
            {
                url: '/candle6.jpg',
                width: 1200,
                height: 630,
                alt: 'Quiet Flame Co. handcrafted soy candles',
            },
        ],
    },
};

export default async function ProductsPage() {
    const products = await getActiveProducts();

    return (
        <div className="mx-auto max-w-7xl px-2 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mb-8 text-center">
                <h1 className="font-serif text-3xl text-chocolate sm:text-4xl">
                    Our Candles
                </h1>

                <p className="mt-2 text-sm text-chocolate-soft">
                    Hand-poured in small batches, one jar at a time.
                </p>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}