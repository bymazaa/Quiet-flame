'use server';

import { getSettings } from '@/services/settings.service';
import {
    placeOrder,
    validateCart,
} from '@/services/order.service';

import {
    fail,
    handleError,
    ok,
    type ActionResult,
} from '@/lib/action-result';

import { fromCents, toCents } from '@/lib/utils';

export interface CheckoutSummaryItem {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    lineTotal: number;
    isActive: boolean;
}

export interface CheckoutSummaryDTO {
    items: CheckoutSummaryItem[];
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    totalAmount: number;
    removedProductIds: string[];
}

export async function getCheckoutSummaryAction(
    items: unknown,
): Promise<ActionResult<CheckoutSummaryDTO>> {
    try {
        const result = await validateCart(items);

        if (!result.success) {
            return result;
        }

        const data = result.data;

        if (!data) {
            return fail(
                'Unable to validate your cart.',
            );
        }

        const settings = await getSettings();

        let discountCents = 0;

        for (const item of data.items) {
            if (
                item.compareAtPrice !== null &&
                item.compareAtPrice > item.price
            ) {
                discountCents +=
                    (toCents(
                        item.compareAtPrice,
                    ) -
                        toCents(item.price)) *
                    item.quantity;
            }
        }

        const subtotalCents = toCents(
            data.subtotal,
        );

        const shippingCostCents = toCents(
            settings.shippingCost,
        );

        const totalCents =
            subtotalCents +
            shippingCostCents;

        return ok(undefined, {
            items: data.items.map((item) => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                quantity: item.quantity,
                lineTotal: item.lineTotal,
                isActive: item.isActive,
            })),

            subtotal: data.subtotal,

            discountAmount:
                fromCents(discountCents),

            shippingCost:
                fromCents(shippingCostCents),

            totalAmount: fromCents(totalCents),

            removedProductIds:
                data.removedProductIds,
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function placeOrderAction(
    data: unknown,
) {
    return placeOrder(data);
}