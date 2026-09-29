import { ResetPasswordForm } from '@/app/components/admin/ResetPasswordForm';
import type { Metadata } from 'next';

import { redirect } from 'next/navigation';


export const metadata: Metadata = {
    title: 'Reset Password',
    robots: { index: false, follow: false },
};

type ResetPasswordPageProps = {
    searchParams: Promise<{
        token?: string;
    }>;
};

export default async function ResetPasswordPage({
    searchParams,
}: ResetPasswordPageProps) {
    const params = await searchParams;
    const token = params.token;

    if (!token) {
        redirect('/admin/login');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="font-serif text-2xl text-chocolate">
                        Reset password
                    </h1>

                    <p className="mt-2 text-sm text-chocolate-muted">
                        Create a new password for your admin account.
                    </p>
                </div>

                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}