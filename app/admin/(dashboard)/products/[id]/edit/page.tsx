import EditProductForm from '@/app/components/admin/EditFrom';
import { getProductById } from '@/services/product.service';
import { notFound } from 'next/navigation';


type EditProductPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProductPage({
    params,
}: EditProductPageProps) {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#fff8f2] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
                <EditProductForm product={product} />
            </div>
        </main>
    );
}