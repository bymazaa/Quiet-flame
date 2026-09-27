'use client';

import {
    Check,
    Copy,
} from 'lucide-react';

import {
    useState,
} from 'react';

type CopyButtonProps = {
    value: string;
    label?: string;
};

export function CopyButton({
    value,
    label = 'Copy',
}: CopyButtonProps) {
    const [copied, setCopied] =
        useState(false);

    async function handleCopy() {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(
                value,
            );

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            setCopied(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            aria-label={
                copied
                    ? 'Copied'
                    : `Copy ${label}`
            }
            title={
                copied
                    ? 'Copied'
                    : `Copy ${label}`
            }
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-600 transition hover:border-orange-200 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">
                        Copied
                    </span>
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5" />

                    <span className="hidden sm:inline">
                        {label}
                    </span>
                </>
            )}
        </button>
    );
}