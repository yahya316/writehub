// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import StoryCard from '@/components/StoryCard';
// import FeaturedStoryCard from '@/components/FeaturedStoryCard';
// import { useSearchParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { FiArrowLeft, FiArrowRight, FiSearch, FiFilter, FiBookOpen, FiLayers, FiPlus } from 'react-icons/fi';
// import { FaPenFancy } from 'react-icons/fa';
// import SearchBar from '@/components/SearchBar';

// // Import Swiper components and styles
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/effect-fade';

// export default function HomePage() {
//   const [stories, setStories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAll, setShowAll] = useState(false);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const swiperRef = useRef(null);
//   const filterSectionRef = useRef(null);

//   const selectedCategory = searchParams.get('category') || '';
//   const selectedSort = searchParams.get('sort') || '';

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch('/api/categories', { cache: 'no-store' });
//       if (!res.ok) throw new Error('Failed to fetch categories.');
//       const data = await res.json();
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//     }
//   };

//   const fetchStories = async (category, sort) => {
//     setLoading(true);
//     let url = `/api/content?`;
//     if (category) url += `category=${category}&`;
//     if (sort) url += `sort=${sort}&`;

//     try {
//       const res = await fetch(url.slice(0, -1), { cache: 'no-store' });
//       if (!res.ok) throw new Error('Failed to fetch stories.');
//       const data = await res.json();

//       const transformedStories = data.stories
//         ? data.stories.map((story) => ({
//             ...story,
//             title: story.title || 'Untitled Story',
//             author: story.author || { name: 'Unknown Author' },
//             slug: story.slug || '',
//             category: story.category || null,
//             likeCount: story.likes ? story.likes.length : 0,
//             commentCount: story.commentCount || 0,
//             readTime: story.readTime || 5,
//             excerpt: story.excerpt || 'Discover this captivating story from our community writer.',
//           }))
//         : [];

//       setStories(transformedStories);
//     } catch (err) {
//       console.error('Error fetching stories:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchStories(selectedCategory, selectedSort);
//   }, [selectedCategory, selectedSort]);

//   const handleCategoryChange = (categoryId) => {
//     setActiveCategory(categoryId);
//     const params = new URLSearchParams(searchParams);
//     if (categoryId && categoryId !== 'all') {
//       params.set('category', categoryId);
//     } else {
//       params.delete('category');
//     }
//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   const handleSortChange = (e) => {
//     const newSort = e.target.value;
//     const params = new URLSearchParams(searchParams);
//     if (newSort) {
//       params.set('sort', newSort);
//     } else {
//       params.delete('sort');
//     }
//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   const carouselImages = [
//     '/img4.jpg',
//     '/img5.jpg',
//     '/img3.jpg',
//   ];

//   const headerText = {
//     title: 'Welcome to WriteHub',
//     description: 'Discover a world of stories, articles, and poems crafted by creators like you.',
//     ctaText: 'Start Reading',
//     ctaLink: '/contents',
//   };

//   const stats = [
//     { number: '1K+', label: 'Active Writers' },
//     { number: '5K+', label: 'Published Stories' },
//     { number: '100+', label: 'Categories' },
//     { number: '50K+', label: 'Monthly Readers' },
//   ];

//   const initialCards = stories.slice(0, 3); // Show only 3 cards initially
//   const displayedStories = showAll ? stories : initialCards;

//   const featuredStory = stories.find((story) => story.featured === true);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300">
//       {/* Hero Section with Carousel */}
//       <header className="relative h-[50vh] sm:h-[70vh] text-white overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-800/60 to-gray-900/60 z-10"></div>
        
//         <Swiper
//           modules={[Autoplay, Navigation, EffectFade]}
//           autoplay={{ delay: 1000, disableOnInteraction: false }}
//           navigation={{
//             nextEl: '.custom-swiper-button-next',
//             prevEl: '.custom-swiper-button-prev',
//           }}
//           effect="fade"
//           speed={1000}
//           loop={true}
//           className="w-full h-full"
//           onSwiper={(swiper) => {
//             swiperRef.current = swiper;
//           }}
//         >
//           {carouselImages.map((image, index) => (
//             <SwiperSlide key={index}>
//               <div className="relative w-full h-full">
//                 <Image
//                   src={image}
//                   alt={`Carousel Image ${index + 1}`}
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   priority={index === 0}
//                   quality={75} 
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
//                   onError={() => console.error(`Failed to load image: ${image}`)}
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>

