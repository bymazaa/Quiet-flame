import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';
import { getSettings } from '@/services/settings.service';
import { Sidebar } from '@/app/components/admin/Sidebar';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Redirects to /admin/login if not authenticated. Runs on every
    // admin page — proxy.ts is only the fast first gate, this is the real check.
    const admin = await requireAdmin();
    const settings = await getSettings();

    return (
        <div className="min-h-screen bg-cream md:flex">
            <Sidebar
                brandName={settings.brandName}
                adminName={admin.name}
                adminEmail={admin.email}
            />
            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">{children}</main>
        </div>
    );
}
