
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/(main)/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Content from '@/models/Content';
import User from '@/models/User';
import Comment from '@/models/Comment';
// Import the Category model to register its schema with Mongoose
import Category from '@/models/Category'; 
import FavoriteButton from '@/components/FavoriteButton';
import CommentsSection from '@/components/CommentsSection';
import LikeButton from '@/components/LikeButton';
import { FaCalendarAlt, FaStar, FaComment } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { IoBookSharp } from 'react-icons/io5';

async function getStory(slug, isAdmin) {
  await dbConnect();

  try {
    let query = { slug: slug };
    
    // For non-admin users, apply filters for public, published stories
    if (!isAdmin) {
      query.visibility = 'public';
      query.isDraft = false;
      query.publishDate = { $lte: new Date() };
    }

    const story = await Content.findOne(query)
      .populate('author', 'name')
      .populate('category', 'name')
      .lean();

    // If story is not found, return null
    if (!story) {
      return null;
    }

    return story;
  } catch (error) {
    console.error("Failed to fetch story from DB:", error);
    return null;
  }
}

async function getCommentCount(storyId) {
  await dbConnect();
  const count = await Comment.countDocuments({ story: storyId });
  return count;
}

export default async function SingleStoryPage({ params }) {
  await params;
  const { id } = params;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';
  const story = await getStory(id, isAdmin);

  if (!story || (story.visibility === 'private' && !isAdmin)) {
    return notFound();
  }

  let initialFavorites = [];
  if (session?.user?.id) {
    const user = await User.findById(session.user.id);
    if (user && user.favorites) {
      initialFavorites = user.favorites.map(fav => fav.toString());
    }
  }

  // Use the logical OR operator to default to an empty array if story.likes is undefined
  const initialLikeCount = (story.likes || []).length;
  const isInitiallyLiked = session?.user?.id ? (story.likes || []).includes(session.user.id) : false;
  const commentCount = await getCommentCount(story._id);

  // Function to detect Urdu text based on Unicode range (fallback if language field is absent)
  const isUrdu = (text) => {
    const urduRegex = /[\u0600-\u06FF]/; // Urdu Unicode range
    return urduRegex.test(text);
  };

  // Determine if the story is in Urdu based on language field or text content
  const isStoryUrdu = story.language === 'ur' || (!story.language && (isUrdu(story.title) || isUrdu(story.body)));

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <HiHome className="mr-1" />
        <a href="/" className="hover:text-gray-700 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <IoBookSharp className="mr-1" />
        <a href="/stories" className="hover:text-gray-700 transition-colors">Stories</a>
        <span className="mx-2">/</span>
        <span className={`text-gray-700 ${isStoryUrdu ? 'urdu-text' : ''}`} dir={isStoryUrdu ? 'rtl' : 'ltr'}>
          {story.title}
        </span>
      </nav>

      <div className="bg-gray-100 rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <h1 className={`text-4xl font-bold text-gray-900 leading-tight ${isStoryUrdu ? 'urdu-text' : ''}`} dir={isStoryUrdu ? 'rtl' : 'ltr'}>
            {story.title}
          </h1>
          <div className="flex items-center space-x-3">
            <LikeButton 
              storyId={story._id.toString()}
              initialLikeCount={initialLikeCount}
              isInitiallyLiked={isInitiallyLiked}
            />
            <FavoriteButton storyId={story._id.toString()} initialFavorites={initialFavorites} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-6 text-sm">
          <div className="flex items-center">
            <span className="mr-2">By</span>
            <span className="font-medium text-gray-900">{story.author?.name || 'Unknown Author'}</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1 text-gray-500" />
            <span>
              {new Date(story.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          {story.category && (
            <>
              <div className="w-px h-4 bg-gray-300"></div>
              <span className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium">
                {story.category.name}
              </span>
            </>
          )}
        </div>

        <div className="w-full h-px bg-gray-200 my-6"></div>

        <article 
          className={`prose prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-a:text-gray-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-gray-600 prose-blockquote:bg-gray-50 prose-blockquote:px-6 prose-blockquote:py-3 prose-blockquote:rounded-r-lg prose-img:rounded-xl ${isStoryUrdu ? 'urdu-text' : ''}`}
          dir={isStoryUrdu ? 'rtl' : 'ltr'}
          dangerouslySetInnerHTML={{ __html: story.body }} 
        />

        <div className="flex flex-wrap justify-start items-center gap-6 mt-8 pt-6 border-t border-gray-200 text-gray-600">
          <span className="flex items-center bg-gray-200 px-4 py-2 rounded-full">
            <FaStar className="mr-2 text-red-500" />
            <span id="like-count" className="font-medium">{initialLikeCount}</span>
            <span className="ml-1">Likes</span>
          </span>
          <span className="flex items-center bg-gray-200 px-4 py-2 rounded-full">
            <FaComment className="mr-2 text-gray-500" />
            <span className="font-medium">{commentCount}</span>
            <span className="ml-1">Comments</span>
          </span>
        </div>
      </div>

      <CommentsSection storyId={story._id.toString()} />
    </div>
  );
}