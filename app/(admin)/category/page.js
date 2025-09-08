// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { 
//   FiEdit, 
//   FiTrash2, 
//   FiPlus, 
//   FiX, 
//   FiFolder, 
//   FiSave,
//   FiAlertCircle,
//   FiCheckCircle,
//   FiRefreshCw // Added for retry button
// } from 'react-icons/fi';

// export default function CategoriesPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState('');
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState({ fetch: false, submit: false, delete: null });
//   const [success, setSuccess] = useState('');

//   // Function to fetch all categories from the API
//   const fetchCategories = useCallback(async () => {
//     try {
//       setLoading((prev) => ({ ...prev, fetch: true }));
//       setError(null);
//       const res = await fetch('/api/categories', { cache: 'no-store' });
//       if (!res.ok) throw new Error('Failed to fetch categories');
//       const data = await res.json();
//       setCategories(data.categories || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading((prev) => ({ ...prev, fetch: false }));
//     }
//   }, []);

//   useEffect(() => {
//     if (status === 'authenticated') fetchCategories();
//   }, [status, fetchCategories]);

//   // Debounced form submission to prevent multiple rapid submissions
//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
//     if (loading.submit) return;

//     setLoading((prev) => ({ ...prev, submit: true }));
//     setError(null);
//     setSuccess('');

//     const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
//     const method = editingCategory ? 'PUT' : 'POST';

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: newCategory.trim() }),
//       });

//       if (!res.ok) throw new Error('Failed to save category');

//       setNewCategory('');
//       setEditingCategory(null);
//       setSuccess(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
//       fetchCategories();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading((prev) => ({ ...prev, submit: false }));
//     }
//   }, [newCategory, editingCategory, fetchCategories]);

//   // Debounced deletion to prevent multiple rapid clicks
//   const handleDelete = useCallback(async (id) => {
//     if (loading.delete || !window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

//     setLoading((prev) => ({ ...prev, delete: id }));
//     setError(null);
//     setSuccess('');

//     try {
//       const res = await fetch(`/api/categories/${id}`, { 
//         method: 'DELETE', 
//         cache: 'no-store' 
//       });

//       if (!res.ok) throw new Error('Failed to delete category');

//       setSuccess('Category deleted successfully!');
//       fetchCategories();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading((prev) => ({ ...prev, delete: null }));
//     }
//   }, [fetchCategories]);

//   const cancelEdit = () => {
//     setEditingCategory(null);
//     setNewCategory('');
//   };

//   if (status === 'loading') {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="flex items-center gap-2">
//           <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
//           <p className="text-xl font-medium text-gray-800">Authenticating...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session?.user) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-xl font-medium text-red-500">Please log in to access category management.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-4xl">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
//               <FiFolder className="w-6 h-6 text-indigo-600" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
//               <p className="text-gray-600">Create and manage content categories</p>
//             </div>
//           </div>
//         </div>

//         {/* Notifications */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
//             <FiAlertCircle className="w-5 h-5 mr-2" />
//             {error}
//             <button
//               onClick={fetchCategories}
//               className="ml-4 flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
//               disabled={loading.fetch}
//             >
//               <FiRefreshCw className="w-4 h-4" />
//               Retry
//             </button>
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
//             <FiCheckCircle className="w-5 h-5 mr-2" />
//             {success}
//           </div>
//         )}

//         {/* Add/Edit Category Form */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//             <FiPlus className="w-5 h-5 mr-2 text-indigo-600" />
//             {editingCategory ? 'Edit Category' : 'Add New Category'}
//           </h2>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
//                 Category Name
//               </label>
//               <input
//                 id="categoryName"
//                 type="text"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="Enter category name"
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//                 required
//                 disabled={loading.submit}
//               />
//             </div>
            
//             <div className="flex space-x-3 pt-2">
//               <button
//                 type="submit"
//                 disabled={loading.submit || !newCategory.trim()}
//                 className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {loading.submit ? (
//                   <>
//                     <div className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <FiSave className="w-4 h-4" />
//                     {editingCategory ? 'Update Category' : 'Add Category'}
//                   </>
//                 )}
//               </button>
              
//               {editingCategory && (
//                 <button
//                   type="button"
//                   onClick={cancelEdit}
//                   disabled={loading.submit}
//                   className="px-6 py-3 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
//                 >
//                   <FiX className="w-4 h-4" />
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Category List */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-900 flex items-center">
//               <FiFolder className="w-5 h-5 mr-2 text-indigo-600" />
//               Existing Categories
//             </h2>
//             <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//               {categories.length} {categories.length === 1 ? 'category' : 'categories'}
//             </span>
//           </div>

