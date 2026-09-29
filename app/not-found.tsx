import Link from 'next/link';

import {
    ArrowLeft,
    ArrowRight,
    Flame,
} from 'lucide-react';
import { categoryName } from '@/lib/constants';

export default function NotFound() {
    return (
        <main className="min-h-[70vh] bg-[#fff8f2]">
            <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
                {/* Background glow */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/40 blur-3xl" />

                <div className="relative w-full max-w-2xl rounded-[2rem] border border-orange-100 bg-white px-6 py-14 text-center shadow-2xl shadow-gray-50 sm:px-10 sm:py-16">
                    {/* Icon */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-2xl shadow-gray-50">
                        <Flame
                            className="h-7 w-7"
                            strokeWidth={1.6}
                        />
                    </div>

                    {/* Error number */}
                    <p className="mt-7 font-serif text-7xl leading-none text-orange-500/20 sm:text-8xl">
                        404
                    </p>

                    <h1 className="-mt-2 font-serif text-3xl text-chocolate sm:text-4xl">
                        This page has gone out.
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-chocolate-soft sm:text-[15px]">
                        The page you&apos;re looking for doesn&apos;t
                        exist, may have been moved, or is no longer
                        available.
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-6 py-3.5 text-sm font-bold text-chocolate shadow-2xl shadow-gray-50 transition hover:border-orange-300 hover:bg-orange-50"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back Home
                        </Link>

                        <Link
                            href="/products"
                            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600"
                        >
                            Explore {categoryName}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}