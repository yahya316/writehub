// app/api/stories/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';

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
      .populate('author', 'name') 
      .lean(); 

    if (!stories || stories.length === 0) {
      return NextResponse.json({ message: 'No stories found for this category' }, { status: 404 });
    }

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch stories by category from DB:', error);
    return NextResponse.json({ error: 'Failed to fetch stories by category' }, { status: 500 });
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
    const { title, body, category, visibility, publishDate, isDraft } = await req.json();

    const updateData = {
      title,
      body,
      category,
      visibility,
      isDraft,
      updatedAt: new Date(),
    };

    // If publishDate is not provided in the request body, set it to the current date
    if (!publishDate) {
      updateData.publishDate = new Date();
    } else {
      updateData.publishDate = publishDate;
    }

    const updatedStory = await Content.findByIdAndUpdate(
      id,
      updateData, // Pass the new object
      { new: true, runValidators: true } // 'runValidators' ensures schema validations are applied on update
    );

    if (!updatedStory) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ story: updatedStory }, { status: 200 });

  } catch (error) {
    console.error('Failed to update story:', error);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    // Destructure id directly from params (no need to await params in modern Next.js)
    const { id } = params; 
    const deletedStory = await Content.findByIdAndDelete(id);

    if (!deletedStory) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Story deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete story:', error); // Added specific logging
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
