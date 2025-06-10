import { NextResponse } from 'next/server';
import Expense from '@/models/expense'; // Assuming the model is in this path
import dbConnect from '@/db/mongodb'; // Fixed the incomplete import

export async function GET () {
  try {
    await dbConnect();

    const allExpenses = await Expense.find();

    return NextResponse.json(
      { message: 'Expense grabbed successfully', expenses: allExpenses },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );
  }
}