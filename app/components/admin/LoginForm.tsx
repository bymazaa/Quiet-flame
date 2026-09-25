'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { FormError } from '@/app/components/ui/FormError';
import { loginAction } from '@/app/admin/login/actions';
import type { ActionResult } from '@/lib/action-result';

const initialState: ActionResult | null = null;

function MailIcon() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0-.414.336-.75.75-.75h18a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-18a.75.75 0 01-.75-.75V6.75z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H6.75a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5z"
            />
        </svg>
    );
}

function EyeIcon({ open }: { open: boolean }) {
    return open ? (
        <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    ) : (
        <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
        </svg>
    );
}

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const [showPassword, setShowPassword] = useState(false);

    const generalError = state && !state.success && !state.fieldErrors ? state.error : undefined;

    return (
        <form action={formAction} noValidate className="space-y-5">
            {generalError ? (
                <div
                    role="alert"
                    className="animate-[slideDown_0.25s_ease-out] rounded-md border border-status-cancelled/30 bg-status-cancelled-bg px-3.5 py-2.5 text-[13px] text-status-cancelled"
                >
                    {generalError}
                </div>
            ) : null}

            <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-chocolate-muted">
                        <MailIcon />
                    </span>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        spellCheck={false}
                        placeholder="you@quietflame.shop"
                        className="pl-9 transition-shadow duration-200"
                        hasError={!state?.success && !!state?.fieldErrors?.email}
                        disabled={isPending}
                        required
                    />
                </div>
                <FormError message={!state?.success ? state?.fieldErrors?.email : undefined} />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-chocolate-muted">
                        <LockIcon />
                    </span>
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="pl-9 pr-10 transition-shadow duration-200"
                        hasError={!state?.success && !!state?.fieldErrors?.password}
                        disabled={isPending}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-3 flex items-center text-chocolate-muted transition-colors hover:text-chocolate"
                    >
                        <EyeIcon open={showPassword} />
                    </button>
                </div>
                <FormError message={!state?.success ? state?.fieldErrors?.password : undefined} />
            </div>

            <Button
                type="submit"
                size="lg"
                className="w-full cursor-pointer transition-transform active:scale-[0.98]"
                isLoading={isPending}
            >
                {isPending ? 'Signing in…' : 'Sign in'}
            </Button>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </form>
    );
}
