import { NextResponse } from 'next/server';
import Expense from '@/models/expense';
import User from '@/models/user';
import dbConnect from '@/db/mongodb';

export async function GET() {
  try {
    await dbConnect();
    
    // Find the first/only user in the system
    const singleUser = await User.findOne();
    
    if (!singleUser) {
      return NextResponse.json(
        { error: 'No user found in the system' },
        { status: 404 }
      );
    }
    
    // Find all expenses belonging to this user
    const userExpenses = await Expense.find({ user: singleUser._id });
    
    return NextResponse.json(
      { message: 'Expenses grabbed successfully', expenses: userExpenses },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );
  }
}