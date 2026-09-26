"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash } from "lucide-react";
import { buttonVariants } from "@/app/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
      <ServerCrash className="h-10 w-10 text-chocolate-muted" strokeWidth={1.5} />
      <h1 className="mt-5 font-serif text-xl text-chocolate">Couldn&apos;t load this page</h1>
      <p className="mt-2 max-w-sm text-sm text-chocolate-soft">
        This is usually temporary — often a database connection issue. Try again in a moment.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={reset} className={buttonVariants({ size: "md" })}>
          Try again
        </button>
        <Link href="/admin" className={buttonVariants({ variant: "secondary", size: "md" })}>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}