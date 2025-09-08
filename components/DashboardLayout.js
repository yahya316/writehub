'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './SearchBar';
import {
  FaHome, FaUsers, FaEdit, FaUserCircle, FaTachometerAlt, FaCog, FaHeart, FaClipboardList,
  FaSignOutAlt, FaBars, FaSearch, FaCommentDots, FaAngleLeft, FaAngleRight, FaBookOpen, FaPencilAlt
} from 'react-icons/fa';

// Dynamically import Sidebar for client-side rendering
const Sidebar = dynamic(() => Promise.resolve(({ isOpen, toggleSidebar, role }) => {
  const adminNavItems = [
    { name: 'Homepage', icon: FaHome, href: '/' },
    { name: 'Dashboard', icon: FaTachometerAlt, href: '/dashboard' },
    { name: 'View Content', icon: FaBookOpen, href: '/story' },
    { name: 'Create Content', icon: FaPencilAlt, href: '/content' },
    { name: 'Manage Category', icon: FaCog, href: '/category' },
    { name: 'Users', icon: FaUsers, href: '/users' },
  ];
  const userNavItems = [
    { name: 'Homepage', icon: FaHome, href: '/' },
    { name: 'Dashboard', icon: FaTachometerAlt, href: '/dashboard' },
    { name: 'View Content', icon: FaBookOpen, href: '/story' },
    { name: 'Favorites', icon: FaHeart, href: '/favorites' },
    { name: 'Profile', icon: FaUserCircle, href: '/profile' },
    { name: 'Comments', icon: FaCommentDots, href: '/comments' },
  ];
  const navItems = role === 'admin' ? adminNavItems : userNavItems;
  const panelTitle = role === 'admin' ? 'Admin Panel' : 'User Panel';

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform 
      transition-all duration-300 ease-in-out z-30 overflow-y-auto
      ${isOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full sm:translate-x-0 sm:w-16'}`}
    >
      <div className="p-5 flex items-center justify-between border-b border-gray-700">
        {isOpen && <h1 className="text-xl font-bold truncate text-white">{panelTitle}</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <FaAngleLeft className="w-4 h-4 text-gray-300" /> : <FaAngleRight className="w-4 h-4 text-gray-300" />}
        </button>
      </div>
      <nav className="mt-6 px-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            prefetch={true}
            className={`flex items-center px-4 py-3 my-1 rounded-lg text-gray-300 
            hover:bg-gray-700 hover:text-white transition-all duration-200
            ${isOpen ? '' : 'justify-center'}`}
            title={item.name}
          >
            <item.icon className="w-5 h-5 min-w-[20px] text-gray-400" />
            {isOpen && <span className="ml-3 text-sm font-medium truncate">{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={`flex items-center w-full px-4 py-3 rounded-lg text-gray-300 
          hover:bg-gray-700 hover:text-white cursor-pointer transition-colors duration-200
          ${isOpen ? '' : 'justify-center'}`}
          title="Logout"
        >
          <FaSignOutAlt className="w-5 h-5 min-w-[20px] text-gray-400" />
          {isOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}), { ssr: false });

const Header = ({ toggleSidebar, session, isSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close profile dropdown when route changes
  useEffect(() => {
    setIsProfileOpen(false);
  }, [router]);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors sm:hidden"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FaBars className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center mr-3">
                <FaTachometerAlt className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            </div>
          </div>
          <div className="flex items-center space-x-3 sm:flex-1 sm:justify-end">
            <div className="relative sm:items-center sm:w-80 hidden sm:block">
              <SearchBar />
            </div>
            <div className="relative" ref={profileRef}>
              <button
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={handleProfileClick}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                {session?.user?.image ? (
                  <div className="w-8 h-8 relative">
                    <Image
                      src={session.user.image}
                      alt="User Profile"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                      quality={80}
                      onError={() => console.error('Failed to load user profile image')}
                    />
                  </div>
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-medium text-gray-800 truncate">{session?.user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{session?.user?.email || ''}</p>
                  </div>
                  <Link
                    href="/profile"
                    prefetch={true}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaUserCircle className="w-4 h-4 mr-2 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    href="#"
                    prefetch={true}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaCog className="w-4 h-4 mr-2 text-gray-500" />
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2 text-gray-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 sm:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default function DashboardLayout({ children, session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 640) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} role={session?.user?.role} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out
        ${isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
        <Header toggleSidebar={toggleSidebar} session={session} isSidebarOpen={sidebarOpen} />
        <main className="p-2 sm:p-2 max-w-7xl mx-auto w-full text-gray-800">
          <div className="bg-white rounded-lg shadow-sm sm:p-2 border border-gray-200">
            {children}
          </div>
        </main>
      </div>
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}