// app/api/stories/category/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const stories = await Content.find({
      category: id,
      visibility: 'public',
      publishDate: { $lte: new Date() },
      isDraft: false, 
    })
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .populate('author', 'name');

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}