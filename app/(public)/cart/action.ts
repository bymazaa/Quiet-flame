'use server';

import {
    validateCart,
    type CartValidationDTO,
} from '@/services/order.service';

import type { ActionResult } from '@/lib/action-result';

import type { CartItem } from '@/store/cart.store';

export async function validateCartAction(
    items: CartItem[],
): Promise<ActionResult<CartValidationDTO>> {
    return validateCart(items);
}