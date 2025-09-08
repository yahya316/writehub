// app/api/stories/all/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';

export async function GET() {
  await dbConnect();

  try {
    const stories = await Content.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}