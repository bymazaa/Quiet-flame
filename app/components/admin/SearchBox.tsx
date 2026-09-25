import { Search } from 'lucide-react';

export function SearchBox({
    basePath,
    placeholder,
    defaultValue,
}: {
    basePath: string;
    placeholder: string;
    defaultValue?: string;
}) {
    return (
        <form action={basePath} className="relative w-full sm:max-w-xs">
            <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chocolate-muted"
                strokeWidth={1.75}
            />
            <input
                type="search"
                name="search"
                placeholder={placeholder}
                defaultValue={defaultValue}
                className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-chocolate placeholder:text-chocolate-muted/70 focus-visible:border-primary focus-visible:outline-none"
            />
            {/* Reset to page 1 whenever a new search is submitted */}
            <input type="hidden" name="page" value="1" />
        </form>
    );
}
