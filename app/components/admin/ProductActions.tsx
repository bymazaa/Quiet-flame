'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/app/components/ui/ConfirmModal';
import {
    setProductActiveAction,
    deleteProductAction,
} from '@/app/admin/(dashboard)/products/actions';

export function ProductActions({
    id,
    isActive,
    name,
}: {
    id: string;
    isActive: boolean;
    name: string;
}) {
    const [isPending, startTransition] = useTransition();
    const [pendingAction, setPendingAction] = useState<'toggle' | 'delete' | null>(null);
    const [isToggleOpen, setIsToggleOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleToggle = () => {
        setIsToggleOpen(false);
        setPendingAction('toggle');
        startTransition(async () => {
            const result = await setProductActiveAction(id, !isActive);
            if (result.success)
                toast.success('Status Updated', {
                    description: isActive
                        ? 'Product hidden from customers.'
                        : 'Product visible to customers.',
                });
            else toast.error(result.error);
            setPendingAction(null);
        });
    };

    const handleDelete = () => {
        setIsDeleteOpen(false);
        setPendingAction('delete');

        startTransition(async () => {
            const result = await deleteProductAction(id);

            if (result.success)
                toast.success('Product Removed', {
                    description: 'Product deleted successfully.',
                });
            else toast.error(result.error);

            setPendingAction(null);
        });
    };

    return (
        <>
            <div className="flex items-center justify-end gap-1.5">
                <button
                    type="button"
                    onClick={() => setIsToggleOpen(true)}
                    disabled={isPending}
                    className={cn(
                        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50',
                        isActive
                            ? 'bg-status-cancelled-bg text-status-cancelled hover:bg-status-cancelled/15'
                            : 'bg-status-delivered-bg text-status-delivered hover:bg-status-delivered/15',
                    )}
                >
                    {isPending && pendingAction === 'toggle' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
                    ) : null}
                    {isActive ? 'Hide ' : 'Show'}
                </button>

                <Link
                    href={`/admin/products/${id}/edit`}
                    aria-label={`Edit ${name}`}
                    title="Edit"
                    className="rounded-md p-2 text-chocolate-muted transition-colors hover:bg-surface-muted hover:text-chocolate"
                >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                </Link>

                <button
                    type="button"
                    onClick={() => setIsDeleteOpen(true)}
                    disabled={isPending}
                    aria-label={`Delete ${name}`}
                    title="Delete"
                    className="rounded-md p-2 cursor-pointer text-chocolate-muted transition-colors hover:bg-surface-muted hover:text-chocolate disabled:pointer-events-none disabled:opacity-40"
                >
                    {isPending && pendingAction === 'delete' ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    ) : (
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                    )}
                </button>
            </div>

            <ConfirmModal
                open={isToggleOpen}
                title={isActive ? `Hide "${name}"?` : `Show "${name}"?`}
                description={
                    isActive
                        ? 'Customers will no longer be able to see or purchase this product.'
                        : 'This product will become visible and purchasable in the store.'
                }
                confirmLabel={isActive ? 'Hide' : 'Show'}
                cancelLabel="Cancel"
                isConfirming={isPending && pendingAction === 'toggle'}
                variant={isActive ? 'danger' : 'default'}
                onConfirm={handleToggle}
                onCancel={() => setIsToggleOpen(false)}
            />

            <ConfirmModal
                open={isDeleteOpen}
                title={`Delete "${name}"?`}
                description="This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isConfirming={isPending && pendingAction === 'delete'}
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteOpen(false)}
            />
        </>
    );
}
