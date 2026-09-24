import { Schema, model, models, Model, InferSchemaType } from 'mongoose';

const adminSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        // Hidden by default. Use .select("+passwordHash") only in login / change-password.
        passwordHash: { type: String, required: true, select: false },
        // Increase on password change to invalidate all old JWTs
        tokenVersion: { type: Number, default: 0 },
        // Brute-force protection
        failedLoginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null },
    },
    { timestamps: true },
);

export type AdminDB = InferSchemaType<typeof adminSchema>;

export const Admin = (models.Admin as Model<AdminDB>) || model<AdminDB>('Admin', adminSchema);
