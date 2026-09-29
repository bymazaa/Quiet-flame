import {
    Schema,
    model,
    models,
    type Model,
    type InferSchemaType,
} from 'mongoose';

export const ADMIN_STATUSES = [
    'active',
    'blocked',
] as const;

export type AdminStatus =
    (typeof ADMIN_STATUSES)[number];

const adminSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // *Hidden by default. Use .select("+passwordHash")
        // only in login / change-password.*
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },

        // *Increase on password change to invalidate all old JWTs.*
        tokenVersion: {
            type: Number,
            default: 0,
        },

        // *Active users can log in. Blocked users cannot log in.*
        status: {
            type: String,
            enum: ADMIN_STATUSES,
            default: 'active',
            required: true,
        },

        // *Super admin is protected from user-management mutations.*
        // *Normal users created by the system are always false.*
        isSuperAdmin: {
            type: Boolean,
            default: false,
            required: true,
            immutable: true,
        },

        // *Brute-force protection.*
        failedLoginAttempts: {
            type: Number,
            default: 0,
        },

        lockUntil: {
            type: Date,
            default: null,
        },

        // *Password reset token (hashed, never store the raw token).*
        resetPasswordTokenHash: {
            type: String,
            default: null,
            select: false,
        },

        // *Password reset token expires after 15 minutes.*
        resetPasswordTokenExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

adminSchema.index({ status: 1 });
adminSchema.index({ createdAt: -1 });

export type AdminDB =
    InferSchemaType<typeof adminSchema>;

export const Admin =
    (models.Admin as Model<AdminDB>) ||
    model<AdminDB>('Admin', adminSchema);