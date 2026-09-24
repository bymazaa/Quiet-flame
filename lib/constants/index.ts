// Single source of truth: used by Mongoose models AND Zod schemas.

export const ORDER_STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_METHODS = ['unpaid', 'paypal'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DEFAULT_CURRENCY = 'USD';

export const ORDER_NUMBER_PREFIX = 'QF';
export const ORDER_NUMBER_START = 10000;
