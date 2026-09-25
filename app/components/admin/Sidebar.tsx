'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, UserCircle, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/app/components/admin/LogoutButton';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/account', label: 'Account', icon: UserCircle },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar({
    brandName,
    adminName,
    adminEmail,
}: {
    brandName: string;
    adminName: string;
    adminEmail: string;
}) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

    const navList = (
        <nav className="flex flex-1 flex-col gap-1 px-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
                            active
                                ? 'bg-primary-soft text-chocolate'
                                : 'text-chocolate-soft hover:bg-surface-muted hover:text-chocolate',
                        )}
                    >
                        <Icon className="h-4 w-4" strokeWidth={active ? 2 : 1.75} />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
                <span className="font-serif text-lg text-chocolate">{brandName}</span>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    className="rounded-md p-2 text-chocolate-soft hover:bg-surface-muted"
                >
                    <Menu className="h-5 w-5" strokeWidth={1.75} />
                </button>
            </div>

            {/* Mobile drawer overlay */}
            {isOpen ? (
                <div
                    className="fixed inset-0 z-40 bg-chocolate/30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            ) : null}

            {/* Sidebar: fixed on desktop, sliding drawer on mobile */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex items-center justify-between px-5 py-5">
                    <span className="font-serif text-lg text-chocolate">{brandName}</span>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="rounded-md p-1.5 text-chocolate-soft hover:bg-surface-muted md:hidden"
                    >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                </div>

                {navList}

                <div className="mt-auto border-t border-border px-3 py-4">
                    <div className="mb-2 px-3">
                        <p className="truncate text-[13px] font-medium text-chocolate">
                            {adminName}
                        </p>
                        <p className="truncate text-xs text-chocolate-muted">{adminEmail}</p>
                    </div>
                    <LogoutButton />
                </div>
            </aside>
        </>
    );
}
