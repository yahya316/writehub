// app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  
  try {
    const users = await User.find({}, 'name email role').sort({ name: 1 });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { id } = params;
    const { role } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Failed to update user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { id } = params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}