'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiUsers, 
  FiUser, 
  FiMail, 
  FiShield, 
  FiTrash2, 
  FiEdit3,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiFilter,
  FiLoader
} from 'react-icons/fi';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error('Failed to fetch users.');
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole, userName) => {
    if (!window.confirm(`Are you sure you want to change ${userName}'s role to ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role.');
      setSuccess(`Successfully updated ${userName}'s role to ${newRole}`);
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete user.');
      setSuccess(`Successfully deleted user ${userName}`);
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Users</h2>
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <FiUsers className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage user roles and permissions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </span>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <div className="w-5 h-5 mr-2">⚠️</div>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <div className="w-5 h-5 mr-2">✅</div>
            {success}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400 w-5 h-5" />
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiUser className="w-5 h-5 mr-2 text-indigo-600" />
              Users List
            </h2>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiMail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <FiShield className="w-3 h-3 mr-1" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {user.role === 'user' ? (
                            <button
                              onClick={() => handleChangeRole(user._id, 'admin', user.name)}
                              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              title="Make Admin"
                            >
                              <FiArrowUp className="w-4 h-4 mr-1" />
                              Promote
                            </button>
                          ) : (
                            <button
                              onClick={() => handleChangeRole(user._id, 'user', user.name)}
                              className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              title="Revoke Admin"
                            >
                              <FiArrowDown className="w-4 h-4 mr-1" />
                              Demote
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No users have been registered yet'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}