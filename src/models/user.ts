import  { Schema, model, models } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    createdAt: Date;
    lastUpdated: Date;
}

const userSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Use existing model if it exists, otherwise create a new one
const User = models.User || model('User', userSchema);

export default User;