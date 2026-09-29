import { z } from 'zod';

import { emailSchema } from './common.schema';

/**
 * 8-72 chars (bcrypt ignores anything after 72 bytes),
 * must include uppercase, lowercase, and number.
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long')
    .regex(/[a-z]/, 'Password must include a lowercase letter')
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/\d/, 'Password must include a number');

const nameSchema = z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long');

/* Login form + login Server Action */
export const loginSchema = z.object({
    email: emailSchema,
    password: z
        .string()
        .min(1, 'Password is required')
        .max(128, 'Password is too long'),
});

/* admin/account: update name */
export const updateProfileSchema = z.object({
    name: nameSchema,
});

/* admin/account: change password */
export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, 'Current password is required')
            .max(128),

        newPassword: passwordSchema,

        confirmPassword: z
            .string()
            .min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
        message: 'New password must be different from the current password',
        path: ['newPassword'],
    });

/* Forgot password */
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

/* Reset password */
export const resetPasswordSchema = z
    .object({
        token: z
            .string()
            .trim()
            .min(1, 'Reset token is required.'),

        password: passwordSchema,

        confirmPassword: z
            .string()
            .min(1, 'Please confirm your password.'),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ['confirmPassword'],
            message: 'Passwords do not match.',
        },
    );

export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;