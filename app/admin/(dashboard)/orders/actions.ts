'use server';

import { revalidatePath } from 'next/cache';

import {
    updateOrderStatus,
    updatePaymentStatus,
} from '@/services/order.service';

import type { ActionResult } from '@/lib/action-result';

export async function updateOrderStatusAction(
    orderId: string,
    orderStatus: string,
): Promise<ActionResult> {
    const result = await updateOrderStatus(
        orderId,
        orderStatus,
    );

    if (!result.success) {
        return result;
    }

    // Admin orders list
    revalidatePath('/admin/orders');

    // Admin order details
    revalidatePath('/admin/orders/[id]', 'page');

    // Customer order confirmation
    revalidatePath(
        '/order-confirmation/[orderNumber]',
        'page',
    );

    return result;
}

export async function updatePaymentStatusAction(
    orderId: string,
    paymentStatus: string,
): Promise<ActionResult> {
    const result = await updatePaymentStatus(
        orderId,
        paymentStatus,
    );

    if (!result.success) {
        return result;
    }

    // Admin orders list
    revalidatePath('/admin/orders');

    // Admin order details
    revalidatePath('/admin/orders/[id]', 'page');

    // Customer order confirmation
    revalidatePath(
        '/order-confirmation/[orderNumber]',
        'page',
    );

    return result;
}