import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { signToken, verifyToken } from '@/lib/token';
import { SESSION_COOKIE, SESSION_MAX_AGE } from './constants';

// SERVER ONLY (uses cookies + database).

export interface CurrentAdmin {
    id: string;
    name: string;
    email: string;
}

/** Login success: create token and store it in an HTTP-only cookie. */
export async function createSession(admin: { id: string; tokenVersion: number }) {
    const token = await signToken({ adminId: admin.id, tokenVersion: admin.tokenVersion });
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
    });
}

/** Logout: remove the cookie. */
export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

/**
 * Returns the logged-in admin or null.
 * Checks: token valid + admin exists + tokenVersion matches.
 * Cached per request, so calling it many times costs one DB query.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
    const cookieStore = await cookies();
    const session = await verifyToken(cookieStore.get(SESSION_COOKIE)?.value);
    if (!session) return null;

    await connectDB();
    const admin = await Admin.findById(session.adminId).select('name email tokenVersion').lean();

    if (!admin || admin.tokenVersion !== session.tokenVersion) return null;

    return { id: admin._id.toString(), name: admin.name, email: admin.email };
});

/**
 * Use at the top of every admin page / Server Action.
 * Not logged in -> redirect to /admin/login.
 *
 *   const admin = await requireAdmin();
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
    const admin = await getCurrentAdmin();
    if (!admin) redirect('/admin/login');
    return admin;
}
