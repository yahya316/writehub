// app/api/likes/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const { storyId } = await req.json();
        const userId = session.user.id;

        console.log('API: Received request for storyId:', storyId, 'from userId:', userId);

        const story = await Content.findById(storyId);
        if (!story) {
            console.error('API: Story not found:', storyId);
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        const hasLiked = (story.likes || []).includes(userId);

        if (hasLiked) {
            console.log('API: User has already liked. Removing like.');
            story.likes = story.likes.filter(id => id.toString() !== userId);
        } else {
            if (!story.likes) {
                story.likes = [];
            }
            story.likes.push(userId);
        }

        await story.save(); 

        const likeCount = story.likes.length;

        return NextResponse.json({ 
            message: hasLiked ? 'Story unliked' : 'Story liked', 
            isLiked: !hasLiked,
            likeCount 
        }, { status: 200 });
    } catch (error) {
        console.error("API: Failed to update like status:", error);
        return NextResponse.json({ error: 'Failed to update like status' }, { status: 500 });
    }
}