export default function Loading() {
    return (
        <div className="flex-1 px-6 py-8 md:px-10">
            <div className="mx-auto max-w-6xl animate-pulse space-y-8">
                {/* Page heading */}
                <div className="space-y-2">
                    <div className="h-6 w-40 rounded-md bg-surface-muted" />
                    <div className="h-4 w-64 rounded-md bg-surface-muted" />
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border border-border bg-surface p-5">
                            <div className="mb-4 h-9 w-9 rounded-full bg-primary-soft" />
                            <div className="mb-2 h-6 w-20 rounded-md bg-surface-muted" />
                            <div className="h-3 w-24 rounded-md bg-surface-muted" />
                        </div>
                    ))}
                </div>

                {/* Recent activity / table */}
                <div className="rounded-lg border border-border bg-surface">
                    <div className="border-b border-border px-5 py-4">
                        <div className="h-4 w-32 rounded-md bg-surface-muted" />
                    </div>
                    <div className="divide-y divide-border">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4">
                                <div className="h-9 w-9 shrink-0 rounded-md bg-surface-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3.5 w-1/3 rounded-md bg-surface-muted" />
                                    <div className="h-3 w-1/4 rounded-md bg-surface-muted" />
                                </div>
                                <div className="h-3 w-16 shrink-0 rounded-md bg-surface-muted" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
