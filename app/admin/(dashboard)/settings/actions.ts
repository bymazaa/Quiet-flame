// app/admin/(dashboard)/settings/actions.ts
'use server';

import { updateSettings as updateSettingsService } from '@/services/settings.service';
import type { SiteSettingsDTO } from '@/services/settings.service';
import type { ActionResult } from '@/lib/action-result';

export async function updateSettings(data: unknown): Promise<ActionResult<SiteSettingsDTO>> {
    return updateSettingsService(data);
}
