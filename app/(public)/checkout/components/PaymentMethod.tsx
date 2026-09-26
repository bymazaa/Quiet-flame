'use client';

import {
    Banknote,
    Check,
    CreditCard,
} from 'lucide-react';

export type PaymentMethodValue =
    | 'cod'
    | 'paypal';

interface PaymentMethodProps {
    value: PaymentMethodValue;
    onChange: (
        value: PaymentMethodValue,
    ) => void;
    error?: string;
}

export function PaymentMethod({
    value,
    onChange,
    error,
}: PaymentMethodProps) {
    return (
        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
            <div className="mb-6">
                <h2 className="font-serif text-xl font-bold text-[#3b2419]">
                    Payment Method
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Choose how you&apos;d like to pay.
                </p>
            </div>

            <div className="space-y-3">
                {/* COD */}
                <button
                    type="button"
                    onClick={() =>
                        onChange('cod')
                    }
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        value === 'cod'
                            ? 'border-orange-400 bg-orange-50 ring-4 ring-orange-100'
                            : 'border-orange-100 bg-[#fffaf6] hover:border-orange-200'
                    }`}
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                        <Banknote className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#3b2419]">
                            Cash on Delivery
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Pay when your order arrives.
                        </p>
                    </div>

                    {value === 'cod' && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                            <Check className="h-4 w-4" />
                        </div>
                    )}
                </button>

                {/* PayPal */}
                <button
                    type="button"
                    onClick={() =>
                        onChange('paypal')
                    }
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        value === 'paypal'
                            ? 'border-blue-400 bg-blue-50 ring-4 ring-blue-100'
                            : 'border-orange-100 bg-[#fffaf6] hover:border-orange-200'
                    }`}
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <CreditCard className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#3b2419]">
                            PayPal
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Pay securely with PayPal.
                        </p>
                    </div>

                    {value === 'paypal' && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                            <Check className="h-4 w-4" />
                        </div>
                    )}
                </button>
            </div>

            {error && (
                <p className="mt-2 text-xs text-red-500">
                    {error}
                </p>
            )}
        </section>
    );
}