'use client';

import {
    changePassword,
    updateProfile,
} from '@/app/admin/(dashboard)/account/action';

import { useRouter } from 'next/navigation';

import {
    CheckCircle2,
    KeyRound,
    LockKeyhole,
    Mail,
    Save,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import {
    useState,
    useTransition,
    type FormEvent,
    type ReactNode,
} from 'react';

import { toast } from 'sonner';

interface AccountFormProps {
    initialAdmin: {
        name: string;
        email: string;
    };
}

type ProfileForm = {
    name: string;
    email: string;
};

type PasswordForm = {
    currentPassword: string;
    newPassword: string;
};

type FieldErrors = Record<string, string>;

type ActionResultWithErrors = {
    success: boolean;
    message?: string;
    data?: unknown;
    errors?: Record<string, string[] | string>;
};

export default function AccountForm({
    initialAdmin,
}: AccountFormProps) {
    const router = useRouter();

    const [profile, setProfile] =
        useState<ProfileForm>({
            name: initialAdmin.name,
            email: initialAdmin.email,
        });

    const [password, setPassword] =
        useState<PasswordForm>({
            currentPassword: '',
            newPassword: '',
        });

    const [profileErrors, setProfileErrors] =
        useState<FieldErrors>({});

    const [passwordErrors, setPasswordErrors] =
        useState<FieldErrors>({});

    const [isProfilePending, startProfileTransition] =
        useTransition();

    const [isPasswordPending, startPasswordTransition] =
        useTransition();

    function setProfileField(
        key: keyof ProfileForm,
        value: string,
    ) {
        setProfile((prev) => ({
            ...prev,
            [key]: value,
        }));

        setProfileErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }

    function setPasswordField(
        key: keyof PasswordForm,
        value: string,
    ) {
        setPassword((prev) => ({
            ...prev,
            [key]: value,
        }));

        setPasswordErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }

    function extractErrors(
        result: ActionResultWithErrors,
    ): FieldErrors {
        if (!result.errors) {
            return {};
        }

        return Object.fromEntries(
            Object.entries(result.errors).map(
                ([key, value]) => [
                    key,
                    Array.isArray(value)
                        ? value[0]
                        : value,
                ],
            ),
        );
    }

    function handleProfileSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setProfileErrors({});

        startProfileTransition(async () => {
            const result =
                (await updateProfile(
                    initialAdmin.email,
                    {
                        name: profile.name,
                        email: initialAdmin.email,
                    },
                )) as ActionResultWithErrors;

            if (!result.success) {
                const errors =
                    extractErrors(result);

                setProfileErrors(errors);

                toast.error(
                    result.message ??
                        'Could not update profile.',
                    {
                        description:
                            'Please check the form for errors and try again.',
                    },
                );

                return;
            }

            toast.success(
                result.message ??
                    'Profile updated successfully.',
                {
                    description:
                        'Your profile information has been updated.',
                },
            );
        });
    }

    function handlePasswordSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setPasswordErrors({});

        if (!password.currentPassword.trim()) {
            setPasswordErrors({
                currentPassword:
                    'Current password is required.',
            });

            return;
        }

        if (!password.newPassword.trim()) {
            setPasswordErrors({
                newPassword:
                    'New password is required.',
            });

            return;
        }

        startPasswordTransition(async () => {
            const result =
                (await changePassword(
                    initialAdmin.email,
                    password,
                )) as ActionResultWithErrors;

            if (!result.success) {
                const errors =
                    extractErrors(result);

                setPasswordErrors(errors);

                toast.error(
                    result.message ??
                        'Could not change password.',
                    {
                        description:
                            'Please check the form for errors and try again.',
                    },
                );

                return;
            }

            toast.success(
                result.message ??
                    'Password changed successfully. Please log in again.',
            );

            setPassword({
                currentPassword: '',
                newPassword: '',
            });

            router.replace('/admin/login');
        });
    }

    const initials =
        profile.name
            .trim()
            .charAt(0)
            .toUpperCase() || 'A';

    return (
        <div className="w-full max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                {/* =====================================================
                    Header
                ===================================================== */}

                <header className="border-b border-orange-100 bg-[#fffaf6] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-amber-50 text-lg font-bold text-amber-700 sm:h-14 sm:w-14 sm:text-xl">
                                {initials}
                            </div>

                            <div className="min-w-0">
                                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-700">
                                    <UserRound className="h-3 w-3" />
                                    Admin account
                                </div>

                                <h1 className="truncate text-lg font-semibold tracking-tight text-chocolate sm:text-xl">
                                    {profile.name ||
                                        'Admin account'}
                                </h1>

                                <p className="mt-0.5 truncate text-xs text-chocolate-muted sm:text-sm">
                                    {profile.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-xl border border-amber-200/70 bg-white px-3 py-2.5 shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />

                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wide text-chocolate-muted">
                                    Security
                                </p>

                                <p className="text-xs font-semibold text-chocolate">
                                    Protected account
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* =====================================================
                    Profile
                ===================================================== */}

                <AccountSection
                    icon={
                        <UserRound className="h-4 w-4" />
                    }
                    title="Profile information"
                    description="Update the name associated with your admin account."
                >
                    <form
                        onSubmit={
                            handleProfileSubmit
                        }
                        noValidate
                        className="space-y-5"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Name */}

                            <Field
                                label="Name"
                                htmlFor="admin-name"
                                error={
                                    profileErrors.name
                                }
                            >
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="admin-name"
                                        name="name"
                                        type="text"
                                        value={
                                            profile.name
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setProfileField(
                                                'name',
                                                event.target
                                                    .value,
                                            )
                                        }
                                        autoComplete="name"
                                        required
                                        aria-invalid={Boolean(
                                            profileErrors.name,
                                        )}
                                        disabled={
                                            isProfilePending
                                        }
                                        className={`${inputClass} pl-9 disabled:cursor-not-allowed disabled:opacity-60`}
                                    />
                                </div>
                            </Field>

                            {/* Email */}

                            <Field
                                label="Email address"
                                htmlFor="admin-email"
                                error={
                                    profileErrors.email
                                }
                            >
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="admin-email"
                                        name="email"
                                        type="email"
                                        value={
                                            profile.email
                                        }
                                        readOnly
                                        aria-readonly="true"
                                        className={`${inputClass} cursor-not-allowed bg-slate-50 pl-9 text-slate-500`}
                                    />
                                </div>

                                <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                                    Your account email
                                    cannot be changed.
                                </p>
                            </Field>
                        </div>

                        <div className="flex justify-end border-t border-orange-100 pt-4">
                            <button
                                type="submit"
                                disabled={
                                    isProfilePending
                                }
                                className={buttonClass}
                            >
                                {isProfilePending ? (
                                    <Spinner />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}

                                {isProfilePending
                                    ? 'Saving…'
                                    : 'Save profile'}
                            </button>
                        </div>
                    </form>
                </AccountSection>

                {/* =====================================================
                    Password
                ===================================================== */}

                <AccountSection
                    icon={
                        <KeyRound className="h-4 w-4" />
                    }
                    title="Change password"
                    description="Update your admin password. You will need to log in again after changing it."
                >
                    <form
                        onSubmit={
                            handlePasswordSubmit
                        }
                        noValidate
                        className="space-y-5"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Current password */}

                            <Field
                                label="Current password"
                                htmlFor="current-password"
                                error={
                                    passwordErrors.currentPassword
                                }
                            >
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="current-password"
                                        name="currentPassword"
                                        type="password"
                                        value={
                                            password.currentPassword
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setPasswordField(
                                                'currentPassword',
                                                event.target
                                                    .value,
                                            )
                                        }
                                        autoComplete="current-password"
                                        required
                                        aria-invalid={Boolean(
                                            passwordErrors.currentPassword,
                                        )}
                                        disabled={
                                            isPasswordPending
                                        }
                                        className={`${inputClass} pl-9 disabled:cursor-not-allowed disabled:opacity-60`}
                                    />
                                </div>
                            </Field>

                            {/* New password */}

                            <Field
                                label="New password"
                                htmlFor="new-password"
                                error={
                                    passwordErrors.newPassword
                                }
                            >
                                <div className="relative">
                                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="new-password"
                                        name="newPassword"
                                        type="password"
                                        value={
                                            password.newPassword
                                        }
                                        onChange={(
                                            event,
                                        ) =>
                                            setPasswordField(
                                                'newPassword',
                                                event.target
                                                    .value,
                                            )
                                        }
                                        autoComplete="new-password"
                                        required
                                        aria-invalid={Boolean(
                                            passwordErrors.newPassword,
                                        )}
                                        disabled={
                                            isPasswordPending
                                        }
                                        className={`${inputClass} pl-9 disabled:cursor-not-allowed disabled:opacity-60`}
                                    />
                                </div>
                            </Field>
                        </div>

                        {/* Security Note */}

                        <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Session security
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Changing your password
                                        invalidates previous
                                        sessions and signs you
                                        out. You will need to log
                                        in again.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-orange-100 pt-4">
                            <button
                                type="submit"
                                disabled={
                                    isPasswordPending
                                }
                                className={buttonClass}
                            >
                                {isPasswordPending ? (
                                    <Spinner />
                                ) : (
                                    <KeyRound className="h-4 w-4" />
                                )}

                                {isPasswordPending
                                    ? 'Updating…'
                                    : 'Update password'}
                            </button>
                        </div>
                    </form>
                </AccountSection>

                {/* =====================================================
                    Security
                ===================================================== */}

                <AccountSection
                    icon={
                        <ShieldCheck className="h-4 w-4" />
                    }
                    title="Security"
                    description="Account protection currently handled by the admin authentication system."
                >
                    <div className="grid gap-3">
                        <SecurityItem
                            title="Password protection"
                            description="Your password is stored as a secure password hash and is never exposed by default."
                        />

                        <SecurityItem
                            title="Failed login protection"
                            description="After 5 failed login attempts, the account is temporarily locked for 15 minutes."
                        />

                        <SecurityItem
                            title="Session invalidation"
                            description="Changing your password invalidates older authentication tokens."
                        />
                    </div>
                </AccountSection>

                {/* =====================================================
                    Footer
                ===================================================== */}

                <div className="border-t border-orange-100 bg-[#fffaf6] px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />

                        <span>
                            Your account settings are protected
                            and only accessible to authenticated
                            administrators.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   Shared UI
