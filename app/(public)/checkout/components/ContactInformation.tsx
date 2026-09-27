
'use client';

import { Mail, Phone, User } from 'lucide-react';

interface ContactInfo {
    name: string;
    email: string;
    phone: string;
}

interface ContactErrors {
    name?: string;
    email?: string;
    phone?: string;
}

interface ContactInformationProps {
    value: ContactInfo;
    onChange: (value: ContactInfo) => void;
    errors?: ContactErrors;
}

const inputClass = (error?: string) =>
    `w-full rounded-2xl border bg-[#fffaf6] py-3 pl-10 pr-4 text-sm text-[#3b2419] outline-none transition placeholder:text-gray-400 sm:text-base ${
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            : 'border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100'
    }`;

export function ContactInformation({
    value,
    onChange,
    errors,
}: ContactInformationProps) {
    const updateField = (
        field: keyof ContactInfo,
        fieldValue: string,
    ) => {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    };

    return (
        <section className="w-full rounded-3xl border border-orange-100 bg-white p-4 shadow-2xl shadow-gray-50 sm:p-6">
            <div className="mb-5 sm:mb-6">
                <h2 className="font-serif text-xl font-bold text-[#3b2419] sm:text-2xl">
                    Contact Information
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">
                    We&apos;ll use these details to contact
                    you about your order.
                </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
                {/* Name */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Full Name
                    </label>

                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={value.name}
                            onChange={(e) =>
                                updateField(
                                    'name',
                                    e.target.value,
                                )
                            }
                            placeholder="Your full name"
                            autoComplete="name"
                            className={inputClass(
                                errors?.name,
                            )}
                        />
                    </div>

                    {errors?.name && (
                        <p className="mt-1.5 text-xs leading-5 text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email Address
                    </label>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="email"
                            value={value.email}
                            onChange={(e) =>
                                updateField(
                                    'email',
                                    e.target.value,
                                )
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                            inputMode="email"
                            className={inputClass(
                                errors?.email,
                            )}
                        />
                    </div>

                    {errors?.email && (
                        <p className="mt-1.5 text-xs leading-5 text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>

                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="tel"
                            value={value.phone}
                            onChange={(e) =>
                                updateField(
                                    'phone',
                                    e.target.value,
                                )
                            }
                            placeholder="Phone number"
                            autoComplete="tel"
                            inputMode="tel"
                            className={inputClass(
                                errors?.phone,
                            )}
                        />
                    </div>

                    {errors?.phone && (
                        <p className="mt-1.5 text-xs leading-5 text-red-500">
                            {errors.phone}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

