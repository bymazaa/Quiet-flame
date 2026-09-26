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
                'group relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-5',
                'shadow-2xl shadow-gray-50',
                'transition-all duration-200',
                'hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-xl',
            )}
        >
            {/* Top accent */}
            <div
                className="absolute inset-x-0 top-0 h-0.5"
                style={{
                    backgroundColor:
                        accent ??
                        'var(--color-chocolate-muted)',
                }}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wide text-chocolate-muted">
                        {label}
                    </p>
                </div>

                {icon ? (
                    <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm"
                        style={{
                            color:
                                accent ??
                                'var(--color-chocolate-muted)',

                            backgroundColor: accent
                                ? `color-mix(in srgb, ${accent} 10%, white)`
                                : 'var(--color-surface-muted)',
                        }}
                    >
                        {icon}
                    </span>
                ) : null}
            </div>

            <div className="mt-5">
                <p
                    className="font-serif text-3xl font-medium leading-none tracking-tight tabular-nums"
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
                ) : (
                    <div className="mt-2 h-5" />
                )}
            </div>

            {/* Bottom hover indicator */}
            <div
                className="absolute bottom-0 left-5 right-5 h-px scale-x-0 rounded-full transition-transform duration-200 group-hover:scale-x-100"
                style={{
                    backgroundColor:
                        accent ??
                        'var(--color-status-delivered)',
                }}
            />
        </Card>
    );
}