//         <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
//           <div className="text-center max-w-3xl">
//             <div className="inline-flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 sm:mb-6 border border-gray-500/30">
//               <FaPenFancy className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
//               <span className="text-gray-200 text-xs sm:text-sm">Where Stories Come to Life</span>
//             </div>
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in-up">
//               {headerText.title}
//             </h1>
//             <p className="text-sm sm:text-lg md:text-xl opacity-90 mb-6 px-6 sm:mb-8 animate-fade-in-up animation-delay-200">
//               {headerText.description}
//             </p>
//             <div className="flex flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animation-delay-400">
//               <Link href={headerText.ctaLink} prefetch={true}>
//                 <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base">
//                   {headerText.ctaText}
//                 </span>
//               </Link>
//               <Link href="/categories" prefetch={true}>
//                 <span className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 text-gray-200 font-semibold rounded-lg hover:bg-gray-200/10 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base">
//                   Explore Categories
//                 </span>
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="custom-swiper-button-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 cursor-pointer bg-gray-200/10 backdrop-blur-sm p-1.5 sm:p-2 rounded-full">
//           <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200 hover:text-gray-400 transition duration-200" />
//         </div>
//         <div className="custom-swiper-button-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 cursor-pointer bg-gray-200/10 backdrop-blur-sm p-1.5 sm:p-2 rounded-full">
//           <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200 hover:text-gray-400 transition duration-200" />
//         </div>

//         <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
//           <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-200 rounded-full flex justify-center">
//             <div className="w-1 h-2 sm:h-3 bg-gray-200 rounded-full mt-1 sm:mt-2"></div>
//           </div>
//         </div>
//       </header>

//       {/* Stats Section */}
//       <section className="py-4 sm:py-12 bg-gray-100">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-4 gap-4 sm:gap-6 md:gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center p-3 sm:p-4">
//                 <div className="text-lg sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{stat.number}</div>
//                 <div className="text-gray-600 text-xs sm:text-base">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stories Section */}
//       <section ref={filterSectionRef} className="container mx-auto px-4 py-12 sm:py-16">
//         <div className="text-center mb-8 sm:mb-12">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 relative inline-block">
//             Explore Stories
//             <span className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gray-600 rounded-full"></span>
//           </h2>
//           <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
//             Discover captivating stories across various genres and topics from our community of talented writers.
//           </p>
//         </div>

//         {/* Category Filters */}
//         <div className="mb-8 sm:mb-12 bg-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
//             <div className="flex items-center gap-2 text-gray-700">
//               <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
//               <span className="font-medium text-sm sm:text-base">Filter by category:</span>
//             </div>
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="relative">
//                 <SearchBar />
//               </div>
//               <select
//                 value={selectedSort}
//                 onChange={handleSortChange}
//                 className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none transition duration-200 text-sm sm:text-base"
//               >
//                 <option value="">Sort By</option>
//                 <option value="latest">Latest</option>
//                 <option value="title-asc">Title (A-Z)</option>
//                 <option value="title-desc">Title (Z-A)</option>
//                 <option value="popular">Most Popular</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
//             <button
//               onClick={() => handleCategoryChange('all')}
//               className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
//                 activeCategory === 'all'
//                   ? 'bg-gray-600 text-white shadow-lg'
//                   : 'bg-gray-100 text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-300'
//               }`}
//             >
//               <FiLayers className="w-3 h-3 sm:w-4 sm:h-4" />
//               All Categories
//             </button>
//             {categories.map((cat) => (
//               <button
//                 key={cat._id}
//                 onClick={() => handleCategoryChange(cat._id)}
//                 className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 text-sm sm:text-base ${
//                   activeCategory === cat._id
//                     ? 'bg-gray-600 text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-300'
//                 }`}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Stories Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//           {loading ? (
//             Array.from({ length: 3 }).map((_, index) => (
//               <div key={index} className="bg-gray-100 rounded-2xl shadow-md overflow-hidden animate-pulse">
//                 <div className="h-32 sm:h-48 bg-gradient-to-r from-gray-300 to-gray-400"></div>
//                 <div className="p-4 sm:p-6">
//                   <div className="h-5 sm:h-6 bg-gray-400 rounded mb-3 sm:mb-4"></div>
//                   <div className="h-3 sm:h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
//                   <div className="h-3 sm:h-4 bg-gray-400 rounded w-1/2"></div>
//                   <div className="flex items-center mt-3 sm:mt-4">
//                     <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-400 rounded-full mr-2"></div>
//                     <div className="h-2 sm:h-3 bg-gray-400 rounded w-1/3"></div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : displayedStories.length > 0 ? (
//             displayedStories.map((story) => (
//               <div key={story._id} className="transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
//                 <StoryCard story={story} />
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12 sm:py-16 bg-gray-200 rounded-2xl">
//               <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full mb-4 sm:mb-6">
//                 <FiBookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
//               </div>
//               <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">No stories found</h3>
//               <p className="text-gray-500 max-w-md mx-auto mb-4 sm

