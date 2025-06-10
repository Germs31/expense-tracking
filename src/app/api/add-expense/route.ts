import { NextRequest, NextResponse } from 'next/server';
import Expense from '@/models/expense'; // Assuming the model is in this path
import dbConnect from '@/db/mongodb'; // Fixed the incomplete import

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
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
    });

    // Respond with the newly created expense
    return NextResponse.json(
      { message: 'Expense added successfully', expense: newExpense },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );
  }
}