export default function ProductDetailsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square w-full animate-pulse rounded-lg bg-surface-muted" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 w-16 animate-pulse rounded-md bg-surface-muted" />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="h-8 w-2/3 animate-pulse rounded bg-surface-muted" />
          <div className="mt-4 h-6 w-24 animate-pulse rounded bg-surface-muted" />
          <div className="mt-6 space-y-2">
            <div className="h-3.5 w-full animate-pulse rounded bg-surface-muted" />
            <div className="h-3.5 w-full animate-pulse rounded bg-surface-muted" />
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-surface-muted" />
          </div>
          <div className="mt-8 h-12 w-full max-w-xs animate-pulse rounded-md bg-surface-muted" />
        </div>
      </div>
    </div>
  );
}