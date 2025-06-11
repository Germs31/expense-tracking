
import { NextResponse } from 'next/server';
import User from '@/models/user';
import Expense from '@/models/expense';
import dbConnect from '@/db/mongodb';

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Create a test user
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '123-456-7890',
      address: '123 Test Street',
    });
    
    // 2. Create a few expenses for this user
    const expense1 = await Expense.create({
      title: 'Groceries',
      amount: 85.75,
      category: 'food',
      user: testUser._id
    });
    
    const expense2 = await Expense.create({
      title: 'Gas',
      amount: 45.50,
      category: 'transportation',
      user: testUser._id
    });
    
    // 3. Add the expense references to the user
    testUser.expenses.push(expense1._id, expense2._id);
    await testUser.save();
    
    // 4. Test the relationship in both directions
    
    // a. Get user with populated expenses
    const userWithExpenses = await User.findById(testUser._id).populate('expenses');
    
    // b. Get expenses with populated user
    const expensesWithUser = await Expense.find({ user: testUser._id }).populate('user');
    
    return NextResponse.json({
      success: true,
      user: userWithExpenses,
      expenses: expensesWithUser,
      message: 'Relationship test completed successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}