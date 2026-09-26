"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/app/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Real error (e.g. "MongoServerSelectionError") goes to the server/console log.
    // The person only ever sees the generic message below.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-chocolate-muted" strokeWidth={1.5} />
      <h1 className="mt-5 font-serif text-2xl text-chocolate">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-chocolate-soft">
        We&apos;re having trouble loading this page right now. Please try again in a moment.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={reset} className={buttonVariants({ size: "md" })}>
          Try again
        </button>
        <Link href="/" className={buttonVariants({ variant: "secondary", size: "md" })}>
          Go home
        </Link>
      </div>
    </div>
  );
}