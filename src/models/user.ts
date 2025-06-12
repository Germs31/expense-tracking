import { Schema, model, models, Document, Types } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    createdAt: Date;
    lastUpdated: Date;
    monthlyIncome: string;
    expenses: Types.ObjectId[] | string[]; // Reference to expenses
}

const userSchema: Schema<IUser> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    monthlyIncome: { type: String, required: true },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense', required: true}] // Array of references to Expense documents
});

// Use existing model if it exists, otherwise create a new one
const User = models.User || model<IUser>('User', userSchema);

export default User;