'use server';

import { redirect } from 'next/navigation';
import { logout } from '@/services/auth.service';

export async function logoutAction(): Promise<void> {
    await logout();
    redirect('/admin/login');
}
