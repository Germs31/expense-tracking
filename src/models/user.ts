import mongoose, { Types } from 'mongoose';

export interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  createdAt: Date;
  lastUpdated: Date;
  monthlyIncome: string;
  expenses: Types.ObjectId[] | string[]; // Reference to expenses
}

const schema = new mongoose.Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    monthlyIncome: { type: String, required: true },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true }] // Array of references to Expense documents
  }
);

export default (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', schema);