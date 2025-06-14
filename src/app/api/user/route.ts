import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectDB from '@/db/mongodb';

export async function GET() {
  try {
    await connectDB();
    console.log('Database connected successfully');
    
    try {
      const user = await User.findOne();
      console.log('User query result:', user);
      
      if (!user) {
        console.log('No user found, returning 404');
        return NextResponse.json({ message: 'User not found', user: null }, { status: 404 });
      }
      
      console.log('User found, returning data');
      return NextResponse.json({ user });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json({ error: 'Database operation failed', details: dbError.message }, { status: 500 });
    }
  } catch (connectionError) {
    console.error('Database connection error:', connectionError);
    return NextResponse.json({ error: 'Database connection failed', details: connectionError.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userData = await request.json();
    console.log('Received user data:', userData);
    
    // Ensure monthlyIncome is a number
    if (userData.monthlyIncome === undefined) {
      return NextResponse.json(
        { error: 'Monthly income is required' },
        { status: 400 }
      );
    }
    
    // Convert to number if it's not already
    userData.monthlyIncome = typeof userData.monthlyIncome === 'number' 
      ? userData.monthlyIncome 
      : parseFloat(userData.monthlyIncome) || 0;
    
    await connectDB();
    
    // Find user or create if doesn't exist
    let user = await User.findOne();
    
    try {
      if (user) {
        // Update existing user
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.phoneNumber = userData.phoneNumber;
        user.address = userData.address;
        user.monthlyIncome = userData.monthlyIncome;
        user.lastUpdated = new Date();
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          ...userData,
          createdAt: new Date(),
          lastUpdated: new Date()
        });
      }
      
      return NextResponse.json(user);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: validationError.message || 'Unknown validation error' 
        }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Error updating user', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}