import { Schema, model, models, Model, InferSchemaType } from 'mongoose';

// Atomic counter used to generate unique order numbers (CND-10001, CND-10002 ...)
//
// Usage (in order.service.ts):
//   const counter = await Counter.findOneAndUpdate(
//     { key: "order" },
//     { $inc: { seq: 1 }, $setOnInsert: { key: "order" } },
//     { new: true, upsert: true }
//   );
//   const orderNumber = `${ORDER_NUMBER_PREFIX}-${ORDER_NUMBER_START + counter.seq}`;

const counterSchema = new Schema({
    key: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});

export type CounterDB = InferSchemaType<typeof counterSchema>;

export const Counter =
    (models.Counter as Model<CounterDB>) || model<CounterDB>('Counter', counterSchema);
