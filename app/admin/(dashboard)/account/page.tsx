import AccountForm from '@/app/components/admin/AccountForm';
import { CurrentAdmin, getCurrentAdmin } from '@/lib/auth';

export default async function AccountPage() {
    const admin = (await getCurrentAdmin()) as CurrentAdmin;

    return (
           <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-xl font-semibold leading-7 text-slate-900">Account Manage</h1>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                    Manage your profile information, password, and account security.
                </p>
            </div>

            <AccountForm
                initialAdmin={{
                    name: admin?.name || 'Unknow',
                    email: admin?.email || 'unknow@email.com',
                }}
            />
        </div>
    );
}
