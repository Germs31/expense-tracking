import { NextRequest, NextResponse } from 'next/server';
import Expense from '@/models/expense'; 
import User from '@/models/user';
import dbConnect from '@/db/mongodb';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { title, amount, category, dueDate, notes } = body;

    if (!title || !amount || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, amount, or category.' },
        { status: 400 }
      );
    }

    // Create and save the expense using the existing model
    const newExpense = await Expense.create({
      title,
      amount,
      category,
      dueDate,
      notes,
      user: singleUser._id
    });

    // Update the user by adding the expense reference
    await User.findByIdAndUpdate(
      singleUser._id,
      { $push: { expenses: newExpense._id } },
      { new: true }
    );

    // Respond with the newly created expense
    return NextResponse.json(
      { message: 'Expense added successfully', expense: newExpense },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );
  }
}