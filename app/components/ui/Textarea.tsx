import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, hasError, rows = 4, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                rows={rows}
                className={cn(
                    'w-full resize-y rounded-md border bg-surface px-3 py-2 text-sm text-chocolate placeholder:text-chocolate-muted/70',
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

Textarea.displayName = 'Textarea';
