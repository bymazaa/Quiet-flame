// @/app/components/ui/ConfirmModal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ConfirmModalProps = {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isConfirming?: boolean;
    variant?: 'default' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isConfirming = false,
    variant = 'default',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        confirmButtonRef.current?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, onCancel]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div
                onClick={onCancel}
                className="absolute inset-0 animate-[fadeIn_0.2s_ease-out] bg-chocolate/40 backdrop-blur-[2px]"
            />

            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                aria-describedby={description ? 'confirm-modal-desc' : undefined}
                className="relative w-full max-w-sm animate-[popIn_0.2s_ease-out] rounded-lg border border-border bg-surface p-6 shadow-2xl"
            >
                <h2 id="confirm-modal-title" className="font-serif text-lg text-chocolate">
                    {title}
                </h2>
                {description ? (
                    <p id="confirm-modal-desc" className="mt-2 text-[13px] text-chocolate-muted">
                        {description}
                    </p>
                ) : null}

                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md cursor-pointer px-3.5 py-2 text-[13px] font-medium text-chocolate-soft transition-colors hover:bg-surface-muted"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        type="button"
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className={cn(
                            'rounded-md px-3.5 cursor-pointer py-2 text-[13px] font-medium text-white transition-colors disabled:opacity-60',
                            variant === 'danger'
                                ? 'bg-status-cancelled hover:bg-status-cancelled/90'
                                : 'bg-chocolate hover:bg-chocolate/90',
                        )}
                    >
                        {isConfirming ? 'Logging out…' : confirmLabel}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95) translateY(4px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>,
        document.body,
    );
}
