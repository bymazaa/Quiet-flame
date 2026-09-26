'use client';

import { Printer } from 'lucide-react';

export function PrintOrderButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold text-chocolate shadow-2xl shadow-gray-50 transition hover:border-orange-200 hover:bg-orange-50"
        >
            <Printer
                className="h-4 w-4"
                strokeWidth={1.8}
            />

            Print Order
        </button>
    );
}