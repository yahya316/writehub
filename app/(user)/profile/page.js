// app/user/dashboard/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiSave, 
  FiKey, 
  FiEdit3, 
  FiCalendar,
  FiAward,
  FiBook,
  FiHeart,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiEye,
  FiEyeOff,
  FiSettings,
  FiBarChart2,
  FiChevronRight,
  FiStar,
  FiTrendingUp,
  FiClock
} from 'react-icons/fi';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Initialize form fields with session data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const stats = await res.json();
          setUserStats(stats);
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    if (session?.user) {
      fetchUserStats();
    }
  }, [session]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    try {
      const res = await fetch(`/api/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Failed to update profile.');
      
      const updatedUser = await res.json();
      await update({ user: updatedUser.user });
      setStatusMessage('Profile updated successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setPasswordStatus('');

    if (newPassword.length < 6) {
      setPasswordStatus('New password must be at least 6 characters long.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) throw new Error('Failed to change password.');
      
      setPasswordStatus('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordStatus(''), 3000);
    } catch (error) {
      setPasswordStatus(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <FiSettings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Profile Settings</h1>
              <p className="text-gray-600 text-lg">Manage your account and preferences</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 font-medium">{session?.user?.role || 'User'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Navigation</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    activeTab === 'profile'
                      ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      activeTab === 'profile' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      <FiUser className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </div>
                  <FiChevronRight className={`w-4 h-4 transition-transform ${
                    activeTab === 'profile' ? 'rotate-90 text-indigo-600' : 'text-gray-400'
                  }`} />
                </button>
                
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    activeTab === 'password'
                      ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      activeTab === 'password' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      <FiKey className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Password</span>
                  </div>
                  <FiChevronRight className={`w-4 h-4 transition-transform ${
                    activeTab === 'password' ? 'rotate-90 text-indigo-600' : 'text-gray-400'
                  }`} />
                </button>
                
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    activeTab === 'stats'
                      ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      activeTab === 'stats' 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      <FiBarChart2 className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Statistics</span>
                  </div>
                  <FiChevronRight className={`w-4 h-4 transition-transform ${
                    activeTab === 'stats' ? 'rotate-90 text-indigo-600' : 'text-gray-400'
                  }`} />
                </button>
              </nav>

              {/* Quick Stats */}
              {userStats && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 px-2">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Stories</span>
                      <span className="font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md text-sm">
                        {userStats.storiesCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Likes</span>
                      <span className="font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-md text-sm">
                        {userStats.totalLikes}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Comments</span>
                      <span className="font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-md text-sm">
                        {userStats.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2 flex items-center">
                        <FiUser className="w-6 h-6 mr-3" />
                        Profile Information
                      </h2>
                      <p className="text-indigo-100">Update your personal details and contact information</p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <FiUser className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <FiUser className="w-4 h-4 mr-2 text-indigo-500" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <FiMail className="w-4 h-4 mr-2 text-indigo-500" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiClock className="w-4 h-4 mr-2" />
                        Last updated: {new Date().toLocaleDateString()}
                      </div>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                      >
                        {isSaving ? (
                          <>
                            <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4 mr-2" />
                            Update Profile
                          </>
                        )}
                      </button>
                    </div>

                    {statusMessage && (
                      <div className={`p-4 rounded-xl flex items-center ${
                        statusMessage.includes('success') 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {statusMessage.includes('success') ? (
                          <FiCheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        ) : (
                          <FiAlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">{statusMessage}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Password Change Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2 flex items-center">
                        <FiKey className="w-6 h-6 mr-3" />
                        Change Password
                      </h2>
                      <p className="text-gray-300">Secure your account with a new password</p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <FiLock className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <FiLock className="w-4 h-4 mr-2 text-gray-500" />
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm pr-12"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <FiEyeOff className="w-5 h-5" />
                            ) : (
                              <FiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <FiKey className="w-4 h-4 mr-2 text-gray-500" />
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm pr-12"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <FiEyeOff className="w-5 h-5" />
                            ) : (
                              <FiEye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Must be at least 6 characters long
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
                      <div className="text-sm text-gray-500">
                        Last changed: {new Date().toLocaleDateString()}
                      </div>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-xl hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                      >
                        {isSaving ? (
                          <>
                            <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                            Changing...
                          </>
                        ) : (
                          <>
                            <FiEdit3 className="w-4 h-4 mr-2" />
                            Change Password
                          </>
                        )}
                      </button>
                    </div>

                    {passwordStatus && (
                      <div className={`p-4 rounded-xl flex items-center ${
                        passwordStatus.includes('success') 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {passwordStatus.includes('success') ? (
                          <FiCheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        ) : (
                          <FiAlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">{passwordStatus}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && userStats && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2 flex items-center">
                        <FiBarChart2 className="w-6 h-6 mr-3" />
                        Your Statistics
                      </h2>
                      <p className="text-green-100">Track your progress and engagement metrics</p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <FiTrendingUp className="w-7 h-7" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                          <FiBook className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-indigo-600">{userStats.storiesCount}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Stories Published</h3>
                      <p className="text-gray-600 text-sm">Your creative contributions to the community</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                          <FiHeart className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-red-600">{userStats.totalLikes}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Likes</h3>
                      <p className="text-gray-600 text-sm">Appreciation from readers</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                          <FiMessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-blue-600">{userStats.commentsCount}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Comments</h3>
                      <p className="text-gray-600 text-sm">Engagement with your stories</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiStar className="w-5 h-5 mr-2 text-yellow-500" />
                      Activity Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Member since</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(session?.user?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Account role</span>
                        <span className="font-semibold text-indigo-600 capitalize px-3 py-1 bg-indigo-100 rounded-full text-sm">
                          {session?.user?.role || 'user'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-600 font-medium">Last activity</span>
                        <span className="font-semibold text-gray-900">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}