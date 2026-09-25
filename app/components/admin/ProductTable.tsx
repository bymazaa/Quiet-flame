import Image from 'next/image';
import { formatDate, formatPrice, hasDiscount } from '@/lib/utils';
import { ProductActions } from '@/app/components/admin/ProductActions';
import type { ProductDTO } from '@/services/product.service';

export function ProductTable({ products }: { products: ProductDTO[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                    <tr className="border-b border-border text-[13px] text-chocolate-muted">
                        <th className="w-16 py-3 pl-5 pr-3 font-medium">Image</th>
                        <th className="px-3 py-3 font-medium">Product</th>
                        <th className="px-3 py-3 font-medium">Price</th>
                        <th className="px-3 py-3 font-medium">Status</th>
                        <th className="px-3 py-3 font-medium">Created</th>
                        <th className="w-32 py-3 pl-3 pr-5 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-b border-border last:border-0">
                            <td className="py-3 pl-5 pr-3">
                                <div className="relative h-11 w-11 overflow-hidden rounded-md border border-border bg-surface-muted">
                                    {product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            sizes="44px"
                                            className="object-cover"
                                        />
                                    ) : null}
                                </div>
                            </td>
                            <td className="px-3 py-3">
                                <p className="font-medium text-chocolate">{product.name}</p>
                                <p className="text-xs text-chocolate-muted">/{product.slug}</p>
                            </td>
                            <td className="px-3 py-3">
                                {hasDiscount(product.price, product.compareAtPrice) ? (
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-chocolate">
                                            {formatPrice(product.price, product.currency)}
                                        </span>
                                        <span className="text-xs text-chocolate-muted line-through">
                                            {formatPrice(
                                                product.compareAtPrice as number,
                                                product.currency,
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-chocolate">
                                        {formatPrice(product.price, product.currency)}
                                    </span>
                                )}
                            </td>
                            <td className="px-3 py-3">
                                <span
                                    className={
                                        product.isActive
                                            ? 'inline-flex items-center rounded-full bg-status-delivered-bg px-2.5 py-1 text-xs font-medium text-status-delivered'
                                            : 'inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium text-chocolate-muted'
                                    }
                                >
                                    {product.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-3 py-3 text-chocolate-soft">
                                {formatDate(product.createdAt)}
                            </td>
                            <td className="py-3 pl-3 pr-5">
                                <ProductActions
                                    id={product.id}
                                    isActive={product.isActive}
                                    name={product.name}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
