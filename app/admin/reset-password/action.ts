'use server';

import {
    ActionResult,
    handleError,
    ok,
    validationFail,
} from '@/lib/action-result';
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validation/auth.schema';

import {
    createPasswordResetRequest,
    resetAdminPassword,
} from '@/services/admin-password-reset.service';

/* =========================================================
   Forgot Password Validation
========================================================= */


/* =========================================================
   Forgot Password Action
========================================================= */

export async function forgotPasswordAction(
    data: {
        email: string;
    },
): Promise<ActionResult> {
    try {
        const parsed =
            forgotPasswordSchema.safeParse(
                data,
            );

        if (!parsed.success) {
            return validationFail(
                parsed.error,
            );
        }

        const result =
            await createPasswordResetRequest(
                parsed.data.email,
            );

        return ok(
            result.message,
        );
    } catch (error) {
        return handleError(error);
    }
}

/* =========================================================
   Reset Password Action
========================================================= */

export async function resetPasswordAction(
    data: {
        token: string;
        password: string;
        confirmPassword: string;
    },
): Promise<ActionResult> {
    try {
        const parsed =
            resetPasswordSchema.safeParse(
                data,
            );

        if (!parsed.success) {
            return validationFail(
                parsed.error,
            );
        }

        const result =
            await resetAdminPassword({
                token: parsed.data.token,
                password:
                    parsed.data.password,
            });

        return ok(
            result.message,
        );
    } catch (error) {
        return handleError(error);
    }
}