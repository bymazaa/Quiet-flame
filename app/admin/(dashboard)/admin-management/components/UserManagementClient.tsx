'use client';

import Link from 'next/link';

import {
    Plus,
    ShieldCheck,
    UserRoundPlus,
    Ban,
    CheckCircle2,
    Trash2,
    X,
    Users,
    LockKeyhole,
} from 'lucide-react';

import { toast } from 'sonner';

import { AdminDTO } from '@/services/admin-management.service';

import {
    createAdminAction,
    deleteAdminAction,
    setAdminStatusAction,
} from '../action';

import { LocalDateTime } from '@/app/components/ui/Timeformat';

import { useRouter } from 'next/navigation';

import {
    useState,
    useTransition,
} from 'react';

interface UserManagementClientProps {
    initialAdmins: AdminDTO[];
}

type CreateForm = {
    name: string;
    email: string;
    password: string;
};

type FormErrors = {
    name?: string;
    email?: string;
    password?: string;
};

export default function UserManagementClient({
    initialAdmins,
}: UserManagementClientProps) {
    const router = useRouter();

    const [admins, setAdmins] =
        useState(initialAdmins);

    const [isCreateOpen, setIsCreateOpen] =
        useState(false);

    const [deleteAdminTarget, setDeleteAdminTarget] =
        useState<AdminDTO | null>(null);

    const [createForm, setCreateForm] =
        useState<CreateForm>({
            name: '',
            email: '',
            password: '',
        });

    const [formErrors, setFormErrors] =
        useState<FormErrors>({});

    const [pendingAction, setPendingAction] =
        useState<string | null>(null);

    const [
        isCreatePending,
        startCreateTransition,
    ] = useTransition();

    const [
        isActionPending,
        startActionTransition,
    ] = useTransition();

    const isPending =
        isCreatePending ||
        isActionPending;

    function resetCreateForm() {
        setCreateForm({
            name: '',
            email: '',
            password: '',
        });

        setFormErrors({});
    }

    function closeCreateModal() {
        if (isCreatePending) {
            return;
        }

        setIsCreateOpen(false);

        resetCreateForm();
    }

    function openCreateModal() {
        resetCreateForm();

        setIsCreateOpen(true);
    }

    function updateCreateField(
        key: keyof CreateForm,
        value: string,
    ) {
        setCreateForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setFormErrors((prev) => ({
            ...prev,
            [key]: undefined,
        }));
    }

    function handleCreateAdmin(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setFormErrors({});

        startCreateTransition(async () => {
            const result =
                await createAdminAction(
                    createForm,
                );

            if (!result.success) {
                setFormErrors({
                    name:
                        result.errors?.name?.[0],

                    email:
                        result.errors?.email?.[0],

                    password:
                        result.errors?.password?.[0],
                });

                toast.error(result.message);

                return;
            }

            toast.success(
                'Admin created successfully.',
            );

            setIsCreateOpen(false);

            resetCreateForm();

            router.refresh();
        });
    }

    function handleStatusChange(
        admin: AdminDTO,
    ) {
        const nextStatus =
            admin.status === 'active'
                ? 'blocked'
                : 'active';

        setPendingAction(
            `${nextStatus}-${admin.id}`,
        );

        startActionTransition(async () => {
            const result =
                await setAdminStatusAction({
                    adminId: admin.id,
                    status: nextStatus,
                });

            if (!result.success) {
                toast.error(result.message);

                setPendingAction(null);

                return;
            }

            setAdmins((prev) =>
                prev.map((item) =>
                    item.id === admin.id
                        ? {
                              ...item,
                              status: nextStatus,
                              updatedAt: new Date(),
                          }
                        : item,
                ),
            );

            toast.success(
                result.message,
            );

            setPendingAction(null);

            router.refresh();
        });
    }

    function handleDelete(
        admin: AdminDTO,
    ) {
        setDeleteAdminTarget(admin);
    }

    function closeDeleteModal() {
        if (isActionPending) {
            return;
        }

        setDeleteAdminTarget(null);
    }

    function confirmDelete() {
        if (!deleteAdminTarget) {
            return;
        }

        const admin =
            deleteAdminTarget;

        setPendingAction(
            `delete-${admin.id}`,
        );

        startActionTransition(async () => {
            const result =
                await deleteAdminAction({
                    adminId: admin.id,
                });

            if (!result.success) {
                toast.error(result.message);

                setPendingAction(null);

                return;
            }

            setAdmins((prev) =>
                prev.filter(
                    (item) =>
                        item.id !== admin.id,
                ),
            );

            toast.success(
                result.message,
            );

            setPendingAction(null);

            setDeleteAdminTarget(null);

            router.refresh();
        });
    }

    return (
        <div className="w-full space-y-6">
            {/* =====================================================
                Page Header
            ====================================================== */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200/70 bg-amber-50 text-amber-700">
                            <Users className="h-4 w-4" />
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold tracking-tight text-chocolate sm:text-xl">
                                User management
                            </h1>

                            <p className="mt-0.5 text-xs text-chocolate-muted sm:text-sm">
                                Manage administrator
                                accounts and access.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={
                        openCreateModal
                    }
                    className="inline-flex min-h-10 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                    <Plus className="h-4 w-4" />

                    Add admin
                </button>
            </div>

            {/* =====================================================
                Stats
            ====================================================== */}
            <div className="grid gap-3 sm:grid-cols-3">
                <StatCard
                    label="Total admins"
                    value={admins.length}
                    icon={
                        <Users className="h-4 w-4" />
                    }
                />

                <StatCard
                    label="Active"
                    value={
                        admins.filter(
                            (admin) =>
                                admin.status ===
                                'active',
                        ).length
                    }
                    icon={
                        <CheckCircle2 className="h-4 w-4" />
                    }
                />

                <StatCard
                    label="Blocked"
                    value={
                        admins.filter(
                            (admin) =>
                                admin.status ===
                                'blocked',
                        ).length
                    }
                    icon={
                        <Ban className="h-4 w-4" />
                    }
                />
            </div>

            {/* =====================================================
                Table
            ====================================================== */}
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                <div className="border-b border-orange-100 bg-[#fffaf6] px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Administrator accounts
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                View and manage all admin
                                accounts.
                            </p>
                        </div>

                        <span className="rounded-full border border-orange-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                            {admins.length}{' '}
                            users
                        </span>
                    </div>
                </div>

                {admins.length === 0 ? (
                    <EmptyState
                        onAdd={
                            openCreateModal
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead>
                                <tr className="border-b border-orange-100 bg-[#fffaf6]">
                                    <th className={thClass}>
                                        Admin
                                    </th>

                                    <th className={thClass}>
                                        Role
                                    </th>

                                    <th className={thClass}>
                                        Status
                                    </th>

                                    <th className={thClass}>
                                        Created
                                    </th>

                                    <th className={thClass}>
                                        Updated
                                    </th>

                                    <th
                                        className={`${thClass} text-right`}
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-orange-50">
                                {admins.map(
                                    (admin) => {
                                        const isProtected =
                                            admin.isSuperAdmin;

                                        const statusPending =
                                            pendingAction ===
                                                `blocked-${admin.id}` ||
                                            pendingAction ===
                                                `active-${admin.id}`;

                                        const deletePending =
                                            pendingAction ===
                                            `delete-${admin.id}`;

                                        return (
                                            <tr
                                                key={
                                                    admin.id
                                                }
                                                className="transition-colors hover:bg-orange-50/30"
                                            >
                                                {/* Admin */}
                                                <td className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-[#fffaf6] text-xs font-bold text-orange-700">
                                                            {admin.name
                                                                .trim()
                                                                .charAt(
                                                                    0,
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                                {
                                                                    admin.name
                                                                }
                                                            </p>

                                                            <p className="truncate text-xs text-slate-500">
                                                                {
                                                                    admin.email
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="px-4 py-4 sm:px-6">
                                                    {isProtected ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                                                            <ShieldCheck className="h-3 w-3" />

                                                            Super admin
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                                            Admin
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-4 sm:px-6">
                                                    <StatusBadge
                                                        status={
                                                            admin.status
                                                        }
                                                    />
                                                </td>

                                                {/* Created */}
                                                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500 sm:px-6">
                                                    <LocalDateTime
                                                        date={
                                                            admin.createdAt
                                                        }
                                                    />
                                                </td>

                                                {/* Updated */}
                                                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500 sm:px-6">
                                                    <LocalDateTime
                                                        date={
                                                            admin.updatedAt
                                                        }
                                                    />
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-4 sm:px-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {isProtected ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] font-medium text-slate-500">
                                                                <LockKeyhole className="h-3.5 w-3.5" />

                                                                Protected
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isPending
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            admin,
                                                                        )
                                                                    }
                                                                    className={
                                                                        admin.status ===
                                                                        'active'
                                                                            ? actionDangerClass
                                                                            : actionSuccessClass
                                                                    }
                                                                >
                                                                    {statusPending ? (
                                                                        <Spinner />
                                                                    ) : admin.status ===
                                                                      'active' ? (
                                                                        <Ban className="h-3.5 w-3.5" />
                                                                    ) : (
                                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                                    )}

                                                                    {admin.status ===
                                                                    'active'
                                                                        ? 'Block'
                                                                        : 'Activate'}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isPending
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            admin,
                                                                        )
                                                                    }
                                                                    className={
                                                                        actionDeleteClass
                                                                    }
                                                                >
                                                                    {deletePending ? (
                                                                        <Spinner />
                                                                    ) : (
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    )}

                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* =====================================================
                Create Modal
            ====================================================== */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-orange-100 bg-[#fffaf6] px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200/70 bg-amber-50 text-amber-700">
                                    <UserRoundPlus className="h-4 w-4" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Add admin
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Create a new administrator
                                        account.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeCreateModal
                                }
                                disabled={
                                    isCreatePending
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-orange-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleCreateAdmin
                            }
                            noValidate
                        >
                            <div className="space-y-4 p-5">
                                <FormField
                                    label="Name"
                                    error={
                                        formErrors.name
                                    }
                                >
                                    <input
                                        type="text"
                                        value={
                                            createForm.name
                                        }
                                        onChange={(event) =>
                                            updateCreateField(
                                                'name',
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="Admin name"
                                        autoComplete="name"
                                        disabled={
                                            isCreatePending
                                        }
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Email address"
                                    error={
                                        formErrors.email
                                    }
                                >
                                    <input
                                        type="email"
                                        value={
                                            createForm.email
                                        }
                                        onChange={(event) =>
                                            updateCreateField(
                                                'email',
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="admin@example.com"
                                        autoComplete="email"
                                        disabled={
                                            isCreatePending
                                        }
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>

                                <FormField
                                    label="Password"
                                    error={
                                        formErrors.password
                                    }
                                >
                                    <input
                                        type="password"
                                        value={
                                            createForm.password
                                        }
                                        onChange={(event) =>
                                            updateCreateField(
                                                'password',
                                                event.target
                                                    .value,
                                            )
                                        }
                                        placeholder="Minimum 8 characters"
                                        autoComplete="new-password"
                                        disabled={
                                            isCreatePending
                                        }
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>

                                <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-3.5 py-3">
                                    <div className="flex items-start gap-2.5">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                                        <p className="text-xs leading-5 text-slate-600">
                                            New accounts are created
                                            as normal admins.
                                            Super admin access cannot
                                            be assigned from this form.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-orange-100 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={
                                        closeCreateModal
                                    }
                                    disabled={
                                        isCreatePending
                                    }
                                    className={
                                        cancelButtonClass
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        isCreatePending
                                    }
                                    className={
                                        primaryButtonClass
                                    }
                                >
                                    {isCreatePending ? (
                                        <Spinner />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}

                                    {isCreatePending
                                        ? 'Creating…'
                                        : 'Create admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =====================================================
                Delete Confirmation Modal
            ====================================================== */}
            {deleteAdminTarget && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-orange-100 bg-[#fffaf6] px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Delete admin
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    isActionPending
                                }
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-orange-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-5 py-5">
                            <p className="text-sm leading-6 text-slate-600">
                                Are you sure you want to
                                delete{' '}
                                <span className="font-semibold text-slate-900">
                                    {
                                        deleteAdminTarget.name
                                    }
                                </span>
                                ?
                            </p>

                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50/60 px-3.5 py-3">
                                <div className="flex items-start gap-2.5">
                                    <Trash2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                                    <p className="text-xs leading-5 text-red-700">
                                        The admin account and
                                        its access will be
                                        permanently removed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 border-t border-orange-100 px-5 py-4">
                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    isActionPending
                                }
                                className={
                                    cancelButtonClass
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDelete
                                }
                                disabled={
                                    isActionPending
                                }
                                className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isActionPending ? (
                                    <Spinner />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}

                                {isActionPending
                                    ? 'Deleting…'
                                    : 'Delete admin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ============================================================
   Components
============================================================ */

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200/70 bg-amber-50 text-amber-700">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: 'active' | 'blocked';
}) {
    if (status === 'active') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Blocked
        </span>
    );
}

function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-[13px] font-semibold text-slate-800">
                {label}
            </label>

            <div className="mt-2">
                {children}
            </div>

            {error && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

function EmptyState({
    onAdd,
}: {
    onAdd: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
                <Users className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No admin users found
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Create an administrator account to
                start managing users.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
                <Plus className="h-4 w-4" />

                Add admin
            </button>
        </div>
    );
}

function Spinner() {
    return (
        <svg
            className="h-3.5 w-3.5 animate-spin"
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

/* ============================================================
   Styles
============================================================ */

const inputClass =
    'block w-full rounded-xl border border-orange-100 bg-[#fffaf6] px-3 py-2.5 text-sm leading-5 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-orange-200 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60';

const thClass =
    'px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:px-6';

const actionDangerClass =
    'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50';

const actionSuccessClass =
    'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 text-[11px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50';

const actionDeleteClass =
    'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50';

const primaryButtonClass =
    'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60';

const cancelButtonClass =
    'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';