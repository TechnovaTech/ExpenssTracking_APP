import mongoose, { Schema, Model } from 'mongoose';

export interface IPaymentMethod {
  name: string;
  type: 'cash' | 'card' | 'upi' | 'bank' | 'wallet';
  icon?: string;
}

const paymentMethodSchema = new Schema<IPaymentMethod>({
  name: { type: String, required: true },
  type: { type: String, enum: ['cash', 'card', 'upi', 'bank', 'wallet'], required: true },
  icon: { type: String }
}, { timestamps: true });

export const getPaymentMethodModel = (connection: mongoose.Connection): Model<IPaymentMethod> => {
  return connection.models.PaymentMethod || connection.model<IPaymentMethod>('PaymentMethod', paymentMethodSchema);
};
