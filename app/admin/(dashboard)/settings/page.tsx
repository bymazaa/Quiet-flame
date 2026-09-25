import SettingsForm from '@/app/components/admin/SettingsForm';
import { getSettings } from '@/services/settings.service';

export const metadata = {
    title: 'Site Settings',
};

export default async function SiteSettingsPage() {
    const settings = await getSettings();

    return (
        <div className="max-w-5xl space-y-6">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-gray-900">Site settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your store&apos;s name, contact details, and social links.
                </p>
            </div>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}
