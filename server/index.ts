import { connectDB } from '@/lib/mongodb';
import { generateOrderNumber } from '@/lib/order-number';
import { Order, OrderDB } from '@/models/Order';

export const CreateOrder = async (data: OrderDB) => {
    try {
        await connectDB();

        const genorderId = await generateOrderNumber();

        const response = await Order.create({
            orderNumber: genorderId,

            currency: 'USD',

            shippingAddress: {
                address: data.shippingAddress?.address,
                city: data.shippingAddress?.city,
                state: data.shippingAddress?.state,
                postalCode: data.shippingAddress?.postalCode,
                country: data.shippingAddress?.country,
            },

            customer: {
                name: data.customer?.name,
                email: data.customer?.email,
                phone: data.customer?.phone,
            },

            items: data.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
            })),

            subtotal: data.subtotal,
            discountAmount: data.discountAmount,
            shippingCost: data.shippingCost,
            totalAmount: data.totalAmount,

            orderStatus: data.orderStatus,
            paymentStatus: data.paymentStatus,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
        });

        if (!response) {
            throw new Error('Order creation failed');
        }

        return response;
    } catch (error) {
        console.error('CreateOrder error:', error);
        throw new Error('Something went wrong while creating order');
    }
};
