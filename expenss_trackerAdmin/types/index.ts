export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface Expense {
  _id?: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
  person: string;
  image?: string;
  document?: string;
  createdAt: Date;
}

export interface Income {
  _id?: string;
  userId: string;
  amount: number;
  source: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Category {
  _id?: string;
  userId: string;
  name: string;
  icon?: string;
}

export interface PaymentMethod {
  _id?: string;
  userId: string;
  name: string;
}

export interface Person {
  _id?: string;
  userId: string;
  name: string;
}
