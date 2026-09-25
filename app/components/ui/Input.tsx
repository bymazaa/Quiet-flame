import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, hasError, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'h-10 w-full rounded-md border bg-surface px-3 text-sm text-chocolate placeholder:text-chocolate-muted/70',
                    'transition-colors focus-visible:outline-none',
                    hasError
                        ? 'border-status-cancelled focus-visible:border-status-cancelled'
                        : 'border-border focus-visible:border-primary',
                    'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-chocolate-muted',
                    className,
                )}
                {...props}
            />
        );
    },
);

Input.displayName = 'Input';
