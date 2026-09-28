'use client';

import { useEffect, useRef, useState, useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { MoreVertical, Eye, Check } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
    updateOrderStatusAction,
    updatePaymentStatusAction,
} from '@/app/admin/(dashboard)/orders/actions';

import { ORDER_STATUSES, PAYMENT_STATUSES, type OrderStatus, type PaymentStatus } from '@/lib/constants';

const STATUS_LABEL: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};


const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
};



export function OrderRowMenu({
    orderId,
    currentStatus,
    currentPaymentStatus,
}: {
    orderId: string;
    currentStatus: OrderStatus;
    currentPaymentStatus: PaymentStatus;
}) {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const [isPending, startTransition] = useTransition();

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);

            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    function handleOrderStatusChange(status: OrderStatus) {
        if (status === currentStatus) {
            return;
        }

        setIsOpen(false);

        startTransition(async () => {
            const result = await updateOrderStatusAction(orderId, status);

            if (!result.success) {
                toast.error('Could not update order status.');

                return;
            }

            toast.success(result.message ?? 'Order status updated successfully.');

            router.refresh();
        });
    }

    function handlePaymentStatusChange(status: PaymentStatus) {
        if (status === currentPaymentStatus) {
            return;
        }

        setIsOpen(false);

        startTransition(async () => {
            const result = await updatePaymentStatusAction(orderId, status);

            if (!result.success) {
                toast.error('Could not update payment status.');

                return;
            }

            toast.success(result.message ?? 'Payment status updated successfully.');

            router.refresh();
        });
    }

    return (
        <div ref={menuRef} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={isPending}
                aria-label="Order actions"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className="rounded-md p-1.5 text-chocolate-soft outline-none transition-colors hover:bg-surface-muted hover:text-chocolate focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <MoreVertical className="h-4 w-4" strokeWidth={1.75} />
            </button>

            {isOpen ? (
                <div
                    role="menu"
                    className="absolute right-0 z-30 mt-1 w-52 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-soft"
                >
                    {/* View order */}
                    <Link
                        href={`/admin/orders/${orderId}`}
                        role="menuitem"
                        className="flex items-center gap-2 px-3 py-2 text-[13px] text-chocolate-soft outline-none transition-colors hover:bg-surface-muted hover:text-chocolate focus:bg-surface-muted focus:text-chocolate"
                        onClick={() => setIsOpen(false)}
                    >
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                        View order
                    </Link>

                    <div className="my-1 border-t border-border" />

                    {/* Order status */}
                    <p className="px-3 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-chocolate-muted">
                        Order status
                    </p>

                    {ORDER_STATUSES.map((status) => {
                        const isCurrent = status === currentStatus;

                        return (
                            <button
                                key={status}
                                type="button"
                                role="menuitem"
                                onClick={() => handleOrderStatusChange(status)}
                                disabled={isCurrent || isPending}
                                className={cn(
                                    'flex w-full items-center justify-between px-3 py-2 text-left text-[13px] outline-none transition-colors focus:ring-0',

                                    isCurrent
                                        ? 'cursor-default text-chocolate-muted'
                                        : 'text-chocolate-soft hover:bg-surface-muted hover:text-chocolate focus:bg-surface-muted focus:text-chocolate',
                                )}
                            >
                                {STATUS_LABEL[status]}

                                {isCurrent ? (
                                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                                ) : null}
                            </button>
                        );
                    })}

                    <div className="my-1 border-t border-border" />

                    {/* Payment status */}
                    <p className="px-3 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-chocolate-muted">
                        Payment status
                    </p>

                    {PAYMENT_STATUSES.map((status) => {
                        const isCurrent = status === currentPaymentStatus;

                        return (
                            <button
                                key={status}
                                type="button"
                                role="menuitem"
                                onClick={() => handlePaymentStatusChange(status)}
                                disabled={isCurrent || isPending}
                                className={cn(
                                    'flex w-full items-center justify-between px-3 py-2 text-left text-[13px] outline-none transition-colors focus:ring-0',

                                    isCurrent
                                        ? 'cursor-default text-chocolate-muted'
                                        : 'text-chocolate-soft hover:bg-surface-muted hover:text-chocolate focus:bg-surface-muted focus:text-chocolate',
                                )}
                            >
                                {PAYMENT_STATUS_LABEL[status]}

                                {isCurrent ? (
                                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
