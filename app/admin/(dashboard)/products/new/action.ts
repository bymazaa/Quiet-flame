'use server';

import { revalidatePath } from 'next/cache';

import type { ProductInput } from '@/lib/validation/product.schema';
import type { ActionResult } from '@/lib/action-result';

import {
    createProduct,
    type ProductDTO,
} from '@/services/product.service';

export async function createProductAction(
    data: ProductInput,
): Promise<ActionResult<ProductDTO>> {
    const result = await createProduct(data);

    if (!result.success) {
        return result;
    }

    // Admin products list
    revalidatePath('/admin/products');

    // Homepage
    revalidatePath('/', 'page');

    // Public products listing
    revalidatePath('/products');

    // Dynamic product pages
    revalidatePath('/products/[slug]', 'page');

    return result;
}