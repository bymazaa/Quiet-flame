
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  RefreshCw,
  Search,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

import { buttonVariants } from "@/app/components/ui/Button";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/constants";
import type { OrderSort } from "@/lib/validation/order.schema";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const SORT_LABEL: Record<OrderSort, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  amount_desc: "Amount: high to low",
  amount_asc: "Amount: low to high",
};

const fieldClasses =
  "h-9 rounded-md border border-border bg-transparent px-2.5 text-xs text-chocolate outline-none transition-colors focus:border-primary";

export function OrdersToolbar({
  basePath,
}: {
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [sort, setSort] = useState<OrderSort>("newest");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Read filter values from URL
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setOrderStatus(searchParams.get("orderStatus") ?? "");
    setPaymentStatus(searchParams.get("paymentStatus") ?? "");
    setSort((searchParams.get("sort") as OrderSort) || "newest");
    setFromDate(searchParams.get("fromDate") ?? "");
    setToDate(searchParams.get("toDate") ?? "");
  }, [searchParams]);

  const handleFromDateChange = (value: string) => {
    setFromDate(value);

    if (toDate && value > toDate) {
      setToDate("");
    }
  };

  const handleReset = () => {
    router.push(basePath);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <form
      action={basePath}
      className="flex flex-wrap items-end gap-2"
    >
      {/* Search */}
      <div className="relative min-w-[220px] flex-1 sm:max-w-[280px]">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-chocolate-muted"
          strokeWidth={1.75}
        />

        <input
          type="search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className={`${fieldClasses} w-full pl-8 pr-2.5 placeholder:text-chocolate-muted/60`}
        />
      </div>

      {/* Order status */}
      <select
        name="orderStatus"
        value={orderStatus}
        onChange={(e) => setOrderStatus(e.target.value)}
        className={`${fieldClasses} min-w-[120px] cursor-pointer`}
      >
        <option value="">All status</option>

        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABEL[status]}
          </option>
        ))}
      </select>

      {/* Payment status */}
      <select
        name="paymentStatus"
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
        className={`${fieldClasses} min-w-[125px] cursor-pointer`}
      >
        <option value="">All payments</option>

        {PAYMENT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {PAYMENT_LABEL[status]}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        name="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value as OrderSort)}
        className={`${fieldClasses} min-w-[125px] cursor-pointer`}
      >
        {Object.entries(SORT_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* From date */}
      <input
        type="date"
        name="fromDate"
        value={fromDate}
        onChange={(e) => handleFromDateChange(e.target.value)}
        className={fieldClasses}
        aria-label="From date"
      />

      {/* To date */}
      <input
        type="date"
        name="toDate"
        value={toDate}
        min={fromDate || undefined}
        onChange={(e) => setToDate(e.target.value)}
        className={fieldClasses}
        aria-label="To date"
      />

      {/* Reset pagination */}
      <input type="hidden" name="page" value="1" />

      {/* Apply */}
      <button
        type="submit"
        className={`${buttonVariants({
          variant: "primary",
          size: "sm",
        })} cursor-pointer`}
      >
        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
        Apply
      </button>

      {/* Reset */}
      <button
        type="button"
        onClick={handleReset}
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
        })}
        title="Reset filters"
      >
        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
        Reset
      </button>

      {/* Refresh */}
      <button
        type="button"
        onClick={handleRefresh}
         className={`${buttonVariants({
          variant: "secondary",
          size: "sm",
        })} cursor-pointer`}
        title="Refresh orders"
        aria-label="Refresh orders"
      >
        Refresh <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

