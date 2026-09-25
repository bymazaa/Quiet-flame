'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import * as productService from '@/services/product.service';
import type { ActionResult } from '@/lib/action-result';

export async function setProductActiveAction(id: string, isActive: boolean): Promise<ActionResult> {
    await requireAdmin();
    const result = await productService.setProductActive(id, isActive);
    if (result.success) revalidatePath('/admin/products');
    return result;
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
    await requireAdmin();
    const result = await productService.softDeleteProduct(id);
    if (result.success) revalidatePath('/admin/products');
    return result;
}
