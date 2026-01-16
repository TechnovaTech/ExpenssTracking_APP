import mongoose, { Schema, Model } from 'mongoose';

export interface IExpense {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: mongoose.Types.ObjectId;
  paymentMethodId: mongoose.Types.ObjectId;
  personId?: mongoose.Types.ObjectId;
  date: Date;
  description?: string;
}

const expenseSchema = new Schema<IExpense>({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  paymentMethodId: { type: Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  personId: { type: Schema.Types.ObjectId, ref: 'Person' },
  date: { type: Date, default: Date.now },
  description: { type: String }
}, { timestamps: true });

export const getExpenseModel = (connection: mongoose.Connection): Model<IExpense> => {
  return connection.models.Expense || connection.model<IExpense>('Expense', expenseSchema);
};
