
import Image from 'next/image';
import Link from 'next/link';

import { Sparkles } from 'lucide-react';

import { truncate } from '@/lib/utils';

import type { ProductDTO } from '@/services/product.service';

import { AddToCartButtons } from './AddToCartButtons';
import { PriceTag } from './PriceTag';

export function ProductCard({
    product,
}: {
    product: ProductDTO;
}) {
    const hasDiscount =
        product.compareAtPrice !== null &&
        product.compareAtPrice > product.price;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-gray-50 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
            {/* Product Image */}
            <Link
                href={`/products/${product.slug}`}
                className="block"
            >
                <div className="relative aspect-square w-full overflow-hidden bg-[#fff7f0]">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Sparkles
                                className="h-8 w-8 text-orange-300"
                                strokeWidth={1.5}
                            />
                        </div>
                    )}

                    {/* Soft overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Sale Badge */}
                    {hasDiscount ? (
                        <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-200">
                            Sale
                        </span>
                    ) : null}
                </div>
            </Link>

            {/* Product Content */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex-1">
                    {/* Product Name */}
                    <Link
                        href={`/products/${product.slug}`}
                        className="block"
                    >
                        <h3 className="line-clamp-2 font-serif text-lg leading-tight text-chocolate transition-colors duration-200 group-hover:text-orange-600">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Description */}
                    {product.description ? (
                        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-chocolate-soft">
                            {truncate(
                                product.description,
                                90,
                            )}
                        </p>
                    ) : (
                        <div className="h-10" />
                    )}

                    {/* Price */}
                    <div className="mt-4">
                        <PriceTag
                            price={product.price}
                            compareAtPrice={
                                product.compareAtPrice
                            }
                            currency={product.currency}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-5 border-t border-orange-100 pt-4">
                    <AddToCartButtons
                        productId={product.id}
                        productName={product.name}
                    />
                </div>
            </div>
        </article>
    );
}
