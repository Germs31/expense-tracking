import mongoose, { Types } from 'mongoose';

export interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string; 
  password: string;
  createdAt: Date;
  lastUpdated: Date;
  monthlyIncome: number;
  expenses: Types.ObjectId[] | string[]; 
}

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  password: { type: String, required: true },
  phoneNumber: String,
  address: String,
  monthlyIncome: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

// Remove any explicit index() calls since we're using unique: true
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;