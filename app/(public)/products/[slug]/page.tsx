import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product.service";
import { ProductGallery } from "@/app/components/products/ProductGallery";
import { PriceTag } from "@/app/components/products/PriceTag";
import { AddToCartButtons } from "@/app/components/products/AddToCartButtons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description || `${product.name} - hand-poured soy candle.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col">
          <h1 className="font-serif text-3xl text-chocolate">{product.name}</h1>

          <div className="mt-3">
            <PriceTag
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              currency={product.currency}
              size="lg"
            />
          </div>

          {product.description ? (
            <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-chocolate-soft">
              {product.description}
            </p>
          ) : null}

          <div className="mt-8 max-w-xs">
            <AddToCartButtons productId={product.id} productName={product.name} layout="stack" />
          </div>
        </div>
      </div>
    </div>
  );
}