import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';

export async function GET(req) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session && session.user.role === 'admin';

    // Get search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category');
    const sortBy = searchParams.get('sort');
    const allContent = searchParams.get('allContent') === 'true';

    // Build the query and sort options dynamically
    let query = {};
    // Only apply public visibility, isDraft, and publish date filters if not an admin
    // requesting all content for the dashboard.
    if (!isAdmin && !allContent) {
      query = {
        visibility: 'public',
        isDraft: false,
        publishDate: { $lte: new Date() },
      };
    }

    if (categoryId) {
      query.category = categoryId;
    }

    let sortOption = {};
    if (sortBy === 'title-asc') {
      sortOption.title = 1;
    } else if (sortBy === 'title-desc') {
      sortOption.title = -1;
    } else {
      // Default to sorting by latest
      sortOption.createdAt = -1;
    }

    const latestStories = await Content.find(query)
      .populate('author', 'name')
      .populate('category', 'name')
      .select('title slug body category author likes createdAt updatedAt isDraft featured') // Added featured
      .sort(sortOption)
      .lean();

    const storiesWithLikeCount = latestStories.map(story => ({
      ...story,
      likeCount: (story.likes || []).length, 
    }));

    return NextResponse.json({ stories: storiesWithLikeCount }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}