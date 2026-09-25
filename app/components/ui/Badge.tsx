import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { OrderStatus, PaymentStatus } from '@/lib/constants';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    color?: string; // text color, e.g. "var(--color-status-pending)"
    background?: string; // background color, e.g. "var(--color-status-pending-bg)"
}

/** Generic pill badge. Prefer OrderStatusBadge / PaymentStatusBadge for statuses. */
export function Badge({ className, style, color, background, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                className,
            )}
            style={{ color, backgroundColor: background, ...style }}
            {...props}
        >
            {children}
        </span>
    );
}

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
    return (
        <Badge
            color={`var(--color-status-${status})`}
            background={`var(--color-status-${status}-bg)`}
        >
            {ORDER_STATUS_LABEL[status]}
        </Badge>
    );
}

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
};

// Payment reuses the same visual language: paid=delivered green, failed/refunded=cancelled red, pending=pending amber
const PAYMENT_STATUS_TOKEN: Record<PaymentStatus, OrderStatus> = {
    pending: 'pending',
    paid: 'delivered',
    failed: 'cancelled',
    refunded: 'cancelled',
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const token = PAYMENT_STATUS_TOKEN[status];
    return (
        <Badge
            color={`var(--color-status-${token})`}
            background={`var(--color-status-${token}-bg)`}
        >
            {PAYMENT_STATUS_LABEL[status]}
        </Badge>
    );
}