============================================================ */

const inputClass =
    'block w-full rounded-xl border border-orange-100 bg-[#fffaf6] px-3 py-2.5 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400 transition-all duration-200 hover:border-orange-200 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10';

const buttonClass =
    'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold leading-5 text-white shadow-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60';

function AccountSection({
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
        <section className="grid gap-6 border-b border-orange-100 px-4 py-7 sm:px-6 sm:py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 lg:px-8">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200/70 bg-amber-50 text-amber-700">
                    {icon}
                </div>

                <div className="min-w-0">
                    <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1.5 max-w-xs text-xs leading-5 text-slate-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="min-w-0">
                {children}
            </div>
        </section>
    );
}

function Field({
    label,
    htmlFor,
    error,
    children,
}: {
    label: string;
    htmlFor: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="min-w-0">
            <label
                htmlFor={htmlFor}
                className="block text-[13px] font-semibold text-slate-800"
            >
                {label}
            </label>

            <div className="mt-2">
                {children}
            </div>

            {error && (
                <p className="mt-1.5 text-xs font-medium leading-4 text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function SecurityItem({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-xl border border-orange-100 bg-[#fffaf6] p-3.5 transition-colors duration-200 hover:border-orange-200">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-5 text-slate-800">
                        {title}
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        {description}
                    </p>
                </div>
            </div>
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
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
            />
        </svg>
    );
}