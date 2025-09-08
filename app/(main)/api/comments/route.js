import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import User from '@/models/User';

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get('storyId');

    let query = {};
    if (storyId) {
      query.story = storyId;
    }

    const comments = await Comment.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { body, storyId } = await req.json();
    const authorId = session.user.id;
    const user = await User.findById(authorId);

    if (!user) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    const newComment = await Comment.create({
      body,
      author: authorId,
      story: storyId,
    });

    const populatedComment = await Comment.findById(newComment._id).populate('author', 'name');

    return NextResponse.json({ comment: populatedComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
