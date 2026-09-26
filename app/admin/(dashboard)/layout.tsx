import type { Metadata } from 'next';

import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/services/settings.service';

import { Sidebar } from '@/app/components/admin/Sidebar';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // *Real admin authentication check.*
    // *Redirects to /admin/login if the user is not authenticated.*
    const admin = await requireAdmin();

    // *Loads site settings.*
    // *getSettings() should return DEFAULT_SETTINGS if the DB/settings are unavailable.*
    const settings = await getSettings();

    return (
        <div className="min-h-screen bg-cream md:flex">
            <Sidebar
                brandName={settings.brandName}
                adminName={admin.name}
                adminEmail={admin.email}
            />

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                {children}
            </main>
        </div>
    );
}