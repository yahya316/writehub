// app/api/user/favorites/[storyId]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function PUT(req, { params }) {
  const { storyId } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { action } = await req.json();
    const userId = session.user.id;
    let updatedUser;

    if (action === 'add') {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: storyId } },
        { new: true }
      );
    } else if (action === 'remove') {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: storyId } },
        { new: true }
      );
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Favorites updated' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update favorites' }, { status: 500 });
  }
}