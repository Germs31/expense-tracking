import { NextRequest, NextResponse } from 'next/server';
import Expense from '@/models/expense';
import User from '@/models/user';
import dbConnect from '@/db/mongodb';

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse the URL to get query parameters
    const url = new URL(req.url);
    const expenseId = url.searchParams.get('id');
    
    if (!expenseId) {
      return NextResponse.json(
        { error: 'Missing expense ID' },
        { status: 400 }
      );
    }
    
    // Find the expense to delete
    const expense = await Expense.findById(expenseId);
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }
    
    // Delete the expense
    await Expense.findByIdAndDelete(expenseId);
    
    // Remove the expense reference from the user document
    await User.findByIdAndUpdate(
      expense.user,
      { $pull: { expenses: expenseId } },
      { new: true }
    );
    
    return NextResponse.json(
      { message: 'Expense deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );
  }
}
