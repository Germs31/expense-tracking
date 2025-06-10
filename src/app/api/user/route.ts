import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/user'; // Assuming the model is in this path
import dbConnect from '@/db/mongodb';

export async function Get() {
  try {
    await dbConnect();
    const getUser = User.find()

    return NextResponse.json(
      { message: 'User grabbed successfully', expenses: getUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    );

  }
}

export async function PUT (request: NextRequest) {
  try {
    await dbConnect();

    const { id, ...updateData } = await request.json();
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'User updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    )
  }
}