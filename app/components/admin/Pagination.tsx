import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination({
    basePath,
    page,
    totalPages,
    searchParams,
}: {
    basePath: string;
    page: number;
    totalPages: number;
    /** Other active query params (search, filters) to keep when changing page. */
    searchParams?: Record<string, string | undefined>;
}) {
    if (totalPages <= 1) return null;

    const buildHref = (targetPage: number) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(searchParams ?? {})) {
            if (value) params.set(key, value);
        }
        params.set('page', String(targetPage));
        return `${basePath}?${params.toString()}`;
    };

    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    return (
        <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
            <p className="text-[13px] text-chocolate-muted">
                Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
                <PageLink
                    href={hasPrev ? buildHref(page - 1) : undefined}
                    disabled={!hasPrev}
                    label="Previous"
                >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </PageLink>
                <PageLink
                    href={hasNext ? buildHref(page + 1) : undefined}
                    disabled={!hasNext}
                    label="Next"
                >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </PageLink>
            </div>
        </div>
    );
}

function PageLink({
    href,
    disabled,
    label,
    children,
}: {
    href?: string;
    disabled?: boolean;
    label: string;
    children: React.ReactNode;
}) {
    const classes = cn(
        'flex h-8 w-8 items-center justify-center rounded-md border border-border text-chocolate-soft transition-colors',
        disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-surface-muted hover:text-chocolate',
    );

    if (disabled || !href) {
        return (
            <span className={classes} aria-disabled="true" aria-label={label}>
                {children}
            </span>
        );
    }

    return (
        <Link href={href} className={classes} aria-label={label}>
            {children}
        </Link>
    );
}
