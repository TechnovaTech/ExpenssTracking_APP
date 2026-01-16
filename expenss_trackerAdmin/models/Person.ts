import mongoose, { Schema, Model } from 'mongoose';

export interface IPerson {
  name: string;
  email?: string;
  phone?: string;
}

const personSchema = new Schema<IPerson>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String }
}, { timestamps: true });

export const getPersonModel = (connection: mongoose.Connection): Model<IPerson> => {
  return connection.models.Person || connection.model<IPerson>('Person', personSchema);
};
