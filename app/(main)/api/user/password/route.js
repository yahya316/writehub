// app/api/user/password/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { currentPassword, newPassword } = await req.json();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}