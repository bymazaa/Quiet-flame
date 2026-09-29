'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentAdmin } from '@/lib/auth';
import { createAdmin, deleteAdmin, setAdminStatus } from '@/services/admin-management.service';


const createAdminSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters.')
        .max(100, 'Name is too long.'),

    email: z
        .string()
        .trim()
        .email('Enter a valid email address.'),

    password: z
        .string()
        .min(
            8,
            'Password must be at least 8 characters.',
        )
        .max(
            100,
            'Password is too long.',
        ),
});

const adminIdSchema = z.object({
    adminId: z
        .string()
        .min(1, 'Admin ID is required.'),
});

const statusSchema = z.object({
    adminId: z
        .string()
        .min(1, 'Admin ID is required.'),

    status: z.enum([
        'active',
        'blocked',
    ]),
});

type ActionResult<T = undefined> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
};

async function getActorIdentifier() {
    const currentAdmin =
        (await getCurrentAdmin()) as
            | {
                  id?: string;
                  _id?: string | { toString(): string };
                  email?: string;
              }
            | null;

    if (!currentAdmin) {
        throw new Error(
            'Unauthorized.',
        );
    }

    const id =
        currentAdmin.id ??
        currentAdmin._id?.toString();

    if (id) {
        return id;
    }

    if (currentAdmin.email) {
        return currentAdmin.email;
    }

    throw new Error(
        'Authenticated admin could not be resolved.',
    );
}

/**
 * Create admin.
 */
export async function createAdminAction(
    input: {
        name: string;
        email: string;
        password: string;
    },
): Promise<ActionResult> {
    try {
        const validated =
            createAdminSchema.safeParse(input);

        if (!validated.success) {
            return {
                success: false,
                message:
                    'Please check the form fields.',
                errors:
                    validated.error.flatten()
                        .fieldErrors,
            };
        }

        const actor =
            await getActorIdentifier();

        await createAdmin(
            actor,
            validated.data,
        );

        revalidatePath(
            '/admin/user-management',
        );

        return {
            success: true,
            message:
                'Admin created successfully.',
        };
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Could not create admin.',
        };
    }
}

/**
 * Change admin status.
 */
export async function setAdminStatusAction(
    input: {
        adminId: string;
        status: 'active' | 'blocked';
    },
): Promise<ActionResult> {
    try {
        const validated =
            statusSchema.safeParse(input);

        if (!validated.success) {
            return {
                success: false,
                message:
                    'Invalid admin status request.',
                errors:
                    validated.error.flatten()
                        .fieldErrors,
            };
        }

        const actor =
            await getActorIdentifier();

        await setAdminStatus(
            actor,
            validated.data.adminId,
            validated.data.status,
        );

        revalidatePath(
            '/admin/user-management',
        );

        return {
            success: true,
            message:
                validated.data.status === 'blocked'
                    ? 'Admin blocked successfully.'
                    : 'Admin activated successfully.',
        };
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Could not update admin status.',
        };
    }
}

/**
 * Delete admin.
 */
export async function deleteAdminAction(
    input: {
        adminId: string;
    },
): Promise<ActionResult> {
    try {
        const validated =
            adminIdSchema.safeParse(input);

        if (!validated.success) {
            return {
                success: false,
                message:
                    'Invalid admin request.',
                errors:
                    validated.error.flatten()
                        .fieldErrors,
            };
        }

        const actor =
            await getActorIdentifier();

        await deleteAdmin(
            actor,
            validated.data.adminId,
        );

        revalidatePath(
            '/admin/user-management',
        );

        return {
            success: true,
            message:
                'Admin deleted successfully.',
        };
    } catch (error: unknown) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Could not delete admin.',
        };
    }
}