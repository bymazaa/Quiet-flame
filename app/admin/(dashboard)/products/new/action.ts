'use server';


import type { ProductInput } from '@/lib/validation/product.schema';
import type { ActionResult } from '@/lib/action-result';
import { createProduct, ProductDTO } from '@/services/product.service';

export async function createProductAction(
    data: ProductInput,
): Promise<ActionResult<ProductDTO>> {
    return createProduct(data);
}