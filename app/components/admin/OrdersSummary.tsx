import {
    CheckCircle2,
    Clock3,
    PackageCheck,
    ShoppingBag,
    XCircle,
} from 'lucide-react';

interface OrdersSummaryProps {
    summary: {
        total: number;
        pending: number;
        confirmed: number;
        delivered: number;
        cancelled: number;
    };
}

export function OrdersSummary({
    summary,
}: OrdersSummaryProps) {
    const items = [
        {
            label: 'Total Orders',
            value: summary.total,
            icon: ShoppingBag,
            iconWrapper:
                'bg-slate-100 text-slate-600',
            valueColor: 'text-slate-900',
        },
        {
            label: 'Pending',
            value: summary.pending,
            icon: Clock3,
            iconWrapper:
                'bg-amber-100 text-amber-700',
            valueColor: 'text-amber-700',
        },
        {
            label: 'Confirmed',
            value: summary.confirmed,
            icon: CheckCircle2,
            iconWrapper:
                'bg-blue-100 text-blue-700',
            valueColor: 'text-blue-700',
        },
        {
            label: 'Delivered',
            value: summary.delivered,
            icon: PackageCheck,
            iconWrapper:
                'bg-emerald-100 text-emerald-700',
            valueColor: 'text-emerald-700',
        },
        {
            label: 'Cancelled',
            value: summary.cancelled,
            icon: XCircle,
            iconWrapper:
                'bg-red-100 text-red-600',
            valueColor: 'text-red-600',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.label}
                        className="group rounded-xl border border-amber-200/70 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-slate-500">
                                    {item.label}
                                </p>

                                <p
                                    className={`mt-2 text-2xl font-semibold leading-none ${item.valueColor}`}
                                >
                                    {item.value}
                                </p>
                            </div>

                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconWrapper}`}
                            >
                                <Icon
                                    className="h-4.5 w-4.5"
                                    strokeWidth={1.8}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}