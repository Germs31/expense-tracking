import { Schema, model, models, Document, Types } from 'mongoose';

export interface IExpense extends Document {
    title: string;
    amount: number;
    category: string;
    dueDate: Date;
    notes?: string;
    createdAt: Date;
    user: Types.ObjectId | string; // Reference to the user who owns this expense
}

const expenseSchema: Schema = new Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    dueDate: { type: Date, required: false },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User document
});

// Use existing model if it exists, otherwise create a new one
const Expense = models.Expense || model('Expense', expenseSchema);

export default Expense;