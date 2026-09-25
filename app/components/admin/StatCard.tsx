import type { ReactNode } from 'react';
import { Card } from '@/app/components/ui/Card';
import { cn } from '@/lib/utils';

export function StatCard({
    label,
    value,
    sublabel,
    accent,
    icon,
}: {
    label: string;
    value: string | number;
    sublabel?: string;
    /** CSS color (e.g. "var(--color-status-pending)") applied to the value and icon accent. Omit for neutral. */
    accent?: string;
    icon?: ReactNode;
}) {
    return (
        <Card className="p-5 transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-start justify-between">
                <p className="text-[13px] font-medium text-chocolate-soft">{label}</p>
                {icon ? (
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{
                            color: accent ?? 'var(--color-chocolate-muted)',
                            backgroundColor: accent
                                ? `color-mix(in srgb, ${accent} 12%, transparent)`
                                : 'var(--color-surface-muted)',
                        }}
                    >
                        {icon}
                    </span>
                ) : null}
            </div>
            <p
                className={cn(
                    'mt-3 font-serif text-[28px] leading-none tabular-nums text-chocolate',
                )}
                style={{ color: accent }}
            >
                {value}
            </p>
            {sublabel ? <p className="mt-2 text-xs text-chocolate-muted">{sublabel}</p> : null}
        </Card>
    );
}
