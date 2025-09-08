'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

// Dynamically import StoryCard component
const StoryCard = dynamic(() => import('@/components/StoryCard'), { ssr: false });

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || '';
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({ fetch: true, retry: false });
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch categories.');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchStories = useCallback(async (category, sort) => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setError(null);
    let url = '/api/content?';
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (sort) url += `sort=${encodeURIComponent(sort)}&`;

    try {
      const res = await fetch(url.slice(0, -1), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch stories.');
      const data = await res.json();

      const storiesWithCounts = await Promise.all(
        data.stories.map(async (story) => {
          const commentsRes = await fetch(`/api/comments?storyId=${story._id}`, { cache: 'no-store' });
          if (!commentsRes.ok) throw new Error(`Failed to fetch comments for story ${story._id}.`);
          const commentsData = await commentsRes.json();
          return {
            ...story,
            commentCount: commentsData.comments.length,
          };
        })
      );

      setStories(storiesWithCounts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' || status === 'unauthenticated') {
      fetchCategories();
      fetchStories(selectedCategory, selectedSort);
    }
  }, [status, selectedCategory, selectedSort, fetchCategories, fetchStories]);

  const handleCategoryChange = useCallback((e) => {
    const newCategory = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleSortChange = useCallback((e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (newSort) {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleRetry = useCallback(() => {
    setLoading((prev) => ({ ...prev, fetch: true, retry: true }));
    fetchCategories();
    fetchStories(selectedCategory, selectedSort);
  }, [fetchCategories, fetchStories, selectedCategory, selectedSort]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-800 dark:text-gray-200">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="container mx-auto text-center mb-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
          Welcome to WriteHub
        </h1>
        {session?.user && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Hello, {session.user.name || 'User'}! Explore the latest stories.
          </p>
        )}
      </div>

      <div className="container mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
              disabled={loading.retry}
            >
              <FiRefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">Latest Content</h2>

          {/* Filters and Sorting */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                onChange={handleCategoryChange}
                value={selectedCategory}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-100"
                disabled={loading.fetch}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="relative">
              <select
                onChange={handleSortChange}
                value={selectedSort}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-100"
                disabled={loading.fetch}
              >
                <option value="">Sort By</option>
                <option value="latest">Latest</option>
                <option value="titleAsc">Title (A-Z)</option>
                <option value="titleDesc">Title (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading.fetch ? (
            <div className="col-span-3 text-center">
              <div className="flex justify-center items-center gap-2">
                <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading stories...</p>
              </div>
            </div>
          ) : error ? (
            <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">Unable to load stories. Please try again.</p>
          ) : stories.length > 0 ? (
            stories.map((story) => <StoryCard key={story._id} story={story} />)
          ) : (
            <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">No stories found with the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}