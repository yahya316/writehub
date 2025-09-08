// app/user/dashboard/comments/page.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import MyCommentsList from '@/components/MyCommentsList'; 
import Link from 'next/link';

export default async function MyCommentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  await dbConnect();

  const comments = await Comment.find({ author: session.user.id })
    .populate('story', 'title slug')
    .sort({ createdAt: -1 })
    .lean();

  const safeComments = comments.map(comment => ({
    _id: comment._id.toString(),
    content: comment.content,
    body: comment.content, 
    createdAt: comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : (comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString()),
    story: comment.story ? {
      _id: comment.story._id.toString(),
      title: comment.story.title,
      slug: comment.story.slug
    } : null
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4 group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md">
              <span className="text-white text-2xl">💬</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Comments</h1>
              <p className="text-gray-600 mt-1">
                {safeComments.length} {safeComments.length === 1 ? 'comment' : 'comments'} posted
              </p>
            </div>
          </div>
        </div>
        
        <MyCommentsList initialComments={JSON.stringify(safeComments)} />
      </div>
    </div>
  );
}