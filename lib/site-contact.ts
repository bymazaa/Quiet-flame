/**
 * Shared contact/business info used across static pages (Privacy Policy, Terms,
 * Footer, Contact page) so nothing is hard-coded in more than one place.
 *
 * TEMPORARY: once `services/settings.service.ts` is built, replace this object
 * with a call to `getSiteSettings()` (reads the SiteSettings singleton from the
 * database, editable from /admin/settings). The shape below intentionally
 * matches the SiteSettings model so that swap is a one-line change.
 */
export const SITE_CONTACT = {
    brandName: 'Quiet Flame Co.',
    legalName: 'Quiet Flame Co.',
    description: 'Hand-poured soy candles made in small batches.',
    address: 'Troy, Michigan, USA',
    email: 'hello@quietflame.shop',
    phone: '+1 (555) 010-2024',
    websiteUrl: 'https://www.quietflame.shop',
    social: {
        facebook: 'https://facebook.com/quietflameco',
        instagram: 'https://instagram.com/quietflameco',
        whatsapp: 'https://wa.me/15550102024',
    },
} as const;

export const LAST_UPDATED = 'September 25, 2026';
