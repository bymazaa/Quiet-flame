import { z } from 'zod';
import { optionalEmailSchema, optionalHttpsUrlSchema, optionalPhoneSchema } from './common.schema';

/* /admin/settings form + action. Optional fields may be left empty (""). */
export const siteSettingsSchema = z.object({
    brandName: z.string().trim().min(2, 'Brand name is required').max(80, 'Brand name is too long'),
    description: z.string().trim().max(300, 'Keep the description under 300 characters'),
    logoUrl: optionalHttpsUrlSchema,
    address: z.string().trim().max(200, 'Address is too long'),
    websiteUrl: optionalHttpsUrlSchema,
    phone: optionalPhoneSchema,
    email: optionalEmailSchema,
    shippingCost: z
        .number()
        .min(0, 'Shipping cost cannot be negative')
        .max(1000, 'Shipping cost seems too high')
        .refine(
            (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
            'Use at most 2 decimal places',
        ),
    social: z.object({
        facebook: optionalHttpsUrlSchema,
        instagram: optionalHttpsUrlSchema,
        twitter: optionalHttpsUrlSchema,
        // Accepts a wa.me link or a phone number
        whatsapp: z
            .string()
            .trim()
            .max(200)
            .refine(
                (value) =>
                    value === '' ||
                    value.startsWith('https://') ||
                    /^[+\d\s().-]{7,20}$/.test(value),
                'Enter a WhatsApp link (https://wa.me/...) or a phone number',
            ),
    }),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
