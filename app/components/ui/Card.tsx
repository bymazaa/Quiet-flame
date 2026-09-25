import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** "flat" (default): border only, used for most panels/tables.
     *  "lifted": adds a soft shadow — reserve for the one element per screen
     *  that should stand out (e.g. a modal or a highlighted stat). */
    elevation?: 'flat' | 'lifted';
}

export function Card({ className, elevation = 'flat', ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-border bg-surface',
                elevation === 'lifted' && 'shadow-soft',
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('border-b border-border px-5 py-4', className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('px-5 py-4', className)} {...props} />;
}
