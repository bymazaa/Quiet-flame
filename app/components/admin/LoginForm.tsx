'use client';

import { useActionState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { FormError } from '@/app/components/ui/FormError';
import { loginAction } from '@/app/admin/login/actions';
import type { ActionResult } from '@/lib/action-result';

const initialState: ActionResult | null = null;

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    const generalError = state && !state.success && !state.fieldErrors ? state.error : undefined;

    return (
        <form action={formAction} noValidate className="space-y-5">
            {generalError ? (
                <div
                    role="alert"
                    className="rounded-md border border-status-cancelled/30 bg-status-cancelled-bg px-3.5 py-2.5 text-[13px] text-status-cancelled"
                >
                    {generalError}
                </div>
            ) : null}

            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@quietflame.shop"
                    hasError={!state?.success && !!state?.fieldErrors?.email}
                    required
                />
                <FormError message={!state?.success ? state?.fieldErrors?.email : undefined} />
            </div>

            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    hasError={!state?.success && !!state?.fieldErrors?.password}
                    required
                />
                <FormError message={!state?.success ? state?.fieldErrors?.password : undefined} />
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isPending}>
                {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
        </form>
    );
}
