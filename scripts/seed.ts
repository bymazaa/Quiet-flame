/**
 * Seed script
 *
 *   pnpm seed                         -> admin + default settings + sample products (development)
 *   pnpm seed:admin                   -> admin + default settings only (production)
 *   pnpm seed -- --reset-password     -> also reset the admin password from SEED_ADMIN_PASSWORD
 *
 * Safe to run many times: existing data is never duplicated or overwritten
 * (except the admin password when --reset-password is used).
 */
import { config } from 'dotenv';

// Load env BEFORE importing anything that reads process.env
config({ path: '.env.local' });

const args = new Set(process.argv.slice(2));
const adminOnly = args.has('--admin-only');
const resetPassword = args.has('--reset-password');

const placeholder = (text: string) =>
    `https://placehold.co/800x800/F3E3D3/3B2314/png?text=${encodeURIComponent(text)}`;

const SAMPLE_PRODUCTS = [
    {
        name: 'Sunlit Dahlia',
        slug: 'sunlit-dahlia',
        description:
            'A bright, blooming floral with warm citrus and soft petal notes. Hand-poured in a 9 oz jar with a clean-burning soy blend and cotton wick. Burns for about 45 to 50 hours.',
        price: 45,
        compareAtPrice: null,
    },
    {
        name: 'Peony & Linen',
        slug: 'peony-and-linen',
        description:
            'Fresh peony over the clean scent of sun-dried linen. Calm, airy and easy to live with. Hand-poured in a 9 oz jar. Burns for about 45 to 50 hours.',
        price: 45,
        compareAtPrice: null,
    },
    {
        name: 'Olive & Lavender',
        slug: 'olive-and-lavender-pro',
        description:
            'Soft lavender balanced by green olive leaf and a touch of amber. A relaxing evening candle. Hand-poured in a 9 oz jar. Burns for about 45 to 50 hours.',
        price: 38,
        compareAtPrice: 55, // sample discount to test the "Save %" badge
    },
    {
        name: 'Wild Protea',
        slug: 'wild-protea',
        description:
            'A rare, earthy floral with warm woods and a hint of honey. Hand-poured in a 9 oz jar. Burns for about 45 to 50 hours.',
        price: 45,
        compareAtPrice: null,
    },
];

async function main() {
    // Dynamic imports so dotenv runs first
    const mongoose = (await import('mongoose')).default;
    const { connectDB } = await import('@/lib/mongodb');
    const { Admin } = await import('@/models/Admin');
    const { Product } = await import('@/models/Product');
    const { SiteSettings } = await import('@/models/SiteSettings');
    const { hashPassword } = await import('@/lib/password');
    const { emailSchema } = await import('@/lib/validation/common.schema');
    const { passwordSchema } = await import('@/lib/validation/auth.schema');

    /* ---------- 1. Read and validate env ---------- */
    const rawEmail = process.env.SEED_ADMIN_EMAIL;
    const rawPassword = process.env.SEED_ADMIN_PASSWORD;
    const adminName = process.env.SEED_ADMIN_NAME || 'Admin';

    if (!rawEmail || !rawPassword) {
        throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env.local');
    }

    const emailResult = emailSchema.safeParse(rawEmail);
    const passwordResult = passwordSchema.safeParse(rawPassword);

    if (!emailResult.success) {
        throw new Error(`SEED_ADMIN_EMAIL: ${emailResult.error.issues[0].message}`);
    }
    if (!passwordResult.success) {
        throw new Error(`SEED_ADMIN_PASSWORD: ${passwordResult.error.issues[0].message}`);
    }

    const email = emailResult.data;

    await connectDB();
    console.log('Connected to MongoDB');

    /* ---------- 2. Admin ---------- */
    const existingAdmin = await Admin.findOne({ email }).select('_id');

    if (!existingAdmin) {
        await Admin.create({
            name: adminName,
            email,
            passwordHash: await hashPassword(passwordResult.data),
        });
        console.log(`Admin created: ${email}`);
    } else if (resetPassword) {
        await Admin.updateOne(
            { _id: existingAdmin._id },
            {
                $set: {
                    passwordHash: await hashPassword(passwordResult.data),
                    failedLoginAttempts: 0,
                    lockUntil: null,
                },
                $inc: { tokenVersion: 1 }, // logs out old sessions
            },
        );
        console.log(`Admin password reset: ${email}`);
    } else {
        console.log(`Admin already exists: ${email} (skipped)`);
    }

    /* ---------- 3. Default site settings ---------- */
    const settingsResult = await SiteSettings.updateOne(
        { key: 'main' },
        {
            $setOnInsert: {
                key: 'main',
                brandName: 'Quiet Flame Co.',
                description: 'Hand-poured soy candles made in small batches.',
                logoUrl: '',
                address: 'Troy, Michigan, USA',
                shippingCost: 0,
                websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
                phone: '(213) 792-0038',
                email: 'quiteflame@official.com',
                social: {
                    facebook: 'https://www.facebook.com/p/Quite-Flame-61594366916853',
                    instagram: '',
                    whatsapp:
                        'wa.me/12137920038?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20candles.',
                    twitter: '',
                },
            },
        },
        { upsert: true },
    );
    console.log(
        settingsResult.upsertedCount
            ? 'Default site settings created'
            : 'Site settings already exist (skipped)',
    );

    /* ---------- 4. Sample products (development only) ---------- */
    if (!adminOnly) {
        let created = 0;

        for (const product of SAMPLE_PRODUCTS) {
            const result = await Product.updateOne(
                { slug: product.slug },
                {
                    $setOnInsert: {
                        ...product,
                        currency: 'USD',
                        images: [placeholder(product.name)],
                        isActive: true,
                        deletedAt: null,
                    },
                },
                { upsert: true },
            );
            if (result.upsertedCount) created += 1;
        }

        console.log(
            `Sample products: ${created} created, ${SAMPLE_PRODUCTS.length - created} already existed`,
        );
    } else {
        console.log('Sample products skipped (--admin-only)');
    }

    await mongoose.disconnect();
    console.log('Done');
}

main().catch((error) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error);
    process.exit(1);
});
