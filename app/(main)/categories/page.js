// app/categories/page.js
import Link from 'next/link';
import Image from 'next/image';
import { FiFolder, FiBook, FiArrowRight } from 'react-icons/fi';

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

export default async function CategoriesPage() {
  const { categories } = await getCategories();

  // Generate gradient colors for categories
  const gradientColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-6">
            <FiFolder className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover stories across various genres and topics from our community of writers
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const colorIndex = index % gradientColors.length;
              const gradient = gradientColors[colorIndex];
              
              return (
                <Link 
                  key={category._id} 
                  href={`/categories/${category._id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full">
                    {/* Category Header with Gradient */}
                    <div className={`h-4 bg-gradient-to-r ${gradient}`}></div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <FiBook className="w-6 h-6 text-gray-600" />
                        </div>
                        <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200 transform group-hover:translate-x-1" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors duration-200">
                        {category.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm">
                        Explore captivating stories in this category
                      </p>
                      
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                          {Math.floor(Math.random() * 50) + 10} stories
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-lg">
              <FiFolder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Categories Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Categories will appear here once they are added by the admin.
              </p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">1K+</div>
              <div className="text-gray-600">Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Writers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}