//           {loading.fetch ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="flex items-center gap-2">
//                 <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
//                 <p className="text-lg text-gray-800">Loading categories...</p>
//               </div>
//             </div>
//           ) : categories.length > 0 ? (
//             <div className="overflow-x-auto rounded-lg border border-gray-200">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {categories.map((category) => (
//                     <tr key={category._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => {
//                               setEditingCategory(category);
//                               setNewCategory(category.name);
//                             }}
//                             className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
//                             title="Edit category"
//                             disabled={loading.delete === category._id}
//                           >
//                             <FiEdit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(category._id)}
//                             className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
//                             title="Delete category"
//                             disabled={loading.delete === category._id}
//                           >
//                             {loading.delete === category._id ? (
//                               <div className="w-4 h-4 border-t-2 border-r-2 border-red-600 rounded-full animate-spin"></div>
//                             ) : (
//                               <FiTrash2 className="w-4 h-4" />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-gray-50 rounded-lg">
//               <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-500 text-lg">No categories created yet.</p>
//               <p className="text-gray-400 mt-2">Add your first category using the form above.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }











'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiX, 
  FiFolder, 
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw // Added for retry button
} from 'react-icons/fi';

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ fetch: false, submit: false, delete: null });
  const [success, setSuccess] = useState('');

  // Function to fetch all categories from the API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      setError(null);
      const res = await fetch('/api/categories', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchCategories();
  }, [status, fetchCategories]);

  // Debounced form submission to prevent multiple rapid submissions
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (loading.submit) return;

    setLoading((prev) => ({ ...prev, submit: true }));
    setError(null);
    setSuccess('');

    const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (!res.ok) throw new Error('Failed to save category');

      setNewCategory('');
      setEditingCategory(null);
      setSuccess(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  }, [newCategory, editingCategory, fetchCategories]);

  // Debounced deletion to prevent multiple rapid clicks
  const handleDelete = useCallback(async (id) => {
    if (loading.delete || !window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

    setLoading((prev) => ({ ...prev, delete: id }));
    setError(null);
    setSuccess('');

    try {
      const res = await fetch(`/api/categories/${id}`, { 
        method: 'DELETE', 
        cache: 'no-store' 
      });

      if (!res.ok) throw new Error('Failed to delete category');

      setSuccess('Category deleted successfully!');
      fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, delete: null }));
    }
  }, [fetchCategories]);

  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategory('');
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-800">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center">
          <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-sm text-gray-600">Please log in to access category management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-3 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <FiFolder className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-xs sm:text-sm text-gray-600">Create and manage content categories</p>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 flex items-center text-xs sm:text-sm">
            <FiAlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={fetchCategories}
              className="ml-2 flex items-center gap-1 text-xs text-red-600 hover:text-red-800 bg-red-100 px-2 py-1 rounded-md"
              disabled={loading.fetch}
            >
              <FiRefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-4 flex items-center text-xs sm:text-sm">
            <FiCheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Add/Edit Category Form */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <FiPlus className="w-4 h-4 mr-2 text-indigo-600" />
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="categoryName" className="block text-xs font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                disabled={loading.submit}
              />
            </div>
            
            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 pt-1">
              <button
                type="submit"
                disabled={loading.submit || !newCategory.trim()}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 justify-center text-sm"
              >
                {loading.submit ? (
                  <>
                    <div className="w-3 h-3 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-3.5 h-3.5" />
                    {editingCategory ? 'Update' : 'Add Category'}
                  </>
                )}
              </button>
              
              {editingCategory && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={loading.submit}
                  className="px-4 py-2 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1 justify-center text-sm"
                >
                  <FiX className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category List */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiFolder className="w-4 h-4 mr-2 text-indigo-600" />
              Existing Categories
            </h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </span>
          </div>

          {loading.fetch ? (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-800">Loading categories...</p>
              </div>
            </div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 max-w-[140px] sm:max-w-xs truncate">
                        <div className="text-sm font-medium text-gray-900 truncate" title={category.name}>
                          {category.name}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setNewCategory(category.name);
                            }}
                            className="p-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Edit category"
                            disabled={loading.delete === category._id}
                          >
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete category"
                            disabled={loading.delete === category._id}
                          >
                            {loading.delete === category._id ? (
                              <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-red-600 rounded-full animate-spin"></div>
                            ) : (
                              <FiTrash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiFolder className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No categories created yet.</p>
              <p className="text-xs text-gray-400 mt-1">Add your first category using the form above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}