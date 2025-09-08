// app/api/comments/[commentId]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { commentId } = params;
    const { body } = await req.json();
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    comment.body = body;
    await comment.save();

    return NextResponse.json({ message: 'Comment updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { commentId } = params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if the current user is the author or an admin
    if (comment.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await comment.deleteOne();

    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}