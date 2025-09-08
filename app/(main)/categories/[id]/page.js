// app/categories/[id]/page.js
import StoryCard from '@/components/StoryCard';
import { FiArrowLeft, FiBook, FiUsers, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';

async function getCategoryStories(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stories/category/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch stories for this category');
  }

  return res.json();
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

export default async function CategoryDetailPage({ params }) {
  const { stories } = await getCategoryStories(params.id);
  const { categories } = await getCategories();
  const currentCategory = categories.find(cat => cat._id === params.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Navigation */}
        <Link href="/categories">
          <div className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6 transition-colors duration-200">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </div>
        </Link>

        {/* Category Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mr-6">
                <FiBook className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {currentCategory?.name || 'Category'}
                </h1>
                <p className="text-gray-600">
                  Discover amazing {currentCategory?.name || 'Category'} in this category
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FiBook className="w-6 h-6 mr-2 text-indigo-600" />
              Featured Stories
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {stories.length} {stories.length === 1 ? 'story' : 'stories'}
            </span>
          </div>

          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FiBook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Stories Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                There are no stories in this category yet. Be the first to write one!
              </p>
              <Link href="/create">
                <div className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  <FiBook className="w-4 h-4 mr-2" />
                  Write a Story
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Related Categories */}
        {categories.length > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Explore Other Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories
                .filter(cat => cat._id !== params.id)
                .slice(0, 4)
                .map(category => (
                  <Link key={category._id} href={`/categories/${category._id}`}>
                    <div className="bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                      {category.name}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}