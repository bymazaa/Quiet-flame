// @/app/components/admin/LogoutButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { LogOut } from 'lucide-react';
import { ConfirmModal } from '@/app/components/ui/ConfirmModal';
import { logoutAction } from '@/app/admin/(dashboard)/actions';

export function LogoutButton() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium text-chocolate-soft transition-colors hover:bg-surface-muted hover:text-status-cancelled"
            >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Log out
            </button>

            <ConfirmModal
                open={isConfirmOpen}
                title="Log out?"
                description="You'll need to sign in again to access the admin dashboard."
                confirmLabel="Log out"
                cancelLabel="Cancel"
                isConfirming={isPending}
                variant="danger"
                onConfirm={handleConfirm}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </>
    );
}
