
'use client';

import { updateSettings } from '@/app/admin/(dashboard)/settings/actions';
import { DEFAULT_CURRENCY } from '@/lib/constants';
import { SiteSettingsDTO } from '@/services/settings.service';

import {
    Globe2,
    Link2,
    MapPin,
    MessageCircle,
    Save,
    Store,
    Truck,
} from 'lucide-react';

import {
    SiFacebook,
    SiInstagram,
    SiWhatsapp,
    SiX,
} from 'react-icons/si';

import {
    useState,
    useTransition,
    type FormEvent,
    type ReactNode,
} from 'react';

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

export default function SettingsForm({
    initialSettings,
}: SettingsFormProps) {
    const [form, setForm] = useState<FormState>(() =>
        toFormState(initialSettings),
    );

    const [isPending, startTransition] = useTransition();
    const [fieldErrors, setFieldErrors] = useState<
        Record<string, string>
    >({});

    function set<K extends keyof FormState>(
        key: K,
        value: FormState[K],
    ) {
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

    function setSocial(
        key: keyof FormState['social'],
        value: string,
    ) {
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
                description:
                    'Your changes have been saved successfully.',
            });

            setForm(toFormState(result.data as any));
        });
    }

    const initial =
        form.brandName.trim().charAt(0).toUpperCase() || 'S';

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
        >
            <div className="overflow-hidden rounded-2xl border border-amber-200/70 bg-white shadow-[0_10px_35px_rgba(108,78,48,0.07)]">
                {/* Header / Preview */}
                <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50/90 via-[#fff8f0] to-white px-6 py-7 sm:px-8 lg:px-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <LogoPreview
                                key={form.logoUrl}
                                url={form.logoUrl}
                                fallbackLetter={initial}
                            />

                            <div className="min-w-0">
                                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                                    <Store className="h-3 w-3" />
                                    Store settings
                                </div>

                                <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                                    {form.brandName || 'Your store'}
                                </h1>

                                <p className="mt-1 line-clamp-2 max-w-xl text-[13px] leading-5 text-slate-500">
                                    {form.description ||
                                        'Manage your storefront information, contact details, social links and shipping settings.'}
                                </p>
                            </div>
                        </div>

                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-white/70 text-amber-600 shadow-sm sm:flex">
                            <Globe2 className="h-[18px] w-[18px]" />
                        </div>
                    </div>
                </div>

                {/* General */}
                <Section
                    icon={<Store className="h-[17px] w-[17px]" />}
                    title="General"
                    description="Your store identity displayed across the storefront and search results."
                >
                    <div className="space-y-5">
                        <Field
                            label="Brand name"
                            htmlFor="brandName"
                            error={fieldErrors.brandName}
                        >
                            <input
                                id="brandName"
                                name="brandName"
                                type="text"
                                value={form.brandName}
                                onChange={(event) =>
                                    set(
                                        'brandName',
                                        event.target.value,
                                    )
                                }
                                autoComplete="organization"
                                required
                                aria-invalid={Boolean(
                                    fieldErrors.brandName,
                                )}
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
                                onChange={(event) =>
                                    set(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                rows={4}
                                aria-invalid={Boolean(
                                    fieldErrors.description,
                                )}
                                className={`${inputClass} min-h-[112px] resize-y leading-6`}
                            />
                        </Field>

                        <Field
                            label="Logo URL"
                            htmlFor="logoUrl"
                            hint="Paste a direct image URL for your storefront logo."
                            error={fieldErrors.logoUrl}
                        >
                            <div className="relative">
                                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    id="logoUrl"
                                    name="logoUrl"
                                    type="url"
                                    value={form.logoUrl}
                                    onChange={(event) =>
                                        set(
                                            'logoUrl',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="https://example.com/logo.png"
                                    autoComplete="url"
                                    aria-invalid={Boolean(
                                        fieldErrors.logoUrl,
                                    )}
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* Contact */}
                <Section
                    icon={<MapPin className="h-[17px] w-[17px]" />}
                    title="Contact"
                    description="Information customers can use to contact your store."
                >
                    <div className="space-y-5">
                        <Field
                            label="Address"
                            htmlFor="address"
                            error={fieldErrors.address}
                        >
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={form.address}
                                    onChange={(event) =>
                                        set(
                                            'address',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="street-address"
                                    aria-invalid={Boolean(
                                        fieldErrors.address,
                                    )}
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <Field
                            label="Website"
                            htmlFor="websiteUrl"
                            error={fieldErrors.websiteUrl}
                        >
                            <div className="relative">
                                <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    id="websiteUrl"
                                    name="websiteUrl"
                                    type="url"
                                    value={form.websiteUrl}
                                    onChange={(event) =>
                                        set(
                                            'websiteUrl',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="https://example.com"
                                    autoComplete="url"
                                    aria-invalid={Boolean(
                                        fieldErrors.websiteUrl,
                                    )}
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </Field>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field
                                label="Phone"
                                htmlFor="phone"
                                error={fieldErrors.phone}
                            >
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(event) =>
                                        set(
                                            'phone',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="tel"
                                    inputMode="tel"
                                    aria-invalid={Boolean(
                                        fieldErrors.phone,
                                    )}
                                    className={inputClass}
                                />
                            </Field>

                            <Field
                                label="Email"
                                htmlFor="email"
                                error={fieldErrors.email}
                            >
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        set(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                    autoComplete="email"
                                    aria-invalid={Boolean(
                                        fieldErrors.email,
                                    )}
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                    </div>
                </Section>

                {/* Social Links */}
                <Section
                    icon={<Link2 className="h-[17px] w-[17px]" />}
                    title="Social links"
                    description="Optional. Leave a field blank to keep that social link hidden."
                >
                    <div className="grid gap-5 sm:grid-cols-2">
                        <SocialField
                            icon={
                                <SiFacebook className="h-4 w-4" />
                            }
                            label="Facebook"
                            htmlFor="facebook"
                            value={form.social.facebook}
                            placeholder="https://facebook.com/..."
                            onChange={(value) =>
                                setSocial('facebook', value)
                            }
                        />

                        <SocialField
                            icon={
                                <SiInstagram className="h-4 w-4" />
                            }
                            label="Instagram"
                            htmlFor="instagram"
                            value={form.social.instagram}
                            placeholder="https://instagram.com/..."
                            onChange={(value) =>
                                setSocial('instagram', value)
                            }
                        />

                        <SocialField
                            icon={
                                <SiWhatsapp className="h-4 w-4" />
                            }
                            label="WhatsApp"
                            htmlFor="whatsapp"
                            value={form.social.whatsapp}
                            placeholder="https://wa.me/..."
                            onChange={(value) =>
                                setSocial('whatsapp', value)
                            }
                        />

                        <SocialField
                            icon={<SiX className="h-4 w-4" />}
                            label="X / Twitter"
                            htmlFor="twitter"
                            value={form.social.twitter}
                            placeholder="https://x.com/..."
                            onChange={(value) =>
                                setSocial('twitter', value)
                            }
                        />
                    </div>
                </Section>

                {/* Shipping */}
                <Section
                    icon={<Truck className="h-[17px] w-[17px]" />}
                    title="Shipping"
                    description="Default shipping cost automatically applied during checkout."
                >
                    <Field
                        label="Shipping cost"
                        htmlFor="shippingCost"
                    >
                        <div className="relative max-w-md">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-amber-700">
                                {DEFAULT_CURRENCY === 'USD'
                                    ? '$'
                                    : DEFAULT_CURRENCY}
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
                                    set(
                                        'shippingCost',
                                        Number(
                                            event.target.value,
                                        ),
                                    )
                                }
                                className={`${inputClass} pl-8 font-medium`}
                            />
                        </div>
                    </Field>
                </Section>

                {/* Save footer */}
                <div className="border-t border-amber-100 bg-[#fffaf4] px-6 py-4 sm:px-8 lg:px-10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                Store settings
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Changes will be reflected across your storefront.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? (
                                <Spinner />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}

                            {isPending
                                ? 'Saving…'
                                : 'Save changes'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

const inputClass =
    'block w-full rounded-lg border border-amber-200/80 bg-amber-50/25 px-3 py-2.5 text-sm leading-5 text-slate-900 shadow-none outline-none placeholder:text-slate-400 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/40 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10';

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
        <section className="grid grid-cols-1 gap-7 border-b border-amber-100 px-6 py-8 last:border-b-0 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:px-10">
            <div className="flex gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200/80 bg-amber-50 text-amber-700 shadow-sm">
                    {icon}
                </div>

                <div>
                    <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1.5 max-w-xs text-[12px] leading-5 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-5">
                {children}
            </div>
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
            <label
                htmlFor={htmlFor}
                className="block text-[13px] font-semibold text-slate-800"
            >
                {label}
            </label>

            <div className="mt-2">
                {children}
            </div>

            {error ? (
                <p
                    id={feedbackId}
                    className="mt-1.5 text-xs font-medium text-red-600"
                >
                    {error}
                </p>
            ) : hint ? (
                <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}

function SocialField({
    icon,
    label,
    htmlFor,
    value,
    placeholder,
    onChange,
}: {
    icon: ReactNode;
    label: string;
    htmlFor: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label
                htmlFor={htmlFor}
                className="block text-[13px] font-semibold text-slate-800"
            >
                {label}
            </label>

            <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-slate-400">
                    {icon}
                </span>

                <input
                    id={htmlFor}
                    name={htmlFor}
                    type="url"
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    placeholder={placeholder}
                    className={`${inputClass} pl-9`}
                />
            </div>
        </div>
    );
}

function LogoPreview({
    url,
    fallbackLetter,
}: {
    url: string;
    fallbackLetter: string;
}) {
    const [failed, setFailed] = useState(false);

    const showFallback = !url || failed;

    return (
        <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
            <div className="absolute inset-1 rounded-lg border border-amber-100" />

            {showFallback ? (
                <span className="relative text-xl font-semibold text-amber-600">
                    {fallbackLetter}
                </span>
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={url}
                    alt="Logo preview"
                    className="relative h-full w-full object-contain p-2.5"
                    onError={() => setFailed(true)}
                />
            )}
        </div>
    );
}

function Spinner() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
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

