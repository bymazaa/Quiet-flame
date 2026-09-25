
'use server';

import {
    changePassword as changePasswordService,
    updateProfile as updateProfileService,
} from '@/services/auth.service';

import type { ActionResult } from '@/lib/action-result';

/**
 * Update admin profile.
 *
 * UI -> action -> auth.service
 */
export async function updateProfile(
    adminId: string,
    data: unknown,
): Promise<ActionResult> {
    return updateProfileService(adminId, data);
}

/**
 * Change admin password.
 *
 * UI -> action -> auth.service
 */
export async function changePassword(
    adminId: string,
    data: unknown,
): Promise<ActionResult> {
    return changePasswordService(adminId, data);
}

