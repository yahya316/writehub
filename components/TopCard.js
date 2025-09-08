'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js/auto';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaRegCommentDots, FaRegHeart } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

import 'swiper/css';
import 'swiper/css/navigation';

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ commentCount: 0, favoriteCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories.');
      const data = await res.json();
      console.log('Categories Data:', data);
      return data.categories || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch stories.');
      const data = await res.json();
      console.log('Stories Data:', data);
      return data.stories || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/topcard');
      if (res.ok) {
        const data = await res.json();
        console.log('Stats Data:', data);
        return data || { commentCount: 0, favoriteCount: 0 };
      }
      return { commentCount: 0, favoriteCount: 0 };
    } catch (err) {
      console.error('Failed to load user stats:', err);
      return { commentCount: 0, favoriteCount: 0 };
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedCategories, fetchedStories, fetchedStats] = await Promise.all([
          fetchCategories(),
          fetchStories(),
          fetchStats(),
        ]);
        setCategories(fetchedCategories);
        setStories(fetchedStories);
        setStats(fetchedStats);
        handleResize();
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('resize', handleResize);
    loadData();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categoryMap = categories.reduce((map, cat) => {
    map[cat._id] = cat.name;
    return map;
  }, {});

  const categoryTotals = stories.reduce((acc, story) => {
    let categoryId;
    if (typeof story.category === 'string') {
      categoryId = story.category; 
    } else if (story.category && typeof story.category === 'object' && story.category._id) {
      categoryId = story.category._id; 
    } else {
      console.warn('Unrecognized category format for story:', story);
      categoryId = null; 
    }
    const type = categoryId ? categoryMap[categoryId] || 'Uncategorized' : 'Uncategorized';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([name, count]) => ({ name, count }));

  const baseColors = [
    '#6366F1', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#0EA5E9', // Sky
    '#EC4899', // Pink
    '#8B5CF6', // Violet
    '#14B8A6', // Teal
  ];

  const barColors = chartData.map((_, index) => {
    const color = baseColors[index % baseColors.length];
    const darkenColor = (hex, percent) => {
      let f = parseInt(hex.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = (f >> 8) & 0x00ff,
        B = f & 0x0000ff;
      return `#${(0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)}`;
    };
    return {
      backgroundColor: color,
      borderColor: darkenColor(color, -0.1), 
    };
  });

  const chartDataForJs = {
    labels: chartData.map((item) => item.name),
    datasets: [
      {
        label: 'Number of Items',
        data: chartData.map((item) => item.count),
        backgroundColor: barColors.map((c) => c.backgroundColor),
        borderColor: barColors.map((c) => c.borderColor),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: isMobile ? 16 : 32,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isMobile ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4B5563',
          font: { size: 13, family: 'Inter, sans-serif' },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Content Breakdown',
        color: '#1F2937',
        font: { size: 20, weight: 'bold', family: 'Inter, sans-serif' },
        padding: { top: 10, bottom: 25 },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { display: !isMobile, color: 'rgba(200, 200, 200, 0.2)', drawBorder: false },
        ticks: { color: '#6B7280', font: { size: isMobile ? 10 : 12, family: 'Inter, sans-serif' }, padding: 8 },
        title: {
          display: true,
          text: isMobile ? 'Number of Items' : 'Categories',
          color: '#4B5563',
          font: { size: 14, weight: '600', family: 'Inter, sans-serif' },
          padding: { top: 10 },
        },
      },
      y: {
        grid: { color: 'rgba(200, 200, 200, 0.2)', drawBorder: false },
        ticks: { color: '#6B7280', font: { size: isMobile ? 10 : 12, family: 'Inter, sans-serif' }, padding: 8 },
        title: {
          display: true,
          text: isMobile ? 'Categories' : 'Number of Items',
          color: '#4B5563',
          font: { size: 14, weight: '600', family: 'Inter, sans-serif' },
          padding: { bottom: 10 },
        },
      },
    },
  };

  return (
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-2 sm:p-4">
        <header className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2 sm:mb-4">
            User Dashboard
          </h1>
          <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-400">Your creative hub at a glance</p>
        </header>

        <div className="flex justify-center items-center">
          <div className="w-full">
            {/* Comments and Favorites Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-12 w-full">
              {/* Comments Card */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl p-4 sm:p-6 flex items-center justify-between w-full transition-all duration-300 hover:shadow-lg sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <FaRegCommentDots className="text-3xl sm:text-5xl text-blue-500 dark:text-blue-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 uppercase text-xs sm:text-sm font-semibold">Comments</p>
                    <p className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.commentCount}</p>
                  </div>
                </div>
                <span className="text-2xl sm:text-4xl text-blue-500 dark:text-blue-400">💬</span>
              </div>

              {/* Favorites Card */}
              <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl p-4 sm:p-6 flex items-center justify-between w-full transition-all duration-300 hover:shadow-lg sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <FaRegHeart className="text-3xl sm:text-5xl text-red-500 dark:text-red-400" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 uppercase text-xs sm:text-sm font-semibold">Favorites</p>
                    <p className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">{stats.favoriteCount}</p>
                  </div>
                </div>
                <span className="text-2xl sm:text-4xl text-red-500 dark:text-red-400">❤️</span>
              </div>
            </div>

            {/* Swiper for Category Cards */}
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={isMobile ? 8 : 20}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              navigation
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="mb-6 sm:mb-12"
            >
              {Object.entries(categoryTotals).map(([type, count]) => (
                <SwiperSlide key={type}>
                  <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-lg sm:rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center min-h-[120px] sm:min-h-[180px] flex flex-col items-center justify-center transform hover:bg-opacity-90 transition-all duration-300">
                    <h2 className="text-lg sm:text-2xl font-semibold mb-1 sm:mb-3 capitalize text-gray-800 dark:text-gray-200">{type}</h2>
                    <p className="text-2xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">{count}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Chart for Content Breakdown */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center">
              <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800 dark:text-gray-200">Content Breakdown</h2>
              <div className={`w-full ${isMobile ? 'h-64' : 'h-96'}`}>
                <Bar options={options} data={chartDataForJs} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}