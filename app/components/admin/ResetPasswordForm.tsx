'use client';

import { resetPasswordAction } from '@/app/admin/reset-password/action';
import { useState, useTransition } from 'react';

import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { FormError } from '@/app/components/ui/FormError';

import { resetPasswordSchema } from '@/lib/validation/auth.schema';
import { useRouter } from 'next/navigation';

type ResetPasswordFormProps = {
token: string;
};

type FieldErrors = {
password?: string;
confirmPassword?: string;
};

export function ResetPasswordForm({
token,
}: ResetPasswordFormProps) {
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');


const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
const [generalError, setGeneralError] = useState('');
const [message, setMessage] = useState('');

const [isPending, startTransition] = useTransition();
    const router=useRouter()
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFieldErrors({});
    setGeneralError('');
    setMessage('');

    const validation = resetPasswordSchema.safeParse({
        token,
        password,
        confirmPassword,
    });

    if (!validation.success) {
        const errors: FieldErrors = {};

        for (const issue of validation.error.issues) {
            const field = issue.path[0];

            if (
                field === 'password' &&
                !errors.password
            ) {
                errors.password = issue.message;
            }

            if (
                field === 'confirmPassword' &&
                !errors.confirmPassword
            ) {
                errors.confirmPassword = issue.message;
            }
        }

        setFieldErrors(errors);
        return;
    }

    startTransition(async () => {
        const result = await resetPasswordAction({
            token,
            password,
            confirmPassword,
        });

        if (result.success) {
            setMessage(result.message ?? 'Password reset successfully.');
            setPassword('');
            setConfirmPassword('');
            router.push("/admin/login")
            return;
        }

        if (result.fieldErrors) {
            setFieldErrors({
                password: result.fieldErrors.password?.[0],
                confirmPassword: result.fieldErrors.confirmPassword?.[0],
            });
        }

        setGeneralError(result.error);
    });
};

return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
        <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
        >
            {generalError ? (
                <div
                    role="alert"
                    className="animate-[slideDown_0.25s_ease-out] rounded-md border border-status-cancelled/30 bg-status-cancelled-bg px-3.5 py-2.5 text-[13px] text-status-cancelled"
                >
                    {generalError}
                </div>
            ) : null}

            <div className="space-y-1.5">
                <Label htmlFor="password">
                    New password
                </Label>

                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);

                        if (fieldErrors.password) {
                            setFieldErrors((prev) => ({
                                ...prev,
                                password: undefined,
                            }));
                        }
                    }}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={isPending}
                    hasError={!!fieldErrors.password}
                    required
                />

                <FormError message={fieldErrors.password} />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">
                    Confirm password
                </Label>

                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);

                        if (fieldErrors.confirmPassword) {
                            setFieldErrors((prev) => ({
                                ...prev,
                                confirmPassword: undefined,
                            }));
                        }
                    }}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    disabled={isPending}
                    hasError={!!fieldErrors.confirmPassword}
                    required
                />

                <FormError message={fieldErrors.confirmPassword} />
            </div>

            {message ? (
                <div
                    role="status"
                    className="rounded-md border border-green-700/20 bg-green-50 px-3.5 py-2.5 text-[13px] text-green-700"
                >
                    {message}
                </div>
            ) : null}

            <Button
                type="submit"
                size="lg"
                className="w-full cursor-pointer transition-transform active:scale-[0.98]"
                isLoading={isPending}
            >
                {isPending
                    ? 'Resetting…'
                    : 'Reset password'}
            </Button>

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-6px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </form>
    </div>
);
}

