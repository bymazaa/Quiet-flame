import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, PackageSearch } from 'lucide-react';
import { getAdminProducts } from '@/services/product.service';
import { ProductTable } from '@/app/components/admin/ProductTable';
import { Pagination } from '@/app/components/admin/Pagination';
import { SearchBox } from '@/app/components/admin/SearchBox';
import { Card } from '@/app/components/ui/Card';
import { buttonVariants } from '@/app/components/ui/Button';

export const metadata: Metadata = { title: 'Products' };

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const params = await searchParams;
    const result = await getAdminProducts(params);

    const data = result.success ? result.data : undefined;
    const products = data?.products ?? [];

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-2xl text-chocolate">Products</h1>
                    <p className="mt-1 text-sm text-chocolate-soft">
                        {data
                            ? `${data.total} product${data.total === 1 ? '' : 's'}`
                            : 'Manage your candles'}
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className={buttonVariants({ className: 'shrink-0 gap-1.5' })}
                >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                    Add product
                </Link>
            </div>

            <SearchBox
                basePath="/admin/products"
                placeholder="Search by product name"
                defaultValue={params.search}
            />

            <Card>
                {products.length > 0 ? (
                    <>
                        <ProductTable products={products} />
                        {data ? (
                            <Pagination
                                basePath="/admin/products"
                                page={data.page}
                                totalPages={data.totalPages}
                                searchParams={{ search: params.search }}
                            />
                        ) : null}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                        <PackageSearch className="h-8 w-8 text-chocolate-muted" strokeWidth={1.5} />
                        <p className="text-sm text-chocolate-soft">
                            {params.search
                                ? 'No products match your search.'
                                : 'No products yet. Add your first candle.'}
                        </p>
                        {!params.search ? (
                            <Link
                                href="/admin/products/new"
                                className="text-sm font-medium text-primary hover:text-primary-dark"
                            >
                                Add a product
                            </Link>
                        ) : null}
                    </div>
                )}
            </Card>
        </div>
    );
}
