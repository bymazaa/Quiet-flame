import { Schema, model, models, Model, InferSchemaType } from 'mongoose';

// Singleton: only ONE document exists (key = "main").
// Read/update with: SiteSettings.findOne({ key: "main" })
const siteSettingsSchema = new Schema(
    {
        key: { type: String, default: 'main', unique: true, immutable: true },

        brandName: { type: String, required: true, trim: true },
        description: { type: String, default: '', trim: true }, // used for SEO meta description
        logoUrl: { type: String, default: '', trim: true }, // URL only, no upload
        address: { type: String, default: '', trim: true },
        websiteUrl: { type: String, default: '', trim: true },
        phone: { type: String, default: '', trim: true },
        email: { type: String, default: '', trim: true, lowercase: true },

        social: {
            facebook: { type: String, default: '', trim: true },
            instagram: { type: String, default: '', trim: true },
            whatsapp: { type: String, default: '', trim: true },
            twitter: { type: String, default: '', trim: true },
        },
    },
    { timestamps: true },
);

export type SiteSettingsDB = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettings =
    (models.SiteSettings as Model<SiteSettingsDB>) ||
    model<SiteSettingsDB>('SiteSettings', siteSettingsSchema);
