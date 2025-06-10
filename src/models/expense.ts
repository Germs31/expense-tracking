import  { Schema, model, models } from 'mongoose';

export interface IExpense extends Document {
    title: string;
    amount: number;
    category: string;
    dueDate: Date;
    notes?: string;
    createdAt: Date
}

const expenseSchema: Schema = new Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    dueDate: { type: Date, required: false },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Use existing model if it exists, otherwise create a new one
const Expense = models.Expense || model('Expense', expenseSchema);

export default Expense;