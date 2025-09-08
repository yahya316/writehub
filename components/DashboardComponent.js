'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FaUsers, FaTag, FaFileAlt, FaFileCode, FaHeart, FaClock, FaChartPie, FaRedo } from 'react-icons/fa';
import TopCard from '@/components/TopCard';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

// Dynamically import chart components
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalItems: 0,
    draftItems: 0,
    totalLikes: 0,
    lineChartData: { labels: [], datasets: [] },
    contentPieChartData: { labels: [], datasets: [] },
    recentActivity: [],
    topItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processDashboardData = useCallback((users, categories, stories, comments) => {
    const totalUsers = users.length;
    const totalCategories = categories.length;
    const totalItems = stories.length;
    const draftItems = stories.filter((s) => s.isDraft).length;
    const totalLikes = stories.reduce((sum, story) => sum + (story.likes?.length || 0), 0);

    const recentStories = stories.slice(0, 3).map((story) => ({
      type: 'Story Published',
      timestamp: story.createdAt ? new Date(story.createdAt).toLocaleString() : 'N/A',
      link: `/story/${story.slug || story._id}`,
    }));
    const recentComments = comments.slice(0, 3).map((comment) => ({
      type: 'New Comment',
      timestamp: comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'N/A',
      link: `/story/${comment.storyId}?comment=${comment._id}`,
    }));
    const recentActivity = [...recentStories, ...recentComments].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const topItems = stories
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3)
      .map((story) => ({
        title: story.title,
        updatedAt: story.updatedAt ? new Date(story.updatedAt).toLocaleDateString() : 'N/A',
        link: `/story/${story.slug || story._id}`,
      }));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const categoryMonthlyCounts = {};
    categories.forEach((cat) => {
      categoryMonthlyCounts[cat.name] = Object.fromEntries(months.map((m) => [m, 0]));
    });
    categoryMonthlyCounts['Uncategorized'] = Object.fromEntries(months.map((m) => [m, 0]));

    stories.forEach((story) => {
      const date = new Date(story.createdAt);
      if (!isNaN(date.getMonth())) {
        const month = months[date.getMonth()];
        const categoryName = story.category?.name || 'Uncategorized';
        categoryMonthlyCounts[categoryName] = categoryMonthlyCounts[categoryName] || {};
        categoryMonthlyCounts[categoryName][month]++;
      }
    });

    const backgroundColors = ['rgba(99, 102, 241, 0.2)', 'rgba(16, 185, 129, 0.2)', 'rgba(245, 158, 11, 0.2)'];
    const borderColors = ['#6366F1', '#10B981', '#F59E0B'];

    const datasets = Object.keys(categoryMonthlyCounts).map((categoryName, index) => ({
      label: categoryName,
      data: Object.values(categoryMonthlyCounts[categoryName]),
      borderColor: borderColors[index % borderColors.length],
      backgroundColor: backgroundColors[index % backgroundColors.length],
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    }));

    const lineChartData = { labels: months, datasets };

    const categoryCounts = {};
    categories.forEach((cat) => {
      categoryCounts[cat.name] = 0;
    });
    categoryCounts['Uncategorized'] = 0;

    stories.forEach((story) => {
      const categoryName = story.category?.name || 'Uncategorized';
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    const contentPieChartData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          data: Object.values(categoryCounts),
          backgroundColor: ['#6366F1', '#10B981', '#F59E0B'],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };

    return {
      totalUsers,
      totalCategories,
      totalItems,
      draftItems,
      totalLikes,
      lineChartData,
      contentPieChartData,
      recentActivity,
      topItems,
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoints = session?.user?.role === 'admin'
        ? [
            fetch('/api/user', { cache: 'no-store' }),
            fetch('/api/categories', { cache: 'no-store' }),
            fetch('/api/content?allContent=true', { cache: 'no-store' }),
            fetch('/api/comments', { cache: 'no-store' }),
          ]
        : [
            fetch('/api/categories', { cache: 'no-store' }),
            fetch('/api/content', { cache: 'no-store' }),
            fetch('/api/comments', { cache: 'no-store' }),
          ];

      const responses = await Promise.all(endpoints);
      if (session?.user?.role === 'admin') {
        if (!responses[0].ok) throw new Error('Failed to fetch users');
        if (!responses[1].ok) throw new Error('Failed to fetch categories');
        if (!responses[2].ok) throw new Error('Failed to fetch content');
        if (!responses[3].ok) throw new Error('Failed to fetch comments');

        const [usersRes, categoriesRes, contentRes, commentsRes] = responses;
        const usersData = await usersRes.json();
        const categoriesData = await categoriesRes.json();
        const contentData = await contentRes.json();
        const commentsData = await commentsRes.json();

        const processedData = processDashboardData(
          usersData.users || [],
          categoriesData.categories || [],
          contentData.stories || [],
          commentsData.comments || []
        );
        setDashboardData(processedData);
      } else {
        if (!responses[0].ok) throw new Error('Failed to fetch categories');
        if (!responses[1].ok) throw new Error('Failed to fetch content');
        if (!responses[2].ok) throw new Error('Failed to fetch comments');

        const [categoriesRes, contentRes, commentsRes] = responses;
        const categoriesData = await categoriesRes.json();
        const contentData = await contentRes.json();
        const commentsData = await commentsRes.json();

        const processedData = processDashboardData(
          [], // No user data for non-admins
          categoriesData.categories || [],
          contentData.stories || [],
          commentsData.comments || []
        );
        setDashboardData(processedData);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [session, processDashboardData]);

  useEffect(() => {
    if (status === 'authenticated') fetchData();
  }, [status, fetchData]);

  const handleRetry = () => {
    fetchData();
  };

  const handleItemClick = (link) => {
    if (link) {
      router.push(link);
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 } }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [5, 5] }, beginAtZero: true } },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 } },
      tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed}` } },
    },
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-800">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-medium text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <FaRedo className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-800">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return session?.user?.role === 'admin' ? (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between hover:bg-indigo-50 transition duration-300 cursor-pointer" onClick={() => router.push('/users')}>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Total Users</h3>
            <p className="text-3xl font-extrabold text-indigo-600 mt-2">{dashboardData.totalUsers}</p>
          </div>
          <FaUsers className="text-4xl text-indigo-400 opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between hover:bg-green-50 transition duration-300 cursor-pointer" onClick={() => router.push('/category')}>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Categories</h3>
            <p className="text-3xl font-extrabold text-green-600 mt-2">{dashboardData.totalCategories}</p>
          </div>
          <FaTag className="text-4xl text-green-400 opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between hover:bg-blue-50 transition duration-300 cursor-pointer" onClick={() => router.push('/story')}>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Published Items</h3>
            <p className="text-3xl font-extrabold text-blue-600 mt-2">{dashboardData.totalItems}</p>
          </div>
          <FaFileAlt className="text-4xl text-blue-400 opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between hover:bg-yellow-50 transition duration-300 cursor-pointer" onClick={() => router.push('/content')}>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Draft Items</h3>
            <p className="text-3xl font-extrabold text-yellow-600 mt-2">{dashboardData.draftItems}</p>
          </div>
          <FaFileCode className="text-4xl text-yellow-400 opacity-50" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between hover:bg-red-50 transition duration-300 cursor-pointer" onClick={() => router.push('/story')}>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Total Likes</h3>
            <p className="text-3xl font-extrabold text-red-600 mt-2">{dashboardData.totalLikes}</p>
          </div>
          <FaHeart className="text-4xl text-red-400 opacity-50" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full lg:w-2/3 hover:bg-indigo-50 transition duration-300">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaClock className="text-indigo-500" /> Activity Overview
          </h2>
          <div className="h-[420px]">
            <Line data={dashboardData.lineChartData} options={lineChartOptions} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full lg:w-1/3 hover:bg-green-50 transition duration-300">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaChartPie className="text-green-500" /> Content Breakdown
          </h2>
          <div className="h-[420px] flex items-center justify-center">
            <Pie data={dashboardData.contentPieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:bg-gray-50 transition duration-300">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul>
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleItemClick(activity.link)}
                >
                  <span className="text-gray-700">{activity.type}</span>
                  <span className="text-gray-500 text-sm">{activity.timestamp}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No recent activity.</p>
            )}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:bg-gray-50 transition duration-300">
          <h2 className="text-lg font-semibold mb-4">Latest Content Updates</h2>
          <ul>
            {dashboardData.topItems.length > 0 ? (
              dashboardData.topItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleItemClick(item.link)}
                >
                  <span className="text-gray-700 font-medium truncate">{item.title}</span>
                  <span className="text-gray-500 text-sm">{item.updatedAt}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No content updates.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <TopCard />
  );
};

export default DashboardPage;