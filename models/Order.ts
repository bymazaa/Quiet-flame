import { Schema, model, models, Model, InferSchemaType } from 'mongoose';
import {
    DEFAULT_CURRENCY,
    ORDER_STATUSES,
    PAYMENT_METHODS,
    PAYMENT_STATUSES,
} from '@/lib/constants';

// Snapshot of the product at the time of purchase.
// Editing a product later must NOT change old orders.
const orderItemSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        productImage: { type: String, default: '' },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 }, // price after product discount
        totalPrice: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

const orderSchema = new Schema(
    {
        orderNumber: { type: String, required: true, unique: true }, // e.g. CND-10024

        customer: {
            name: { type: String, required: true, trim: true },
            email: { type: String, required: true, lowercase: true, trim: true },
            phone: { type: String, required: true, trim: true },
        },

        shippingAddress: {
            address: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            postalCode: { type: String, required: true, trim: true },
            country: { type: String, default: 'United States' },
        },

        items: {
            type: [orderItemSchema],
            validate: {
                validator: (items: unknown[]) => items.length > 0,
                message: 'Order must contain at least one item',
            },
        },

        subtotal: { type: Number, required: true, min: 0 },
        discountAmount: { type: Number, default: 0, min: 0 }, // total product discount (for reports)
        shippingCost: { type: Number, default: 0, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 }, // subtotal + shippingCost
        currency: { type: String, default: DEFAULT_CURRENCY, uppercase: true },

        orderStatus: { type: String, enum: ORDER_STATUSES, default: 'pending' },

        // PayPal-ready (filled later by server-side verification)
        paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'pending' },
        paymentMethod: { type: String, enum: PAYMENT_METHODS, default: 'unpaid' },
        transactionId: { type: String, default: null }, // PayPal transaction ID (filled later by server-side verification)
    },
    { timestamps: true },
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ 'customer.name': 1 });

export type OrderDB = InferSchemaType<typeof orderSchema>;

export const Order = (models.Order as Model<OrderDB>) || model<OrderDB>('Order', orderSchema);
