
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
    adminEmail: string,
    data: unknown,
): Promise<ActionResult> {
    return updateProfileService(adminEmail, data);
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

