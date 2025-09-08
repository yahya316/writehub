import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Content from '@/models/Content';
import Link from 'next/link';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  await dbConnect();
  
  const user = await User.findById(session.user.id).populate({
    path: 'favorites',
    select: 'title slug excerpt updatedAt',
  }).lean();

  if (!user) {
    redirect('/auth/login');
  }

  const favorites = user.favorites || [];

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
              <span className="text-white text-2xl">❤</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorite Stories</h1>
              <p className="text-gray-600 mt-1">
                {favorites.length} {favorites.length === 1 } favorites
              </p>
            </div>
          </div>
        </div>
        
        {/* Favorites list */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
          {favorites.length > 0 ? (
            favorites.map((story) => (
              <div key={story._id} className="p-6 hover:bg-gray-50 transition-colors duration-200 group">
                <Link href={`/story/${story.slug}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                        {story.title}
                      </h2>
                      {story.excerpt && (
                        <p className="text-gray-600 mt-2 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {story.excerpt}
                        </p>
                      )}
                      {story.updatedAt && (
                        <p className="text-sm text-gray-500 mt-3">
                          Updated {new Date(story.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="transition-transform duration-200 group-hover:scale-110">🔖</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            // Empty state
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl text-gray-400">❤</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Stories you mark as favorites will appear here for easy access later.
              </p>
              <Link
                href="/stories"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Browse Stories
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}