'use client';


import { changePassword, updateProfile } from '@/app/admin/(dashboard)/account/action';
import { useRouter } from 'next/navigation';
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

    const [profile, setProfile] = useState<ProfileForm>({
        name: initialAdmin.name,
        email: initialAdmin.email,
    });

    const [password, setPassword] = useState<PasswordForm>({
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
        if (!result.errors) return {};

        return Object.fromEntries(
            Object.entries(result.errors).map(
                ([key, value]) => [
                    key,
                    Array.isArray(value) ? value[0] : value,
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
            const result = (await updateProfile(
                initialAdmin.email,
                profile,
            )) as ActionResultWithErrors;

            if (!result.success) {
                const errors = extractErrors(result);

                setProfileErrors(errors);

                toast.error(
                    result.message ?? 'Could not update profile.',
                    {
                        description: 'Please check the form for errors and try again.',
                    }
                );

                return;
            }

            toast.success(
                result.message ?? 'Profile updated successfully.',
                {
                    description: 'Your profile information has been updated.',
                }
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
                currentPassword: 'Current password is required.',
            });

            return;
        }

        if (!password.newPassword.trim()) {
            setPasswordErrors({
                newPassword: 'New password is required.',
            });

            return;
        }

        startPasswordTransition(async () => {
            const result = (await changePassword(
                initialAdmin.email,
                password,
            )) as ActionResultWithErrors;

            if (!result.success) {
                const errors = extractErrors(result);

                setPasswordErrors(errors);

                toast.error(
                    result.message ?? 'Could not change password.',{
                        description: 'Please check the form for errors and try again.',
                    }
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

            // The server action destroys the session after
            // successfully changing the password.
            router.replace('/admin/login');
        });
    }

    return (
        <div className="space-y-6">
            {/* =========================================================
                Profile
            ========================================================= */}
            <AccountSection
                icon={<UserIcon />}
                title="Profile information"
                description="Update the name and email address associated with your admin account."
            >
                <form
                    onSubmit={handleProfileSubmit}
                    noValidate
                    className="space-y-5"
                >
                    <Field
                        label="Name"
                        htmlFor="admin-name"
                        error={profileErrors.name}
                    >
                        <input
                            id="admin-name"
                            name="name"
                            type="text"
                            value={profile.name}
                            onChange={(event) =>
                                setProfileField(
                                    'name',
                                    event.target.value,
                                )
                            }
                            autoComplete="name"
                            required
                            aria-invalid={Boolean(
                                profileErrors.name,
                            )}
                            className={inputClass}
                        />
                    </Field>

                    <Field
                        label="Email address"
                        htmlFor="admin-email"
                        error={profileErrors.email}
                    >
                        <input
                            id="admin-email"
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={(event) =>
                                setProfileField(
                                    'email',
                                    event.target.value,
                                )
                            }
                            autoComplete="email"
                            required
                            aria-invalid={Boolean(
                                profileErrors.email,
                            )}
                            className={inputClass}
                        />
                    </Field>

                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            disabled={isProfilePending}
                            className={buttonClass}
                        >
                            {isProfilePending && <Spinner />}
                            {isProfilePending
                                ? 'Saving…'
                                : 'Save profile'}
                        </button>
                    </div>
                </form>
            </AccountSection>

            {/* =========================================================
                Password
            ========================================================= */}
            <AccountSection
                icon={<LockIcon />}
                title="Change password"
                description="Update your admin password. You will need to log in again after changing it."
            >
                <form
                    onSubmit={handlePasswordSubmit}
                    noValidate
                    className="space-y-5"
                >
                    <Field
                        label="Current password"
                        htmlFor="current-password"
                        error={passwordErrors.currentPassword}
                    >
                        <input
                            id="current-password"
                            name="currentPassword"
                            type="password"
                            value={password.currentPassword}
                            onChange={(event) =>
                                setPasswordField(
                                    'currentPassword',
                                    event.target.value,
                                )
                            }
                            autoComplete="current-password"
                            required
                            aria-invalid={Boolean(
                                passwordErrors.currentPassword,
                            )}
                            className={inputClass}
                        />
                    </Field>

                    <Field
                        label="New password"
                        htmlFor="new-password"
                        error={passwordErrors.newPassword}
                    >
                        <input
                            id="new-password"
                            name="newPassword"
                            type="password"
                            value={password.newPassword}
                            onChange={(event) =>
                                setPasswordField(
                                    'newPassword',
                                    event.target.value,
                                )
                            }
                            autoComplete="new-password"
                            required
                            aria-invalid={Boolean(
                                passwordErrors.newPassword,
                            )}
                            className={inputClass}
                        />
                    </Field>

                    <div className="rounded-md border border-amber-200/70 bg-amber-50/40 px-3.5 py-3">
                        <div className="flex items-start gap-2.5">
                            <ShieldIcon />

                            <div>
                                <p className="text-[13px] font-medium leading-5 text-slate-800">
                                    Session security
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                                    Changing your password invalidates
                                    previous sessions and signs you out.
                                    You will need to log in again.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            disabled={isPasswordPending}
                            className={buttonClass}
                        >
                            {isPasswordPending && <Spinner />}
                            {isPasswordPending
                                ? 'Updating…'
                                : 'Update password'}
                        </button>
                    </div>
                </form>
            </AccountSection>

            {/* =========================================================
                Security information
            ========================================================= */}
            <AccountSection
                icon={<ShieldIcon />}
                title="Security"
                description="Account protection currently handled by the admin authentication system."
            >
                <div className="space-y-3">
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
        </div>
    );
}

/* =========================================================
   Shared UI
========================================================= */

const inputClass =
    'block w-full rounded-md border border-amber-200/80 bg-amber-50/30 px-3 py-2.5 text-sm font-normal leading-5 text-slate-900 shadow-none outline-none ring-0 placeholder:text-slate-400 transition-colors duration-200 hover:border-amber-300 focus:border-amber-500 focus:outline-none focus-visible:outline-none focus:ring-0';

const buttonClass =
    'inline-flex cursor-pointer min-h-10 items-center justify-center gap-2 rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold leading-5 text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow-md focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-amber-500/30 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-amber-600 disabled:hover:shadow-sm';

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
        <section className="overflow-hidden rounded-xl bg-white border border-amber-200/70">
            <div className="grid grid-cols-1 gap-7 px-6 py-8 sm:px-8 lg:grid-cols-3 lg:gap-10 lg:px-10">
                <div className="flex gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200/80 bg-amber-100/40 text-amber-700">
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold leading-5 text-slate-900">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-slate-600">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {children}
                </div>
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
        <div>
            <label
                htmlFor={htmlFor}
                className="block text-sm font-medium leading-5 text-slate-800"
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
        <div className="rounded-md border border-amber-200/60 bg-amber-50/25 px-4 py-3">
            <p className="text-[13px] font-medium leading-5 text-slate-800">
                {title}
            </p>

            <p className="mt-0.5 text-xs leading-5 text-slate-500">
                {description}
            </p>
        </div>
    );
}

/* =========================================================
   Icons
========================================================= */

function UserIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="8"
                r="3.25"
            />

            <path
                d="M5.5 19c.8-3.1 3.1-4.75 6.5-4.75s5.7 1.65 6.5 4.75"
                strokeLinecap="round"
            />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
        >
            <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
            />

            <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
        >
            <path
                d="M12 3.5 19 6v5.25c0 4.35-2.8 7.65-7 9.25-4.2-1.6-7-4.9-7-9.25V6l7-2.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="m9.2 12 1.8 1.8 3.8-4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
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