
'use client';

import { formatDate, formatPrice } from '@/lib/utils';
import {
    OrderStatusBadge,
    PaymentStatusBadge,
} from '@/app/components/ui/Badge';
import { OrderRowMenu } from '@/app/components/admin/OrderRowMenu';
import type { OrderDTO } from '@/services/order.service';
import type { PaymentStatus } from '@/lib/constants';

import {
    Check,
    Copy,
    MoreHorizontal,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface OrderTableProps {
    orders: OrderDTO[];
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
}

export function OrderTable({
    orders,
    selectedIds = [],
    onSelectionChange,
}: OrderTableProps) {
    const router = useRouter();

    const [localSelectedIds, setLocalSelectedIds] =
        useState<string[]>(selectedIds);

    const selected =
        onSelectionChange
            ? selectedIds
            : localSelectedIds;

    const allSelected =
        orders.length > 0 &&
        orders.every((order) =>
            selected.includes(order.id),
        );

    function updateSelection(ids: string[]) {
        setLocalSelectedIds(ids);
        onSelectionChange?.(ids);
    }

    function toggleOrder(orderId: string) {
        const next = selected.includes(orderId)
            ? selected.filter(
                  (id) => id !== orderId,
              )
            : [...selected, orderId];

        updateSelection(next);
    }

    function toggleAll() {
        if (allSelected) {
            const visibleIds = new Set(
                orders.map((order) => order.id),
            );

            updateSelection(
                selected.filter(
                    (id) => !visibleIds.has(id),
                ),
            );

            return;
        }

        const merged = new Set(selected);

        orders.forEach((order) => {
            merged.add(order.id);
        });

        updateSelection(
            Array.from(merged),
        );
    }

    async function copyPhone(
        event: React.MouseEvent,
        phone: string,
    ) {
        event.stopPropagation();

        try {
            await navigator.clipboard.writeText(
                phone,
            );

            toast.success(
                'Phone number copied.',
            );
        } catch {
            toast.error(
                'Could not copy phone number.',
            );
        }
    }

    function openOrder(
        event: React.MouseEvent,
        orderId: string,
    ) {
        const target =
            event.target as HTMLElement;

        /*
         * Don't navigate when clicking:
         * - checkbox
         * - buttons
         * - links
         */
        if (
            target.closest('button') ||
            target.closest('input') ||
            target.closest('a')
        ) {
            return;
        }

        router.push(
            `/admin/orders/${orderId}`,
        );
    }

    if (orders.length === 0) {
        return (
            <div className="px-5 py-12 text-center">
                <p className="text-sm text-chocolate-muted">
                    No orders found.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                    <tr className="border-b border-border text-[13px] text-chocolate-muted">
                    

                        <th className="py-3 px-7 font-medium">
                            Order
                        </th>

                        <th className="px-3 py-3 font-medium">
                            Customer
                        </th>

                        <th className="px-3 py-3 font-medium">
                            Product
                        </th>

                        <th className="px-3 py-3 font-medium">
                            Amount
                        </th>

                        <th className="px-3 py-3 font-medium">
                            Status
                        </th>

                        <th className="px-3 py-3 font-medium">
                            Payment
                        </th>

                        <th className="px-3 py-3 font-medium">
                            Date
                        </th>

                        <th className="w-12 py-3 pl-3 pr-5" />
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => {
                        const firstItem =
                            order.items[0];

                        const extraCount =
                            Math.max(
                                order.items.length - 1,
                                0,
                            );

                        const isSelected =
                            selected.includes(
                                order.id,
                            );

                        return (
                            <tr
                                key={order.id}
                                onClick={(event) =>
                                    openOrder(
                                        event,
                                        order.id,
                                    )
                                }
                                className={[
                                    'group cursor-pointer border-b border-border last:border-0',
                                    'transition-colors duration-150',
                                    'hover:bg-chocolate/[0.025]',
                                    isSelected
                                        ? 'bg-amber-50/30'
                                        : '',
                                ].join(' ')}
                            >
                              

                                {/* Order */}
                                <td className="px-7 py-3">
                                    <p className="font-medium text-chocolate">
                                        {order.orderNumber}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-chocolate-muted">
                                        {order.items.length}{' '}
                                        {order.items
                                            .length === 1
                                            ? 'item'
                                            : 'items'}
                                    </p>
                                </td>

                                {/* Customer */}
                                <td className="px-3 py-3">
                                    <p className="text-chocolate">
                                        {
                                            order
                                                .customer
                                                .name
                                        }
                                    </p>

                                    <div className="mt-0.5 flex items-center gap-1.5">
                                        <p className="text-xs text-chocolate-muted">
                                            {
                                                order
                                                    .customer
                                                    .phone
                                            }
                                        </p>

                                        <button
                                            type="button"
                                            onClick={(
                                                event,
                                            ) =>
                                                copyPhone(
                                                    event,
                                                    order
                                                        .customer
                                                        .phone,
                                                )
                                            }
                                            className="rounded p-1 text-chocolate-muted opacity-0 transition group-hover:opacity-100 hover:bg-amber-100 hover:text-chocolate"
                                            aria-label="Copy phone number"
                                            title="Copy phone number"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <p className="mt-0.5 max-w-[180px] truncate text-xs text-chocolate-muted">
                                        {
                                            order
                                                .customer
                                                .email
                                        }
                                    </p>
                                </td>

                                {/* Product */}
                                <td className="max-w-[220px] px-3 py-3">
                                    <p
                                        className="truncate text-chocolate-soft"
                                        title={
                                            firstItem?.productName
                                        }
                                    >
                                        {firstItem?.productName ??
                                            '—'}

                                        {extraCount > 0 ? (
                                            <span className="text-chocolate-muted">
                                                {' '}
                                                +{extraCount}{' '}
                                                more
                                            </span>
                                        ) : null}
                                    </p>
                                </td>

                                {/* Amount */}
                                <td className="whitespace-nowrap px-3 py-3 text-chocolate">
                                    {formatPrice(
                                        order.totalAmount,
                                        order.currency,
                                    )}
                                </td>

                                {/* Order status */}
                                <td className="px-3 py-3">
                                    <OrderStatusBadge
                                        status={
                                            order.orderStatus
                                        }
                                    />
                                </td>

                                {/* Payment status */}
                                <td className="px-3 py-3">
                                    <PaymentStatusBadge
                                        status={
                                            order.paymentStatus as PaymentStatus
                                        }
                                    />
                                </td>

                                {/* Date */}
                                <td className="whitespace-nowrap px-3 py-3 text-chocolate-soft">
                                    {formatDate(
                                        order.createdAt,
                                    )}
                                </td>

                                {/* Menu */}
                                <td
                                    className="py-3 pl-3 pr-5 text-right"
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
                                >
                                    <OrderRowMenu
                                        orderId={order.id}
                                        currentStatus={
                                            order.orderStatus
                                        }
                                        currentPaymentStatus={
                                            order.paymentStatus as PaymentStatus
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

