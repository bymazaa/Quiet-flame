
'use server';

import {
    changePassword as changePasswordService,
    updateProfile as updateProfileService,
} from '@/services/auth.service';

import type { ActionResult } from '@/lib/action-result';
import { revalidatePath } from 'next/cache';

/**
 * Update admin profile.
 *
 * UI -> action -> auth.service
 */
export async function updateProfile(
    adminEmail: string,
    data: unknown,
): Promise<ActionResult> {
    const result=await updateProfileService(adminEmail, data);
    if(!result.success){
        return result;
    }
     revalidatePath('/admin',"layout");
     return result

}

/**
 * Change admin password.
 *
 * UI -> action -> auth.service
 */
export async function changePassword(
    adminEmail: string,
    data: unknown,
): Promise<ActionResult> {
    return changePasswordService(adminEmail, data);
}

