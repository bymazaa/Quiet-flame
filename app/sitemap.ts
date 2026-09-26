import type { MetadataRoute } from 'next';

const SITE_URL =
    'https://www.quietflame.shop';

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: `${SITE_URL}/`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1,
        },

        {
            url: `${SITE_URL}/products`,
            lastModified,
            changeFrequency: 'daily',
            priority: 0.9,
        },

        {
            url: `${SITE_URL}/about`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },

        {
            url: `${SITE_URL}/contact`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.6,
        },

        {
            url: `${SITE_URL}/privacy-policy`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },

        {
            url: `${SITE_URL}/terms`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];
}