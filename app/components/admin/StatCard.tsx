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
    /** CSS color (e.g. "var(--color-status-pending)") applied to the value. Omit for neutral. */
    accent?: string;
    icon?: ReactNode;
}) {
    return (
        <Card className="p-5">
            <div className="flex items-start justify-between">
                <p className="text-[13px] font-medium text-chocolate-soft">{label}</p>
                {icon ? <span className="text-chocolate-muted">{icon}</span> : null}
            </div>
            <p
                className={cn('mt-2 font-serif text-[28px] leading-none text-chocolate')}
                style={{ color: accent }}
            >
                {value}
            </p>
            {sublabel ? <p className="mt-1.5 text-xs text-chocolate-muted">{sublabel}</p> : null}
        </Card>
    );
}
