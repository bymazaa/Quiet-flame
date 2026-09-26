import { calcDiscountPercent, formatPrice, hasDiscount } from "@/lib/utils";

export function PriceTag({
  price,
  compareAtPrice,
  currency,
  size = "md",
}: {
  price: number;
  compareAtPrice: number | null;
  currency: string;
  size?: "sm" | "md" | "lg";
}) {
  const discounted = hasDiscount(price, compareAtPrice);
  const percent = discounted ? calcDiscountPercent(price, compareAtPrice) : 0;

  const priceClass = { sm: "text-sm", md: "text-base", lg: "text-2xl" }[size];
  const compareClass = { sm: "text-xs", md: "text-[13px]", lg: "text-base" }[size];

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-medium text-chocolate ${priceClass}`}>{formatPrice(price, currency)}</span>
      {discounted ? (
        <>
          <span className={`text-chocolate-muted line-through ${compareClass}`}>
            {formatPrice(compareAtPrice as number, currency)}
          </span>
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary-dark">
            Save {percent}%
          </span>
        </>
      ) : null}
    </div>
  );
}