'use client';

import { updateSettings } from '@/app/admin/(dashboard)/settings/actions';
import { DEFAULT_CURRENCY } from '@/lib/constants';
import { SiteSettingsDTO } from '@/services/settings.service';
import { useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';

type FormState = Omit<SiteSettingsDTO, 'updatedAt'>;

function toFormState(dto: SiteSettingsDTO): FormState {
    const {
        brandName,
        description,
        logoUrl,
        address,
        shippingCost,
        websiteUrl,
        phone,
        email,
        social,
    } = dto;

    return {
        brandName,
        description,
        logoUrl,
        address,
        shippingCost,
        websiteUrl,
        phone,
        email,
        social,
    };
}

interface SettingsFormProps {
    initialSettings: SiteSettingsDTO;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [form, setForm] = useState<FormState>(() => toFormState(initialSettings));

    const [isPending, startTransition] = useTransition();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    function set<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        if (fieldErrors[key as string]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[key as string];
                return next;
            });
        }
    }

    function setSocial(key: keyof FormState['social'], value: string) {
        setForm((prev) => ({
            ...prev,
            social: {
                ...prev.social,
                [key]: value,
            },
        }));

        const fieldKey = `social.${String(key)}`;

        if (fieldErrors[fieldKey]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[fieldKey];
                return next;
            });
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFieldErrors({});

        startTransition(async () => {
            const result = await updateSettings(form);

            if (!result.success) {
                toast.error('Could not save settings.');
                return;
            }

            toast.success(result.message ?? 'Settings saved.', {
                description: 'Your changes have been saved successfully.',
            });
            setForm(toFormState(result.data as any));
        });
    }

    const initial = form.brandName.trim().charAt(0).toUpperCase() || 'S';

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="overflow-hidden rounded-xl bg-white border border-amber-200/30 bg-transparent shadow-2xl shadow-gray-200/20 ">
                {/* Brand preview */}
                <div className="border-b border-amber-200/70 bg-amber-50/35 px-6 py-6 sm:px-8 lg:px-10">
                    <div className="flex items-center gap-4">
                        <LogoPreview
                            key={form.logoUrl}
                            url={form.logoUrl}
                            fallbackLetter={initial}
                        />

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-semibold text-slate-900">
                                {form.brandName || 'Your brand name'}
                            </p>

                            <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-slate-600">
                                {form.description || 'A short description will appear here'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings sections */}
                <div className="divide-y divide-amber-200/70">
                    <Section
                        icon={<StoreIcon />}
                        title="General"
                        description="Your store identity displayed across the storefront and search results."
                    >
                        <Field label="Brand name" htmlFor="brandName" error={fieldErrors.brandName}>
                            <input
                                id="brandName"
                                name="brandName"
                                type="text"
                                value={form.brandName}
                                onChange={(event) => set('brandName', event.target.value)}
                                autoComplete="organization"
                                required
                                aria-invalid={Boolean(fieldErrors.brandName)}
                                className={inputClass}
                            />
                        </Field>

                        <Field
                            label="Description"
                            htmlFor="description"
                            hint="Used as the meta description for search engines."
                            error={fieldErrors.description}
                        >
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={(event) => set('description', event.target.value)}
                                rows={4}
                                aria-invalid={Boolean(fieldErrors.description)}
                                className={`${inputClass} min-h-28 resize-y leading-6`}
                            />
                        </Field>

                        <Field
                            label="Logo URL"
                            htmlFor="logoUrl"
                            hint="Paste a direct image URL for your storefront logo."
                            error={fieldErrors.logoUrl}
                        >
                            <input
                                id="logoUrl"
                                name="logoUrl"
                                type="url"
                                value={form.logoUrl}
                                onChange={(event) => set('logoUrl', event.target.value)}
                                placeholder="https://example.com/logo.png"
                                autoComplete="url"
                                aria-invalid={Boolean(fieldErrors.logoUrl)}
                                className={inputClass}
                            />
                        </Field>
                    </Section>

                    <Section
                        icon={<ContactIcon />}
                        title="Contact"
                        description="Information customers can use to contact your store."
                    >
                        <Field label="Address" htmlFor="address" error={fieldErrors.address}>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={form.address}
                                onChange={(event) => set('address', event.target.value)}
                                autoComplete="street-address"
                                aria-invalid={Boolean(fieldErrors.address)}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Website" htmlFor="websiteUrl" error={fieldErrors.websiteUrl}>
                            <input
                                id="websiteUrl"
                                name="websiteUrl"
                                type="url"
                                value={form.websiteUrl}
                                onChange={(event) => set('websiteUrl', event.target.value)}
                                placeholder="https://example.com"
                                autoComplete="url"
                                aria-invalid={Boolean(fieldErrors.websiteUrl)}
                                className={inputClass}
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Phone" htmlFor="phone" error={fieldErrors.phone}>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(event) => set('phone', event.target.value)}
                                    autoComplete="tel"
                                    inputMode="tel"
                                    aria-invalid={Boolean(fieldErrors.phone)}
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Email" htmlFor="email" error={fieldErrors.email}>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) => set('email', event.target.value)}
                                    autoComplete="email"
                                    aria-invalid={Boolean(fieldErrors.email)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section
                        icon={<ShareIcon />}
                        title="Social links"
                        description="Optional. Leave a field blank to keep that social link hidden."
                    >
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Facebook" htmlFor="facebook">
                                <input
                                    id="facebook"
                                    name="facebook"
                                    type="url"
                                    value={form.social.facebook}
                                    onChange={(event) => setSocial('facebook', event.target.value)}
                                    placeholder="https://facebook.com/..."
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Instagram" htmlFor="instagram">
                                <input
                                    id="instagram"
                                    name="instagram"
                                    type="url"
                                    value={form.social.instagram}
                                    onChange={(event) => setSocial('instagram', event.target.value)}
                                    placeholder="https://instagram.com/..."
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="WhatsApp" htmlFor="whatsapp">
                                <input
                                    id="whatsapp"
                                    name="whatsapp"
                                    type="url"
                                    value={form.social.whatsapp}
                                    onChange={(event) => setSocial('whatsapp', event.target.value)}
                                    placeholder="https://wa.me/..."
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Twitter / X" htmlFor="twitter">
                                <input
                                    id="twitter"
                                    name="twitter"
                                    type="url"
                                    value={form.social.twitter}
                                    onChange={(event) => setSocial('twitter', event.target.value)}
                                    placeholder="https://x.com/..."
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                    </Section>

                    <Section
                        icon={<TruckIcon />}
                        title="Shipping"
                        description="Default shipping cost automatically applied during checkout."
                    >
                        <Field label="Shipping cost" htmlFor="shippingCost">
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-slate-500">
                                    {DEFAULT_CURRENCY === 'USD' ? '$' : DEFAULT_CURRENCY}
                                </span>

                                <input
                                    id="shippingCost"
                                    name="shippingCost"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    inputMode="decimal"
                                    value={form.shippingCost}
                                    onChange={(event) =>
                                        set('shippingCost', Number(event.target.value))
                                    }
                                    className={`${inputClass} pl-8`}
                                />
                            </div>
                        </Field>
                    </Section>
                </div>

                {/* Save actions */}
                <div className="border-t border-amber-200/70 bg-amber-50/25 px-6 py-4 sm:px-8 lg:px-10">
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow-md focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-amber-500/30 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-amber-600 disabled:hover:shadow-sm cursor-pointer"
                        >
                            {isPending && <Spinner />}
                            {isPending ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

const inputClass =
    'block w-full rounded-md border border-amber-200/80 bg-amber-50/30 px-3 py-2.5 text-sm font-normal leading-5 text-slate-900 shadow-none outline-none ring-0 placeholder:text-slate-400 transition-colors duration-200 hover:border-amber-300 focus:outline-none focus-visible:outline-none  focus:border-amber-500';

function Section({
    icon,
    title,
    description,
    children,
}: {
    icon: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="grid grid-cols-1 gap-7 px-6 py-8 sm:px-8 lg:grid-cols-3 lg:gap-10 lg:px-10">
            <div className="flex gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200/80 bg-amber-100/40 text-amber-700">
                    {icon}
                </div>

                <div className="min-w-0">
                    <h2 className="text-sm font-semibold leading-5 text-slate-900">{title}</h2>

                    {description && (
                        <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-slate-600">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-5 lg:col-span-2">{children}</div>
        </section>
    );
}

function Field({
    label,
    htmlFor,
    hint,
    error,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    error?: string;
    children: ReactNode;
}) {
    const feedbackId = `${htmlFor}-feedback`;

    return (
        <div>
            <label htmlFor={htmlFor} className="block text-sm font-medium leading-5 text-slate-800">
                {label}
            </label>

            <div className="mt-2 outline-none">{children}</div>

            {error ? (
                <p id={feedbackId} className="mt-1.5 text-xs font-medium leading-4 text-red-600">
                    {error}
                </p>
            ) : hint ? (
                <p className="mt-1.5 text-xs leading-4 text-slate-500">{hint}</p>
            ) : null}
        </div>
    );
}

function LogoPreview({ url, fallbackLetter }: { url: string; fallbackLetter: string }) {
    const [failed, setFailed] = useState(false);
    const showFallback = !url || failed;

    return (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-amber-200/80 bg-amber-50/40">
            {showFallback ? (
                <span className="text-lg font-semibold text-amber-400">{fallbackLetter}</span>
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={url}
                    alt="Logo preview"
                    className="h-full w-full object-contain p-1"
                    onError={() => setFailed(true)}
                />
            )}
        </div>
    );
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />

            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}

function StoreIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
        >
            <path d="M4 9.5 5 4h14l1 5.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M5 9.5V20h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 20v-5.5h4V20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ContactIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
        >
            <path d="M4 5h16v11H7l-3 3V5Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 9h8M8 12h5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ShareIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
        >
            <circle cx="6" cy="12" r="2.25" />
            <circle cx="17" cy="6" r="2.25" />
            <circle cx="17" cy="18" r="2.25" />
            <path d="m8 10.8 7-3.6M8 13.2l7 3.6" strokeLinecap="round" />
        </svg>
    );
}

function TruckIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
        >
            <path d="M3 7h11v9H3z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 10h4l3 3v3h-7z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7" cy="18" r="1.75" />
            <circle cx="17.5" cy="18" r="1.75" />
        </svg>
    );
}
