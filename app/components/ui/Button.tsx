import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark disabled:bg-primary/50',
    secondary:
        'bg-surface text-chocolate border border-border hover:border-border-strong hover:bg-surface-muted disabled:opacity-50',
    ghost: 'text-chocolate-soft hover:text-chocolate hover:bg-surface-muted disabled:opacity-50',
    danger: 'bg-status-cancelled text-white hover:opacity-90 disabled:opacity-50',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-[13px] gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-[15px] gap-2',
};

/**
 * Same visual style as <Button>, usable on any element (e.g. <Link>).
 *   <Link href="/x" className={buttonVariants({ size: "md" })}>Add</Link>
 */
export function buttonVariants({
    variant = 'primary',
    size = 'md',
    className,
}: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
} = {}) {
    return cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
    );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={buttonVariants({ variant, size, className })}
                {...props}
            >
                {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';
