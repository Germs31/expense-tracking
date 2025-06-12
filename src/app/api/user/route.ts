import { NextResponse, NextRequest } from 'next/server';
import User, {IUser} from '@/models/user'; // Assuming the model is in this path
import dbConnect from '@/db/mongodb';

export async function GET() {
  try {
    await dbConnect();
    const user = await User.findOne();
    
    if (!user) {
      const defaultUser: IUser = new User({
      firstName: "Default",
      lastName: "User",
      phoneNumber: "3237334466", 
      address: "123 fake st",
      expenses: [],
      monthlyIncome: "4000",
      lastUpdated: new Date(),
      createdAt: new Date(),
      });
      await defaultUser.save();
      return NextResponse.json(
      { message: 'Default user created successfully', user: defaultUser },
      { status: 201 }
      );
    }

    const getUser = await User.findOne()

    return NextResponse.json(
      { message: 'User grabbed successfully', user: getUser },
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
    const updatedData = await request.json();
    console.log(updatedData, '<--0----')

    const updatedUser = await User.findByIdAndUpdate(updatedData._id, updatedData, { new: true });

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