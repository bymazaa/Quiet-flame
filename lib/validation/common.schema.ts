import { z } from 'zod';
import { parsePage } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Plain check functions (reused by the schemas below)                 */
/* ------------------------------------------------------------------ */

export function isHttpsUrl(value: string): boolean {
    try {
        return new URL(value).protocol === 'https:';
    } catch {
        return false;
    }
}

/** Accepts: 5551234567, (555) 123-4567, 555-123-4567, +1 555 123 4567 */
export function isUsPhone(value: string): boolean {
    if (!/^[+\d\s().-]+$/.test(value)) return false;
    const digits = value.replace(/\D/g, '');
    return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}

/** Field can be empty, but if filled it must pass the check. */
function allowEmpty(check: (value: string) => boolean, message: string) {
    return z
        .string()
        .trim()
        .refine((value) => value === '' || check(value), message);
}

/* ------------------------------------------------------------------ */
/* IDs                                                                 */
/* ------------------------------------------------------------------ */

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(254, 'Email is too long');

export const phoneSchema = z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .refine(isUsPhone, 'Enter a valid US phone number');

export const zipCodeSchema = z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code (12345 or 12345-6789)');

/* Optional versions (empty string allowed) - used in Site Settings */
export const optionalEmailSchema = allowEmpty(
    (value) => z.string().email().safeParse(value).success,
    'Enter a valid email address',
);
export const optionalPhoneSchema = allowEmpty(isUsPhone, 'Enter a valid US phone number');
export const optionalHttpsUrlSchema = allowEmpty(
    isHttpsUrl,
    'Enter a valid URL starting with https://',
);

/* ------------------------------------------------------------------ */
/* Images / URLs                                                       */
/* ------------------------------------------------------------------ */

export const imageUrlSchema = z
    .string()
    .trim()
    .min(1, 'Image URL is required')
    .max(2000, 'URL is too long')
    .refine(isHttpsUrl, 'Image URL must start with https://');

/* ------------------------------------------------------------------ */
/* Money / currency                                                    */
/* ------------------------------------------------------------------ */

export const moneySchema = z
    .number()
    .positive('Must be greater than 0')
    .max(1_000_000, 'Amount is too large')
    .refine(
        (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
        'Use at most 2 decimal places',
    );

export const currencySchema = z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/, 'Use a 3-letter currency code (e.g. USD)')
    .toUpperCase();

/* ------------------------------------------------------------------ */
/* URL query params (server only)                                      */
/* ------------------------------------------------------------------ */

/** ?page=abc -> 1, ?page=3 -> 3 */
export const pageSchema = z
    .string()
    .optional()
    .transform((value) => parsePage(value));

/** ?search=  -> undefined */
export const searchSchema = z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined);
