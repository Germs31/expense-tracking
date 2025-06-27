import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/user';
import connectDB from '@/db/mongodb';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const headersList = await headers();
    const isPublicRegistration = headersList.get('x-registration-type') === 'public';
    
    if (!isPublicRegistration) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    let userData;
    try {
      userData = await request.json();
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: 'Could not parse request body' 
      }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'monthlyIncome'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 });
    }

    const userResponse = await createUser(userData);
    return NextResponse.json(userResponse);

  } catch (error) {
    console.error('Error in PUT /api/user:', error);
    return NextResponse.json({
      error: error.message || 'Failed to create user account',
      details: error.stack
    }, { status: error.status || 500 });
  }
}

async function createUser(userData) {
  await connectDB();
  
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw Object.assign(
      new Error('Email already registered'),
      { status: 409 }
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = await User.create({
    ...userData,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date(),
    lastUpdated: new Date()
  });

  return {
    _id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    address: newUser.address,
    monthlyIncome: newUser.monthlyIncome,
    createdAt: newUser.createdAt
  };
}