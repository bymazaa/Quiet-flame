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
            label: 'Total',
            value: summary.total,
            icon: ShoppingBag,
        },
        {
            label: 'Pending',
            value: summary.pending,
            icon: Clock3,
        },
        {
            label: 'Confirmed',
            value: summary.confirmed,
            icon: CheckCircle2,
        },
        {
            label: 'Delivered',
            value: summary.delivered,
            icon: PackageCheck,
        },
        {
            label: 'Cancelled',
            value: summary.cancelled,
            icon: XCircle,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.label}
                        className="rounded-md border border-amber-200/70 bg-amber-50/25 px-4 py-3"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-medium text-slate-500">
                                {item.label}
                            </p>

                            <Icon
                                className="h-4 w-4 text-amber-600"
                                strokeWidth={1.7}
                            />
                        </div>

                        <p className="mt-1.5 text-lg font-semibold leading-6 text-slate-900">
                            {item.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}