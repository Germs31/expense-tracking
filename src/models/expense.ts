import mongoose, { Types } from 'mongoose';

export interface Expense {
  title: string;
  amount: number;
  minimumPayment?: number; // Added minimumPayment as optional
  category: string;
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  user: Types.ObjectId | string; // Reference to the user who owns this expense
}

const schema = new mongoose.Schema<Expense>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    minimumPayment: { type: Number, required: false }, // Added to schema
    category: { type: String, required: true },
    dueDate: { type: Date, required: false },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User document
  }
);

export default (mongoose.models.Expense as mongoose.Model<Expense>) || mongoose.model<Expense>('Expense', schema);