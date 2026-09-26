'use client';

import { MapPin } from 'lucide-react';

interface ShippingAddressInfo {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface ShippingErrors {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

interface ShippingAddressProps {
    value: ShippingAddressInfo;
    onChange: (
        value: ShippingAddressInfo,
    ) => void;
    errors?: ShippingErrors;
}

const inputClass = (error?: string) =>
    `w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 outline-none transition ${
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            : 'border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100'
    }`;

export function ShippingAddress({
    value,
    onChange,
    errors,
}: ShippingAddressProps) {
    const updateField = (
        field: keyof ShippingAddressInfo,
        fieldValue: string,
    ) => {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    };

    return (
        <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-2xl shadow-gray-50 sm:p-6">
            <div className="mb-6">
                <h2 className="font-serif text-xl font-bold text-[#3b2419]">
                    Shipping Address
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Where should we deliver your order?
                </p>
            </div>

            <div className="space-y-5">
                {/* Address */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Street Address
                    </label>

                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                        <textarea
                            rows={3}
                            value={value.address}
                            onChange={(e) =>
                                updateField(
                                    'address',
                                    e.target.value,
                                )
                            }
                            placeholder="House number, street, area"
                            className={`w-full resize-none rounded-2xl border bg-[#fffaf6] py-3 pl-10 pr-4 outline-none transition ${
                                errors?.address
                                    ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                                    : 'border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100'
                            }`}
                        />
                    </div>

                    {errors?.address && (
                        <p className="mt-1.5 text-xs text-red-500">
                            {errors.address}
                        </p>
                    )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {/* City */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            City
                        </label>

                        <input
                            type="text"
                            value={value.city}
                            onChange={(e) =>
                                updateField(
                                    'city',
                                    e.target.value,
                                )
                            }
                            placeholder="City"
                            className={inputClass(
                                errors?.city,
                            )}
                        />

                        {errors?.city && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.city}
                            </p>
                        )}
                    </div>

                    {/* State */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            State
                        </label>

                        <input
                            type="text"
                            value={value.state}
                            onChange={(e) =>
                                updateField(
                                    'state',
                                    e.target.value,
                                )
                            }
                            placeholder="State"
                            className={inputClass(
                                errors?.state,
                            )}
                        />

                        {errors?.state && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.state}
                            </p>
                        )}
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Postal Code
                        </label>

                        <input
                            type="text"
                            value={value.postalCode}
                            onChange={(e) =>
                                updateField(
                                    'postalCode',
                                    e.target.value,
                                )
                            }
                            placeholder="Postal code"
                            className={inputClass(
                                errors?.postalCode,
                            )}
                        />

                        {errors?.postalCode && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.postalCode}
                            </p>
                        )}
                    </div>

                    {/* Country */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Country
                        </label>

                        <input
                            type="text"
                            value={value.country}
                            onChange={(e) =>
                                updateField(
                                    'country',
                                    e.target.value,
                                )
                            }
                            placeholder="Country"
                            className={inputClass(
                                errors?.country,
                            )}
                        />

                        {errors?.country && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.country}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}