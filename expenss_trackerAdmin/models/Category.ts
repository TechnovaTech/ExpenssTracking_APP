import mongoose, { Schema, Model } from 'mongoose';

export interface ICategory {
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  icon: { type: String },
  color: { type: String }
}, { timestamps: true });

export const getCategoryModel = (connection: mongoose.Connection): Model<ICategory> => {
  return connection.models.Category || connection.model<ICategory>('Category', categorySchema);
};
