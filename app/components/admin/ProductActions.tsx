'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
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

    const handleToggle = () => {
        startTransition(async () => {
            const result = await setProductActiveAction(id, !isActive);
            if (result.success) toast.success(result.message);
            else toast.error(result.error);
        });
    };

    const handleDelete = () => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

        startTransition(async () => {
            const result = await deleteProductAction(id);
            if (result.success) toast.success(result.message);
            else toast.error(result.error);
        });
    };

    return (
        <div className="flex items-center justify-end gap-1">
            <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                className="rounded-md px-2.5 py-1.5 text-[13px] font-medium text-chocolate-soft transition-colors hover:bg-surface-muted hover:text-chocolate disabled:opacity-50"
            >
                {isActive ? 'Deactivate' : 'Activate'}
            </button>
            <Link
                href={`/admin/products/${id}/edit`}
                aria-label={`Edit ${name}`}
                className="rounded-md p-1.5 text-chocolate-soft transition-colors hover:bg-surface-muted hover:text-chocolate"
            >
                <Pencil className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                aria-label={`Delete ${name}`}
                className="rounded-md p-1.5 text-chocolate-soft transition-colors hover:bg-status-cancelled-bg hover:text-status-cancelled disabled:opacity-50"
            >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
            </button>
        </div>
    );
}
