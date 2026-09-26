"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { buttonVariants } from "@/app/components/ui/Button";

export default function PublicError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <Flame className="h-10 w-10 text-chocolate-muted" strokeWidth={1.5} />
      <h1 className="mt-5 font-serif text-2xl text-chocolate">We&apos;re having a moment</h1>
      <p className="mt-2 max-w-sm text-sm text-chocolate-soft">
        Something didn&apos;t load correctly. Please try again, or come back in a little while.
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