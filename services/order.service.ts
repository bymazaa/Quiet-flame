import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { Order, type OrderDB } from '@/models/Order';
import { generateOrderNumber } from '@/lib/order-number';
import { getManyByIds } from '@/services/product.service';
import { getSettings } from '@/services/settings.service';
import { cartItemsSchema, type CartItemInput } from '@/lib/validation/cart.schema';
import {
    placeOrderSchema,
    updateOrderStatusSchema,
    orderListQuerySchema,
    orderNumberSchema,
} from '@/lib/validation/order.schema';
import { objectIdSchema } from '@/lib/validation/common.schema';
import { escapeRegex, fromCents, getPagination, getTotalPages, toCents } from '@/lib/utils';
import { ok, fail, validationFail, handleError, type ActionResult } from '@/lib/action-result';
import { DEFAULT_CURRENCY, type OrderStatus } from '@/lib/constants';

const ADMIN_PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/* DTOs                                                                */
/* ------------------------------------------------------------------ */

export interface OrderDTO {
    id: string;
    orderNumber: string;
    customer: { name: string; email: string; phone: string };
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    items: {
        productId: string;
        productName: string;
        productImage: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    totalAmount: number;
    currency: string;
    orderStatus: OrderStatus;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

type LeanOrder = OrderDB & { _id: Types.ObjectId };

interface customerInfo {
    name: string;
    email: string;
    phone: string;
}

interface shippingAddressInfo {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

function toOrderDTO(doc: LeanOrder): OrderDTO {
    return {
        id: doc._id.toString(),
        orderNumber: doc.orderNumber,
        customer: doc.customer as customerInfo,
        shippingAddress: doc.shippingAddress as shippingAddressInfo,
        items: doc.items.map((item) => ({
            productId: item.productId.toString(),
            productName: item.productName,
            productImage: item.productImage ?? '',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
        })),
        subtotal: doc.subtotal,
        discountAmount: doc.discountAmount ?? 0,
        shippingCost: doc.shippingCost ?? 0,
        totalAmount: doc.totalAmount,
        currency: doc.currency,
        orderStatus: doc.orderStatus as OrderStatus,
        paymentStatus: doc.paymentStatus,
        paymentMethod: doc.paymentMethod,
        transactionId: doc.transactionId ?? null,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
    };
}

/* ------------------------------------------------------------------ */
/* Cart validation (customer-facing, /cart page)                       */
/* ------------------------------------------------------------------ */

export interface CartValidationItemDTO {
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    compareAtPrice: number | null;
    quantity: number;
    lineTotal: number;
    isActive: boolean;
}

export interface CartValidationDTO {
    items: CartValidationItemDTO[];
    subtotal: number;
    removedProductIds: string[]; // no longer exist (deleted) - client should drop these from cart
}

/**
 * Re-checks the client's cart against the database: current price, current
 * discount, and whether each product still exists / is still active.
 * Used before showing the /cart page so stale localStorage data never
 * shows a wrong price. Does NOT create an order.
 */
export async function validateCart(items: unknown): Promise<ActionResult<CartValidationDTO>> {
    const parsed = cartItemsSchema.safeParse(items);
    if (!parsed.success) return validationFail(parsed.error);

    try {
        const products = await getManyByIds(parsed.data.map((item) => item.productId));
        const productMap = new Map(products.map((product) => [product._id.toString(), product]));

        const validatedItems: CartValidationItemDTO[] = [];
        const removedProductIds: string[] = [];
        let subtotalCents = 0;

        for (const item of parsed.data) {
            const product = productMap.get(item.productId);

            if (!product) {
                removedProductIds.push(item.productId);
                continue;
            }

            const lineTotalCents = toCents(product.price) * item.quantity;
            if (product.isActive) subtotalCents += lineTotalCents;

            validatedItems.push({
                productId: item.productId,
                name: product.name,
                slug: product.slug,
                image: product.images?.[0] ?? '',
                price: product.price,
                compareAtPrice: product.compareAtPrice ?? null,
                quantity: item.quantity,
                lineTotal: fromCents(lineTotalCents),
                isActive: product.isActive,
            });
        }

        return ok(undefined, {
            items: validatedItems,
            subtotal: fromCents(subtotalCents),
            removedProductIds,
        });
    } catch (error) {
        return handleError(error);
    }
}

/* ------------------------------------------------------------------ */
/* Order totals (internal) - the ONLY place prices are calculated       */
/* ------------------------------------------------------------------ */

interface OrderItemCalculated {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

type TotalsResult =
    | {
          success: true;
          items: OrderItemCalculated[];
          subtotalCents: number;
          discountCents: number;
      }
    | { success: false; error: string };

/**
 * Recalculates order totals purely from the database. Client-supplied
 * prices are never used. Rejects the whole order if any product no longer
 * exists or has been deactivated.
 */
async function calculateOrderTotals(cartItems: CartItemInput[]): Promise<TotalsResult> {
    const products = await getManyByIds(cartItems.map((item) => item.productId));
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const unavailable: string[] = [];
    const items: OrderItemCalculated[] = [];
    let subtotalCents = 0;
    let discountCents = 0;

    for (const item of cartItems) {
        const product = productMap.get(item.productId);

        if (!product) {
            unavailable.push('An item in your cart');
            continue;
        }
        if (!product.isActive) {
            unavailable.push(product.name);
            continue;
        }

        const unitPriceCents = toCents(product.price);
        const lineTotalCents = unitPriceCents * item.quantity;
        subtotalCents += lineTotalCents;

        if (product.compareAtPrice && product.compareAtPrice > product.price) {
            discountCents += (toCents(product.compareAtPrice) - unitPriceCents) * item.quantity;
        }

        items.push({
            productId: item.productId,
            productName: product.name,
            productImage: product.images?.[0] ?? '',
            quantity: item.quantity,
            unitPrice: fromCents(unitPriceCents),
            totalPrice: fromCents(lineTotalCents),
        });
    }

    if (unavailable.length > 0) {
        return {
            success: false,
            error: `${unavailable.join(', ')} ${unavailable.length > 1 ? 'are' : 'is'} no longer available. Please update your cart.`,
        };
    }

    return { success: true, items, subtotalCents, discountCents };
}

/* ------------------------------------------------------------------ */
/* Place order (customer-facing, checkout)                             */
/* ------------------------------------------------------------------ */

/**
 * Creates an order. Contains no client-supplied prices: every amount is
 * recalculated here from the database. Returns just the order number so the
 * caller can redirect to /order-confirmation/[orderNumber].
 */
export async function placeOrder(data: unknown): Promise<ActionResult<{ orderNumber: string }>> {
    const parsed = placeOrderSchema.safeParse(data);
    if (!parsed.success) return validationFail(parsed.error);

    try {
        const totals = await calculateOrderTotals(parsed.data.items);
        if (!totals.success) return fail(totals.error);

        const settings = await getSettings();
        const shippingCostCents = toCents(settings.shippingCost);
        const totalCents = totals.subtotalCents + shippingCostCents;

        await connectDB();
        const orderNumber = await generateOrderNumber();

        await Order.create({
            orderNumber,
            customer: parsed.data.customer,
            shippingAddress: parsed.data.shippingAddress,
            items: totals.items,
            subtotal: fromCents(totals.subtotalCents),
            discountAmount: fromCents(totals.discountCents),
            shippingCost: fromCents(shippingCostCents),
            totalAmount: fromCents(totalCents),
            currency: DEFAULT_CURRENCY,
            orderStatus: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'unpaid',
            transactionId: null,
        });

        return ok('Order placed successfully.', { orderNumber });
    } catch (error) {
        return handleError(error);
    }
}

/* ------------------------------------------------------------------ */
/* Public read                                                          */
/* ------------------------------------------------------------------ */

/** /order-confirmation/[orderNumber] */
export async function getOrderByNumber(orderNumber: string): Promise<OrderDTO | null> {
    const parsed = orderNumberSchema.safeParse(orderNumber);
    if (!parsed.success) return null;

    await connectDB();
    const order = await Order.findOne({ orderNumber: parsed.data }).lean<LeanOrder | null>();
    return order ? toOrderDTO(order) : null;
}

/* ------------------------------------------------------------------ */
/* Admin reads                                                         */
/* ------------------------------------------------------------------ */

export interface PaginatedOrders {
    orders: OrderDTO[];
    total: number;
    page: number;
    totalPages: number;
}

/** /admin/orders table: search + filter + pagination. */
export async function getAdminOrders(query: unknown): Promise<ActionResult<PaginatedOrders>> {
    const parsed = orderListQuerySchema.safeParse(query);
    if (!parsed.success) return validationFail(parsed.error);

    try {
        await connectDB();

        const { page, search, orderStatus, paymentStatus } = parsed.data;
        const filter: Record<string, unknown> = {};

        if (orderStatus) filter.orderStatus = orderStatus;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        if (search) {
            const regex = { $regex: escapeRegex(search), $options: 'i' };
            filter.$or = [
                { orderNumber: regex },
                { 'customer.name': regex },
                { 'customer.phone': regex },
            ];
        }

        const { skip, limit } = getPagination(page, ADMIN_PAGE_SIZE);

        const [orders, total] = await Promise.all([
            Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<LeanOrder[]>(),
            Order.countDocuments(filter),
        ]);

        return ok(undefined, {
            orders: orders.map(toOrderDTO),
            total,
            page,
            totalPages: getTotalPages(total, ADMIN_PAGE_SIZE),
        });
    } catch (error) {
        return handleError(error);
    }
}

/** /admin/orders/[id] */
export async function getOrderById(id: string): Promise<OrderDTO | null> {
    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success) return null;

    await connectDB();
    const order = await Order.findById(parsedId.data).lean<LeanOrder | null>();
    return order ? toOrderDTO(order) : null;
}

/* ------------------------------------------------------------------ */
/* Admin write                                                         */
/* ------------------------------------------------------------------ */

/** Admin changes an order's status (pending -> confirmed -> delivered, or cancelled). */
export async function updateOrderStatus(
    orderId: string,
    orderStatus: string,
): Promise<ActionResult> {
    const parsed = updateOrderStatusSchema.safeParse({ orderId, orderStatus });
    if (!parsed.success) return validationFail(parsed.error);

    try {
        await connectDB();

        const result = await Order.updateOne(
            { _id: parsed.data.orderId },
            { $set: { orderStatus: parsed.data.orderStatus } },
        );

        if (result.matchedCount === 0) return fail('Order not found.');

        return ok('Order status updated successfully.');
    } catch (error) {
        return handleError(error);
    }
}
