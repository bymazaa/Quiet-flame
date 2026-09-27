
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
        <section className="w-full rounded-3xl border border-orange-100 bg-white p-4 shadow-2xl shadow-gray-50 sm:p-6">
            {/* =====================================================
                Header
            ===================================================== */}

            <div className="mb-5 sm:mb-6">
                <h2 className="font-serif text-xl font-bold text-[#3b2419] sm:text-2xl">
                    Payment Method
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-gray-500">
                    Choose how you&apos;d like to pay.
                </p>
            </div>

            {/* =====================================================
                Payment Options
            ===================================================== */}

            <div className="space-y-3">

                {/* =================================================
                    Cash on Delivery
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        onChange('cod')
                    }
                    aria-pressed={
                        value === 'cod'
                    }
                    className={`flex cursor-pointer w-full min-w-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition sm:gap-4 sm:p-4 ${
                        value === 'cod'
                            ? 'border-orange-400 bg-orange-50 ring-4 ring-orange-100'
                            : 'border-orange-100 bg-[#fffaf6] hover:border-orange-200 hover:bg-orange-50/40'
                    }`}
                >
                    {/* Icon */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 sm:h-11 sm:w-11 sm:rounded-2xl">
                        <Banknote className="h-5 w-5" />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-5 text-[#3b2419] sm:text-base">
                            Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                            Pay when your order arrives.
                        </p>
                    </div>

                    {/* Selected */}

                    {value === 'cod' && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                            <Check className="h-4 w-4" />
                        </div>
                    )}
                </button>

                {/* =================================================
                    PayPal
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        onChange('paypal')
                    }
                    aria-pressed={
                        value === 'paypal'
                    }
                    className={`flex w-full cursor-pointer min-w-0 items-center gap-3 rounded-2xl border p-3.5 text-left transition sm:gap-4 sm:p-4 ${
                        value === 'paypal'
                            ? 'border-blue-400 bg-blue-50 ring-4 ring-blue-100'
                            : 'border-orange-100 bg-[#fffaf6] hover:border-orange-200 hover:bg-orange-50/40'
                    }`}
                >
                    {/* Icon */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 sm:h-11 sm:w-11 sm:rounded-2xl">
                        <CreditCard className="h-5 w-5" />
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-5 text-[#3b2419] sm:text-base">
                            PayPal
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                            Pay securely with PayPal.
                        </p>
                    </div>

                    {/* Selected */}

                    {value ===
                        'paypal' && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                            <Check className="h-4 w-4" />
                        </div>
                    )}
                </button>
            </div>

            {/* =====================================================
                Error
            ===================================================== */}

            {error && (
                <p
                    role="alert"
                    className="mt-2 text-xs leading-5 text-red-500"
                >
                    {error}
                </p>
            )}
        </section>
    );
}