// :mb-6 text-sm sm:text-base">Try selecting a different category or check back later for new content.</p>
//               <button
//                 onClick={() => handleCategoryChange('all')}
//                 className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
//               >
//                 View All Stories
//               </button>
//             </div>
//           )}
//         </div>

//         {!showAll && stories.length > initialCards.length && (
//           <div className="text-center mt-10 sm:mt-14">
//             <button
//               onClick={() => setShowAll(true)}
//               className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
//             >
//               <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
//               View More Stories
//             </button>
//           </div>
//         )}
//       </section>

//       {featuredStory && (
//         <section className="bg-gradient-to-r from-gray-600 to-gray-700 py-12 sm:py-16">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-8 sm:mb-10">
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Featured Story</h2>
//               <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg">
//                 Discover this week&apos;s standout story selected by our editorial team.
//               </p>
//             </div>

//             <div className="max-w-4xl mx-auto">
//               <FeaturedStoryCard story={featuredStory} />
//             </div>
//           </div>
//         </section>
//       )}

//       {/* CTA Section */}
//       <section className="py-8 sm:py-16 bg-gray-100">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Ready to Share Your Story?</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg">
//             Join our community of writers and readers. Share your thoughts, stories, and ideas with the world.
//           </p>
//           <div className="flex flex-row gap-3 sm:gap-4 justify-center">
//             <Link href="/auth/register" prefetch={true}>
//               <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 text-sm sm:text-base">
//                 Sign Up Now
//               </span>
//             </Link>
//             <Link href="/about" prefetch={true}>
//               <span className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-600 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base">
//                 Learn More
//               </span>
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }












