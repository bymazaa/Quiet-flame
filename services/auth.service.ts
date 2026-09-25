import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createSession, destroySession } from '@/lib/auth';
import {
    loginSchema,
    updateProfileSchema,
    changePasswordSchema,
} from '@/lib/validation/auth.schema';
import { ActionResult, fail, ok, validationFail, handleError } from '@/lib/action-result';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/* ------------------------------------------------------------------ */
/* Login / logout                                                      */
/* ------------------------------------------------------------------ */

/**
 * /admin/login. Validates input, checks the account lock, verifies the
 * password, and starts a session on success. Always returns the same
 * generic message on failure so an attacker can't tell which part was wrong.
 */
export async function login(data: unknown): Promise<ActionResult> {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) return validationFail(parsed.error);

    const { email, password } = parsed.data;
    const invalidCredentials = () => fail('Invalid email or password.');

    try {
        await connectDB();

        const admin = await Admin.findOne({ email }).select(
            '+passwordHash name email tokenVersion failedLoginAttempts lockUntil',
        );

        if (!admin) return invalidCredentials();

        if (admin.lockUntil && admin.lockUntil.getTime() > Date.now()) {
            return fail('Too many failed attempts. Please try again in a few minutes.');
        }

        const validPassword = await verifyPassword(password, admin.passwordHash);

        if (!validPassword) {
            const attempts = admin.failedLoginAttempts + 1;
            const locked = attempts >= MAX_FAILED_ATTEMPTS;

            admin.failedLoginAttempts = locked ? 0 : attempts;
            admin.lockUntil = locked ? new Date(Date.now() + LOCK_DURATION_MS) : null;
            await admin.save();

            return locked
                ? fail('Too many failed attempts. Please try again in a few minutes.')
                : invalidCredentials();
        }

        admin.failedLoginAttempts = 0;
        admin.lockUntil = null;
        await admin.save();

        await createSession({ id: admin._id.toString(), tokenVersion: admin.tokenVersion });

        return ok('Logged in successfully.');
    } catch (error) {
        return handleError(error);
    }
}

/** /admin logout. */
export async function logout(): Promise<ActionResult> {
    await destroySession();
    return ok('Logged out successfully.');
}

/* ------------------------------------------------------------------ */
/* Account management                                                  */
/* ------------------------------------------------------------------ */

/** /admin/account: update name and email. */
export async function updateProfile(adminId: string, data: unknown): Promise<ActionResult> {
    const parsed = updateProfileSchema.safeParse(data);
    if (!parsed.success) return validationFail(parsed.error);

    try {
        await connectDB();

        const emailTaken = await Admin.exists({ email: parsed.data.email, _id: { $ne: adminId } });
       

        const result = await Admin.updateOne({ _id: adminId }, { $set: parsed.data });
        if (result.matchedCount === 0) return fail('Account not found.');

        return ok('Profile updated successfully.');
    } catch (error) {
        return handleError(error);
    }
}

/**
 * /admin/account: change password. Requires the current password.
 * Bumps tokenVersion so every other logged-in session (old JWTs) is
 * invalidated immediately.
 */
export async function changePassword(adminId: string, data: unknown): Promise<ActionResult> {
    const parsed = changePasswordSchema.safeParse(data);
    if (!parsed.success) return validationFail(parsed.error);

    try {
        await connectDB();

        const admin = await Admin.findById(adminId).select('+passwordHash tokenVersion');
        if (!admin) return fail('Account not found.');

        const validCurrent = await verifyPassword(parsed.data.currentPassword, admin.passwordHash);
        if (!validCurrent) {
            return fail('Current password is incorrect.', {
                currentPassword: ['Current password is incorrect'],
            });
        }

        admin.passwordHash = await hashPassword(parsed.data.newPassword);
        admin.tokenVersion += 1;
        admin.failedLoginAttempts = 0;
        admin.lockUntil = null;
        await admin.save();

        // Old cookie is now invalid (tokenVersion mismatch); clear it explicitly too.
        await destroySession();

        return ok('Password changed successfully. Please log in again.');
    } catch (error) {
        return handleError(error);
    }
}
