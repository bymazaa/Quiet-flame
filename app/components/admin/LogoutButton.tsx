import { LogOut } from 'lucide-react';
import { logoutAction } from '@/app/admin/(dashboard)/actions';

export function LogoutButton() {
    return (
        <form action={logoutAction}>
            <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-chocolate-soft transition-colors hover:bg-surface-muted hover:text-chocolate"
            >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Log out
            </button>
        </form>
    );
}
