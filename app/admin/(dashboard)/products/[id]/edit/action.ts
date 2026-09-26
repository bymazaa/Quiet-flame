'use server';



import type { ActionResult } from '@/lib/action-result';
import type { ProductInput } from '@/lib/validation/product.schema';
import { ProductDTO, updateProduct } from '@/services/product.service';

export async function updateProductAction(
    id: string,
    data: ProductInput,
): Promise<ActionResult<ProductDTO>> {
    return updateProduct(id, data);
}