import type { ReactNode } from 'react';

import { Card } from '@/app/components/ui/Card';

import { cn } from '@/lib/utils';

type StatCardProps = {
    label: string;
    value: string | number;
    sublabel?: string;
    accent?: string;
    icon?: ReactNode;
};

export function StatCard({
    label,
    value,
    sublabel,
    accent,
    icon,
}: StatCardProps) {
    return (
        <Card
            className={cn(
                'rounded-xl border border-orange-100 bg-white p-4',
                'shadow-sm transition-colors duration-200',
                'hover:border-orange-200',
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-chocolate-muted">
                        {label}
                    </p>

                    <p
                        className="mt-2 text-2xl font-semibold leading-none tracking-tight tabular-nums"
                        style={{
                            color:
                                accent ??
                                'var(--color-chocolate)',
                        }}
                    >
                        {value}
                    </p>

                    {sublabel ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-chocolate-muted">
                            {sublabel}
                        </p>
                    ) : null}
                </div>

                {icon ? (
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                            color:
                                accent ??
                                'var(--color-chocolate-muted)',
                            backgroundColor: accent
                                ? `color-mix(in srgb, ${accent} 10%, white)`
                                : '#fff7ed',
                        }}
                    >
                        {icon}
                    </div>
                ) : null}
            </div>
        </Card>
    );
}