import { NextRequest, NextResponse } from 'next/server';
import Expense from '@/models/expense';
import dbConnect from '@/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log(req.url)
    // Parse the URL to get the id parameter
    const url = new URL(req.url);

    const pathname = url.pathname;
    const pathSegments = pathname.split('/');
    const pathId = pathSegments[pathSegments.length - 1];

    if (!pathId) {
      return NextResponse.json(
        { error: 'Missing expense ID' },
        { status: 400 }
      );
    }
    
    // Find the expense by ID
    const expense = await Expense.findById(pathId);
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Expense retrieved successfully', expense },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving expense:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    // Extract ID from URL path
    const url = new URL(req.url);
    const pathname = url.pathname;
    const pathSegments = pathname.split('/');
    const pathId = pathSegments[pathSegments.length - 1];
    
    if (!pathId) {
      return NextResponse.json(
        { error: 'Missing expense ID' },
        { status: 400 }
      );
    }
    
    // Parse the request body
    const body = await req.json();

    console.log(body, '<-----')
    const { title, amount, category, dueDate, notes } = body;
    
    // Validate required fields
    if (!title || !amount || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, amount, or category.' },
        { status: 400 }
      );
    }
    
    // Find and update the expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      pathId,
      {
        title,
        amount,
        category,
        dueDate,
        notes,
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Expense updated successfully', expense: updatedExpense },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );
  }
}