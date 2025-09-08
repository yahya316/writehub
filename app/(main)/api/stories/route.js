// app/api/stories/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();
  try {
    const stories = await Content.find({
      visibility: 'public',
      publishDate: { $lte: new Date() },
      isDraft: false, 
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('category', 'name')
      .populate('author', 'name');

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}
export async function POST(req) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { title, body, category, visibility, publishDate } = await req.json();
    const author = session.user.id; 
    console.log('Author ID for new story:', author); 

    const newStory = await Content.create({
      title,
      body,
      category,
      author,
      visibility,
      publishDate: publishDate || new Date(), 
    });

    return NextResponse.json({ story: newStory }, { status: 201 });
  } catch (error) {
    console.error('Failed to create story:', error);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}