'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import StoryCard from '@/components/StoryCard';
import FeaturedStoryCard from '@/components/FeaturedStoryCard';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiSearch, FiFilter, FiBookOpen, FiLayers, FiPlus } from 'react-icons/fi';
import { FaPenFancy } from 'react-icons/fa';
import SearchBar from '@/components/SearchBar';

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// New client component to handle useSearchParams
function SearchParamsWrapper({ onCategoryChange, onSortChange, selectedCategory, selectedSort }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';
    onCategoryChange(category);
    onSortChange(sort);
  }, [searchParams, onCategoryChange, onSortChange]);

  const handleCategoryChange = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId && categoryId !== 'all') {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (newSort) {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-8 sm:mb-12 bg-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-gray-700">
          <FiFilter className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-sm sm:text-base">Filter by category:</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <SearchBar />
          </div>
          <select
            value={selectedSort}
            onChange={handleSortChange}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none transition duration-200 text-sm sm:text-base"
          >
            <option value="">Sort By</option>
            <option value="latest">Latest</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
            selectedCategory === 'all'
              ? 'bg-gray-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-300'
          }`}
        >
          <FiLayers className="w-3 h-3 sm:w-4 sm:h-4" />
          All Categories
        </button>
        {/* Categories will be rendered in the parent component */}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const swiperRef = useRef(null);
  const filterSectionRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch categories.');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchStories = async (category, sort) => {
    setLoading(true);
    let url = `/api/content?`;
    if (category) url += `category=${category}&`;
    if (sort) url += `sort=${sort}&`;

    try {
      const res = await fetch(url.slice(0, -1), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch stories.');
      const data = await res.json();

      const transformedStories = data.stories
        ? data.stories.map((story) => ({
            ...story,
            title: story.title || 'Untitled Story',
            author: story.author || { name: 'Unknown Author' },
            slug: story.slug || '',
            category: story.category || null,
            likeCount: story.likes ? story.likes.length : 0,
            commentCount: story.commentCount || 0,
            readTime: story.readTime || 5,
            excerpt: story.excerpt || 'Discover this captivating story from our community writer.',
          }))
        : [];

      setStories(transformedStories);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchStories(selectedCategory, selectedSort);
  }, [selectedCategory, selectedSort]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedCategory(categoryId === 'all' ? '' : categoryId);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  const carouselImages = [
    '/img4.jpg',
    '/img5.jpg',
    '/img3.jpg',
  ];

  const headerText = {
    title: 'Welcome to WriteHub',
    description: 'Discover a world of stories, articles, and poems crafted by creators like you.',
    ctaText: 'Start Reading',
    ctaLink: '/contents',
  };

  const stats = [
    { number: '1K+', label: 'Active Writers' },
    { number: '5K+', label: 'Published Stories' },
    { number: '100+', label: 'Categories' },
    { number: '50K+', label: 'Monthly Readers' },
  ];

  const initialCards = stories.slice(0, 3); // Show only 3 cards initially
  const displayedStories = showAll ? stories : initialCards;

  const featuredStory = stories.find((story) => story.featured === true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-300">
      {/* Hero Section with Carousel */}
      <header className="relative h-[50vh] sm:h-[70vh] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/60 to-gray-900/60 z-10"></div>
        
        <Swiper
          modules={[Autoplay, Navigation, EffectFade]}
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.custom-swiper-button-next',
            prevEl: '.custom-swiper-button-prev',
          }}
          effect="fade"
          speed={1000}
          loop={true}
          className="w-full h-full"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {carouselImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`Carousel Image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                  quality={75} 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
                  onError={() => console.error(`Failed to load image: ${image}`)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 sm:mb-6 border border-gray-500/30">
              <FaPenFancy className="text-gray-300 w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-gray-200 text-xs sm:text-sm">Where Stories Come to Life</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in-up">
              {headerText.title}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl opacity-90 mb-6 px-6 sm:mb-8 animate-fade-in-up animation-delay-200">
              {headerText.description}
            </p>
            <div className="flex flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link href={headerText.ctaLink} prefetch={true}>
                <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base">
                  {headerText.ctaText}
                </span>
              </Link>
              <Link href="/categories" prefetch={true}>
                <span className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 text-gray-200 font-semibold rounded-lg hover:bg-gray-200/10 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base">
                  Explore Categories
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="custom-swiper-button-prev absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 cursor-pointer bg-gray-200/10 backdrop-blur-sm p-1.5 sm:p-2 rounded-full">
          <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200 hover:text-gray-400 transition duration-200" />
        </div>
        <div className="custom-swiper-button-next absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 cursor-pointer bg-gray-200/10 backdrop-blur-sm p-1.5 sm:p-2 rounded-full">
          <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-200 hover:text-gray-400 transition duration-200" />
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-200 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-gray-200 rounded-full mt-1 sm:mt-2"></div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-4 sm:py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-3 sm:p-4">
                <div className="text-lg sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-gray-600 text-xs sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section ref={filterSectionRef} className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 relative inline-block">
            Explore Stories
            <span className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gray-600 rounded-full"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Discover captivating stories across various genres and topics from our community of talented writers.
          </p>
        </div>

        {/* Category Filters with Suspense */}
        <Suspense fallback={<div className="text-center text-gray-600">Loading filters...</div>}>
          <SearchParamsWrapper
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            selectedCategory={activeCategory}
            selectedSort={selectedSort}
          />
        </Suspense>

        {/* Render categories */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat._id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 text-sm sm:text-base ${
                activeCategory === cat._id
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 shadow-md hover:shadow-lg hover:bg-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="h-32 sm:h-48 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-5 sm:h-6 bg-gray-400 rounded mb-3 sm:mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-400 rounded w-1/2"></div>
                  <div className="flex items-center mt-3 sm:mt-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-400 rounded-full mr-2"></div>
                    <div className="h-2 sm:h-3 bg-gray-400 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : displayedStories.length > 0 ? (
            displayedStories.map((story) => (
              <div key={story._id} className="transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                <StoryCard story={story} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 sm:py-16 bg-gray-200 rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full mb-4 sm:mb-6">
                <FiBookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">No stories found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                Try selecting a different category or check back later for new content.
              </p>
              <button
                onClick={() => handleCategoryChange('all')}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                View All Stories
              </button>
            </div>
          )}
        </div>

        {!showAll && stories.length > initialCards.length && (
          <div className="text-center mt-10 sm:mt-14">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              View More Stories
            </button>
          </div>
        )}
      </section>

      {featuredStory && (
        <section className="bg-gradient-to-r from-gray-600 to-gray-700 py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Featured Story</h2>
              <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg">
                Discover this week&apos;s standout story selected by our editorial team.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <FeaturedStoryCard story={featuredStory} />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-8 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">Ready to Share Your Story?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg">
            Join our community of writers and readers. Share your thoughts, stories, and ideas with the world.
          </p>
          <div className="flex flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/auth/register" prefetch={true}>
              <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 text-sm sm:text-base">
                Sign Up Now
              </span>
            </Link>
            <Link href="/about" prefetch={true}>
              <span className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-600 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base">
                Learn More
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}