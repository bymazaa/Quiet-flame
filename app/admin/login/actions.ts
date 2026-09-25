'use server';

import { redirect } from 'next/navigation';
import { login } from '@/services/auth.service';
import type { ActionResult } from '@/lib/action-result';

/**
 * Used with React's useActionState: (prevState, formData) -> new state.
 * On success, redirects to /admin (redirect() must stay outside try/catch —
 * it works by throwing, and auth.service.login already handles its own
 * try/catch internally).
 */
export async function loginAction(
    _prevState: ActionResult | null,
    formData: FormData,
): Promise<ActionResult> {
    const result = await login({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (result.success) {
        redirect('/admin');
    }

    return result;
}
