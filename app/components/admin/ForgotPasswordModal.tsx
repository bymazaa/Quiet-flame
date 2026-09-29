'use client';

import { forgotPasswordAction } from '@/app/admin/reset-password/action';
import { useState, useTransition } from 'react';

export function ForgotPasswordModal() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage('');
        setError('');

        startTransition(async () => {
            const result = await forgotPasswordAction({ email });

            if (result.success) {
               if(result.message){
                 setMessage(result?.message);
               }
                setEmail('');
            } else {
                setError(result.error);
            }
        });
    };

    const handleClose = () => {
        if (isPending) return;

        setOpen(false);
        setEmail('');
        setMessage('');
        setError('');
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-3 cursor-pointer text-sm text-chocolate underline-offset-4 hover:underline"
            >
                Forgot password?
            </button>

            {open ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            handleClose();
                        }
                    }}
                >
                    <div className="w-full max-w-md rounded-xl bg-cream p-6 shadow-xl">
                        <div className="mb-6">
                            <h2 className="font-serif text-2xl text-chocolate">
                                Forgot password?
                            </h2>

                            <p className="mt-2 text-sm text-chocolate-muted">
                                Enter your admin email and we&apos;ll send you a
                                password reset link.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="reset-email"
                                    className="mb-1.5 block text-sm text-chocolate"
                                >
                                    Email
                                </label>

                                <input
                                    id="reset-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                    required
                                    disabled={isPending}
                                    className="w-full rounded-lg border border-chocolate/15 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-chocolate/40 disabled:opacity-60"
                                />
                            </div>

                            {error ? (
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            ) : null}

                            {message ? (
                                <p className="text-sm text-green-700">
                                    {message}
                                </p>
                            ) : null}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isPending}
                                    className="cursor-pointer rounded-lg border border-chocolate/15 px-4 py-2.5 text-sm text-chocolate disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="cursor-pointer rounded-lg bg-chocolate px-4 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isPending
                                        ? 'Sending...'
                                        : 'Send reset link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
}