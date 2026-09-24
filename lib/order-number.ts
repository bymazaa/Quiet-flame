import { connectDB } from '@/lib/mongodb';
import { Counter } from '@/models/Counter';
import { ORDER_NUMBER_PREFIX, ORDER_NUMBER_START } from '@/lib/constants';

/**
 * Generates a unique, sequential order number, e.g. "CND-10001".
 * No parameters needed:
 *
 *   const orderNumber = await generateOrderNumber();
 *
 * SERVER ONLY. Never import this into a Client Component.
 */
export async function generateOrderNumber(): Promise<string> {
    await connectDB();

    const counter = await Counter.findOneAndUpdate(
        { key: 'order' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
    );

    if (!counter) {
        throw new Error('Failed to generate order number');
    }

    return `${ORDER_NUMBER_PREFIX}-${ORDER_NUMBER_START + counter.seq}`;
}
