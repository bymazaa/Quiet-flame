'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, UserCircle, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/app/components/admin/LogoutButton';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package, exact: false },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
    { href: '/admin/account', label: 'Account', icon: UserCircle, exact: false },
    { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
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

    // Close the drawer on route change and lock body scroll while it's open.
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

    const initials = adminName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    const navList = (
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'group relative flex items-center gap-2.5 rounded-md py-2 pl-3.5 pr-3 text-[13px] font-medium transition-all duration-150',
                            active
                                ? 'bg-primary-soft text-chocolate'
                                : 'text-chocolate-soft hover:bg-surface-muted hover:text-chocolate hover:pl-4',
                        )}
                    >
                        <span
                            className={cn(
                                'absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-chocolate transition-opacity duration-150',
                                active ? 'opacity-100' : 'opacity-0',
                            )}
                        />
                        <Icon
                            className="h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110"
                            strokeWidth={active ? 2 : 1.75}
                        />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-sm md:hidden">
                <span className="font-serif text-lg text-chocolate">{brandName}</span>
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    className="rounded-md p-2 text-chocolate-soft transition-colors hover:bg-surface-muted active:scale-95"
                >
                    <Menu className="h-5 w-5" strokeWidth={1.75} />
                </button>
            </div>

            {/* Mobile drawer overlay — always mounted so the fade transitions both ways */}
            <div
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
                className={cn(
                    'fixed inset-0 z-40 bg-chocolate/30 backdrop-blur-[1px] transition-opacity duration-300 md:hidden',
                    isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
                )}
            />

            {/* Sidebar: fixed on desktop, sliding drawer on mobile */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none',
                    isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
                )}
            >
                <div className="flex items-center justify-between px-5 py-5">
                    <span className="font-serif text-lg text-chocolate">{brandName}</span>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                        className="rounded-md p-1.5 text-chocolate-soft transition-colors hover:bg-surface-muted md:hidden"
                    >
                        <X className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                </div>

                {navList}

                <div className="mt-auto border-t border-border px-3 py-4">
                    <div className="mb-3 flex items-center gap-2.5 px-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[12px] font-semibold text-chocolate">
                            {initials || <UserCircle className="h-4 w-4" strokeWidth={1.75} />}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-chocolate">
                                {adminName}
                            </p>
                            <p className="truncate text-xs text-chocolate-muted">{adminEmail}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>
        </>
    );
}
