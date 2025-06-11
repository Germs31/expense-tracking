import { Schema, model, models, Document, Types } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    createdAt: Date;
    lastUpdated: Date;
    expenses: Types.ObjectId[] | string[]; // Reference to expenses
}

const userSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expenses: [{ type: Schema.Types.ObjectId, ref: 'Expense' }] // Array of references to Expense documents
});

// Use existing model if it exists, otherwise create a new one
const User = models.User || model('User', userSchema);

export default User;