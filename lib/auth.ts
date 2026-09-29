import { cache } from 'react';

import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';

import { connectDB } from '@/lib/mongodb';

import { Admin } from '@/models/Admin';

import {
    signToken,
    verifyToken,
} from '@/lib/token';

import {
    SESSION_COOKIE,
    SESSION_MAX_AGE,
} from './constants';

import { createHash } from 'node:crypto';

// SERVER ONLY (uses cookies + database).

export interface CurrentAdmin {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'blocked';
    isSuperAdmin: boolean;
}

/**
 * Login success:
 * create token and store it in an HTTP-only cookie.
 */
export async function createSession(
    admin: {
        id: string;
        tokenVersion: number;
    },
) {
    const token = await signToken({
        adminId: admin.id,
        tokenVersion: admin.tokenVersion,
    });

    const cookieStore =
        await cookies();

    cookieStore.set(
        SESSION_COOKIE,
        token,
        {
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE,
        },
    );
}

/**
 * Logout:
 * remove the session cookie.
 */
export async function destroySession() {
    const cookieStore =
        await cookies();

    cookieStore.delete(
        SESSION_COOKIE,
    );
}

/**
 * Returns the currently logged-in admin or null.
 *
 * Checks:
 * 1. Token exists and is valid.
 * 2. Admin exists.
 * 3. tokenVersion matches.
 * 4. Account is active.
 *
 * Cached per request, so multiple calls
 * within the same request share the result.
 */
export const getCurrentAdmin = cache(
    async (): Promise<
        CurrentAdmin | null
    > => {
        const cookieStore =
            await cookies();

        const session =
            await verifyToken(
                cookieStore.get(
                    SESSION_COOKIE,
                )?.value,
            );

        if (!session) {
            return null;
        }

        await connectDB();

        const admin =
            await Admin.findById(
                session.adminId,
            )
                .select(
                    'name email tokenVersion status isSuperAdmin',
                )
                .lean();

        if (!admin) {
            return null;
        }

        /*
         * Password changes and other security
         * actions can invalidate old sessions.
         */
        if (
            admin.tokenVersion !==
            session.tokenVersion
        ) {
            return null;
        }

        /*
         * Blocked admins must immediately lose
         * access even if their old session cookie
         * has not expired yet.
         */
        if (
            admin.status !== 'active'
        ) {
            return null;
        }

        return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            status: admin.status,
            isSuperAdmin:
                admin.isSuperAdmin,
        };
    },
);

/**
 * Use at the top of every admin page /
 * Server Action.
 *
 * Not logged in or blocked:
 * redirect to /admin/login.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
    const admin =
        await getCurrentAdmin();

    if (!admin) {
        redirect('/admin/login');
    }

    return admin;
}

function hashResetToken(
    token: string,
) {
    return createHash('sha256')
        .update(token)
        .digest('hex');
}