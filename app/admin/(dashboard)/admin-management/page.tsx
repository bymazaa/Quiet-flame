import { getAdmins } from '@/services/admin-management.service';
import type { Metadata } from 'next';
import UserManagementClient from './components/UserManagementClient';


export const metadata: Metadata = {
    title: 'User Management',
    description:
        'Manage administrator accounts.',
};

export default async function UserManagementPage() {
    const result = await getAdmins({
        page: 1,
        limit: 100,
    });

    return (
        <UserManagementClient
            initialAdmins={result.data}
        />
    );
}