'use server';

import {
    updateOrderStatus,
    updatePaymentStatus,
} from '@/services/order.service';

import type { ActionResult } from '@/lib/action-result';

export async function updateOrderStatusAction(
    orderId: string,
    orderStatus: string,
): Promise<ActionResult> {
    return updateOrderStatus(
        orderId,
        orderStatus,
    );
}

export async function updatePaymentStatusAction(
    orderId: string,
    paymentStatus: string,
): Promise<ActionResult> {
    return updatePaymentStatus(
        orderId,
        paymentStatus,
    );
}