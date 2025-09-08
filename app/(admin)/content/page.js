// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import dynamic from 'next/dynamic';
// import Link from 'next/link';
// import { 
//   FiEdit, 
//   FiTrash2, 
//   FiSave, 
//   FiCalendar, 
//   FiGlobe, 
//   FiFolder, 
//   FiType, 
//   FiClock,
//   FiFileText,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiRefreshCw,
//   FiPlus,
//   FiX,
//   FiEye,
//   FiEyeOff,
//   FiList
// } from 'react-icons/fi';

// const Tiptap = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

// export default function ContentManagementPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [stories, setStories] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [title, setTitle] = useState('');
//   const [body, setBody] = useState('');
//   const [category, setCategory] = useState('');
//   const [visibility, setVisibility] = useState('public');
//   const [publishDate, setPublishDate] = useState('');
//   const [editingStory, setEditingStory] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState({ fetch: false, submit: false, delete: null });
//   const [saveStatus, setSaveStatus] = useState('');
//   const [currentDraftId, setCurrentDraftId] = useState(null);
//   const [activeTab, setActiveTab] = useState('create');

//   const fetchContentData = useCallback(async () => {
//     try {
//       setLoading((prev) => ({ ...prev, fetch: true }));
//       setError(null);
//       const storiesRes = await fetch('/api/stories/all', { cache: 'no-store' });
//       const categoriesRes = await fetch('/api/categories', { cache: 'no-store' });

//       if (!storiesRes.ok) throw new Error('Failed to fetch stories.');
//       if (!categoriesRes.ok) throw new Error('Failed to fetch categories.');

//       const storiesData = await storiesRes.json();
//       const categoriesData = await categoriesRes.json();

//       setStories(storiesData.stories || []);
//       setCategories(categoriesData.categories || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading((prev) => ({ ...prev, fetch: false }));
//     }
//   }, []);

//   useEffect(() => {
//     if (status === 'authenticated') fetchContentData();
//   }, [status, fetchContentData]);

//   const handleAutosave = useCallback(async () => {
//     if (!title.trim() && !body.trim()) return;

//     setSaveStatus('Autosaving...');

//     const data = {
//       title,
//       body,
//       visibility,
//       publishDate,
//       isDraft: true,
//       ...(category && { category }),
//     };

//     try {
//       const url = currentDraftId ? `/api/stories/${currentDraftId}` : '/api/stories';
//       const method = currentDraftId ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       if (!res.ok) throw new Error('Autosave failed.');

//       const result = await res.json();
//       setSaveStatus('Draft saved.');
//       if (result.story?._id) {
//         setCurrentDraftId(result.story._id);
//         fetchContentData(); // Refresh stories list
//       }
//     } catch (error) {
//       setSaveStatus('Autosave failed.');
//       console.error('Autosave error:', error);
//     }
//   }, [title, body, visibility, publishDate, category, currentDraftId, fetchContentData]);

//   useEffect(() => {
//     if (title || body) {
//       const timer = setTimeout(async () => {
//         await handleAutosave();
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [title, body, handleAutosave]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading((prev) => ({ ...prev, submit: true }));
//     setError(null);
//     setSaveStatus('');

//     const url = currentDraftId ? `/api/stories/${currentDraftId}` : '/api/stories';
//     const method = currentDraftId ? 'PUT' : 'POST';

//     const data = {
//       title,
//       body,
//       category,
//       visibility,
//       publishDate,
//       isDraft: false,
//     };

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });

//       if (!res.ok) throw new Error('Failed to publish story.');

//       setTitle('');
//       setBody('');
//       setCategory('');
//       setVisibility('public');
//       setPublishDate('');
//       setEditingStory(null);
//       setCurrentDraftId(null);
//       fetchContentData();
//       setSaveStatus('Story published successfully!');
//       setTimeout(() => setSaveStatus(''), 3000);
//       router.push('/content'); // Redirect to content page
//     } catch (err) {
//       setError(err.message);
//       setSaveStatus('Publication failed.');
//     } finally {
//       setLoading((prev) => ({ ...prev, submit: false }));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this story?')) return;

//     setLoading((prev) => ({ ...prev, delete: id }));
//     setError(null);

//     try {
//       const res = await fetch(`/api/stories/${id}`, { method: 'DELETE', cache: 'no-store' });
//       if (!res.ok) throw new Error('Failed to delete story.');
//       fetchContentData();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading((prev) => ({ ...prev, delete: null }));
//     }
//   };

//   const handleEdit = (story) => {
//     setEditingStory(story);
//     setTitle(story.title || '');
//     setBody(story.body || '');
//     setCategory(story.category?._id || '');
//     setVisibility(story.visibility || 'public');
//     setCurrentDraftId(story._id);

//     if (story.publishDate) {
//       const date = new Date(story.publishDate);
//       const offsetMs = date.getTimezoneOffset() * 60000;
//       const localDate = new Date(date.getTime() - offsetMs);
//       const formattedDate = localDate.toISOString().slice(0, 16);
//       setPublishDate(formattedDate);
//     } else {
//       setPublishDate('');
//     }

//     setSaveStatus('');
//     setActiveTab('create');
//   };

//   const resetForm = () => {
//     setTitle('');
//     setBody('');
//     setCategory('');
//     setVisibility('public');
//     setPublishDate('');
//     setEditingStory(null);
//     setCurrentDraftId(null);
//     setSaveStatus('');
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === 'create') resetForm();
//   };

//   if (status === 'loading') {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
//           <p className="text-lg font-medium text-gray-700">Authenticating...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session?.user) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
//           <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in to access content management.</p>
//           <Link
//             href="/auth/signin"
//             className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Sign In
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-1">Content Management</h1>
//             <p className="text-gray-600">Create and manage your stories and articles</p>
//           </div>
//           <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
//             <button
//               onClick={() => handleTabChange('create')}
//               className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${
//                 activeTab === 'create' 
//                   ? 'bg-white text-indigo-700 shadow-sm' 
//                   : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               <FiPlus className="w-4 h-4" />
//               Create
//             </button>
//             <button
//               onClick={() => handleTabChange('manage')}
//               className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${
//                 activeTab === 'manage' 
//                   ? 'bg-white text-indigo-700 shadow-sm' 
//                   : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               <FiList className="w-4 h-4" />
//               Manage
//             </button>
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
//             <div className="flex items-center">
//               <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//             <button
//               onClick={fetchContentData}
//               className="ml-4 flex items-center gap-1 text-sm text-red-600 hover:text-red-800 bg-red-100 px-2 py-1 rounded-md"
//             >
//               <FiRefreshCw className="w-3 h-3" />
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Create Content Tab */}
//         {activeTab === 'create' && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//             <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 {editingStory ? (
//                   <>
//                     <FiEdit className="w-5 h-5 text-indigo-600" />
//                     Edit Story
//                   </>
//                 ) : (
//                   <>
//                     <FiPlus className="w-5 h-5 text-indigo-600" />
//                     Create New Content
//                   </>
//                 )}
//               </h2>
//               {editingStory && (
//                 <button
//                   onClick={resetForm}
//                   className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md"
//                 >
//                   <FiX className="w-4 h-4" />
//                   Cancel Edit
//                 </button>
//               )}
//             </div>

//             <div className="p-6">
//               {/* Save Status */}
//               {saveStatus && (
//                 <div className={`mb-5 p-3 rounded-lg flex items-center text-sm ${
//                   saveStatus.includes('failed') 
//                     ? 'bg-red-50 text-red-700 border border-red-200' 
//                     : 'bg-green-50 text-green-700 border border-green-200'
//                 }`}>
//                   {saveStatus.includes('failed') ? (
//                     <FiAlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
//                   ) : (
//                     <FiCheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
//                   )}
//                   {saveStatus}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FiType className="w-4 h-4 mr-2 text-gray-500" />
//                       Title
//                     </label>
//                     <input
//                       id="title"
//                       type="text"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                       value={title}
//                       onChange={(e) => setTitle(e.target.value)}
//                       required
//                       placeholder="Enter story title"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FiFolder className="w-4 h-4 mr-2 text-gray-500" />
//                       Category
//                     </label>
//                     <select
//                       id="category"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                       required
//                     >
//                       <option value="" disabled>Select a category</option>
//                       {categories.map((cat) => (
//                         <option key={cat._id} value={cat._id}>{cat.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="body" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <FiFileText className="w-4 h-4 mr-2 text-gray-500" />
//                     Content
//                   </label>
//                   <div className="border border-gray-300 rounded-lg overflow-hidden">
//                     <Tiptap content={body} onChange={setBody} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label htmlFor="visibility" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       {visibility === 'public' ? (
//                         <FiEye className="w-4 h-4 mr-2 text-gray-500" />
//                       ) : (
//                         <FiEyeOff className="w-4 h-4 mr-2 text-gray-500" />
//                       )}
//                       Visibility
//                     </label>
//                     <select
//                       id="visibility"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                       value={visibility}
//                       onChange={(e) => setVisibility(e.target.value)}
//                     >
//                       <option value="public">Public</option>
//                       <option value="private">Private</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label htmlFor="publishDate" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                       <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
//                       Publish Date & Time
//                     </label>
//                     <input
//                       id="publishDate"
//                       type="datetime-local"
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//                       value={publishDate}
//                       onChange={(e) => setPublishDate(e.target.value)}
//                     />
//                     <p className="text-xs text-gray-500 mt-2 flex items-center">
//                       <FiClock className="w-3 h-3 mr-1" />
//                       Leave blank to publish immediately
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
//                   <div className="text-sm text-gray-500 flex items-center">
//                     {title || body ? (
//                       <>
//                         <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
//                         Draft autosaves every 5 seconds
//                       </>
//                     ) : (
//                       'Start typing to enable autosave'
//                     )}
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={loading.submit}
//                     className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
//                   >
//                     {loading.submit ? (
//                       <>
//                         <div className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
//                         Publishing...
//                       </>
//                     ) : (
//                       <>
//                         <FiSave className="w-4 h-4" />
//                         {editingStory ? 'Update Story' : 'Publish Story'}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Manage Content Tab */}
//         {activeTab === 'manage' && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
//               <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//                 <FiList className="w-5 h-5 text-indigo-600" />
//                 Manage Content
//               </h2>
//             </div>
            
//             <div className="p-6">
//               {loading.fetch ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="w-8 h-8 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
//                     <p className="text-gray-600">Loading your content...</p>
//                   </div>
//                 </div>
//               ) : stories.length > 0 ? (
//                 <div className="overflow-hidden rounded-lg border border-gray-200">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Title
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Visibility
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {stories.map((story) => (
//                         <tr key={story._id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4">
//                             <Link
//                               href={`/story/${story.slug || story._id}`}
//                               prefetch={true}
//                               className="text-sm font-medium text-indigo-600 hover:text-indigo-800 truncate block max-w-xs"
//                               title={story.title}
//                             >
//                               {story.title}
//                             </Link>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex items-center">
//                               {story.isDraft ? (
//                                 <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
//                                   Draft
//                                 </span>
//                               ) : story.publishDate && new Date(story.publishDate) > new Date() ? (
//                                 <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
//                                   Scheduled
//                                 </span>
//                               ) : (
//                                 <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
//                                   Published
//                                 </span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
//                               story.visibility === 'public' 
//                                 ? 'bg-blue-100 text-blue-800' 
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}>
//                               {story.visibility}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleEdit(story)}
//                                 className="p-2 text-indigo-600 hover:text-indigo-900 rounded-md hover:bg-indigo-50 transition-colors"
//                                 title="Edit"
//                                 disabled={loading.delete === story._id}
//                               >
//                                 <FiEdit className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(story._id)}
//                                 className="p-2 text-red-600 hover:text-red-900 rounded-md hover:bg-red-50 transition-colors"
//                                 title="Delete"
//                                 disabled={loading.delete === story._id}
//                               >
//                                 {loading.delete === story._id ? (
//                                   <div className="w-4 h-4 border-t-2 border-r-2 border-red-600 rounded-full animate-spin"></div>
//                                 ) : (
//                                   <FiTrash2 className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                   <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-700 mb-2">No content yet</h3>
//                   <p className="text-gray-500 mb-4">Start by creating your first story!</p>
//                   <button
//                     onClick={() => handleTabChange('create')}
//                     className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
//                   >
//                     <FiPlus className="w-4 h-4" />
//                     Create Story
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiCalendar, 
  FiGlobe, 
  FiFolder, 
  FiType, 
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiPlus,
  FiX,
  FiEye,
  FiEyeOff,
  FiList
} from 'react-icons/fi';

// Dynamically import Tiptap editor
const Tiptap = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

export default function ContentManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [publishDate, setPublishDate] = useState('');
  const [editingStory, setEditingStory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ fetch: false, submit: false, delete: null });
  const [saveStatus, setSaveStatus] = useState('');
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

  const fetchContentData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      setError(null);
      const storiesRes = await fetch('/api/stories/all', { cache: 'no-store' });
      const categoriesRes = await fetch('/api/categories', { cache: 'no-store' });

      if (!storiesRes.ok) throw new Error('Failed to fetch stories.');
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories.');

      const storiesData = await storiesRes.json();
      const categoriesData = await categoriesRes.json();

      setStories(storiesData.stories || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchContentData();
  }, [status, fetchContentData]);

  const handleAutosave = useCallback(async () => {
    if (!title.trim() && !body.trim()) return;

    setSaveStatus('Autosaving...');

    const data = {
      title,
      body,
      visibility,
      publishDate,
      isDraft: true,
      ...(category && { category }),
    };

    try {
      const url = currentDraftId ? `/api/stories/${currentDraftId}` : '/api/stories';
      const method = currentDraftId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Autosave failed.');

      const result = await res.json();
      setSaveStatus('Draft saved.');
      if (result.story?._id) {
        setCurrentDraftId(result.story._id);
        fetchContentData(); // Refresh stories list
      }
    } catch (error) {
      setSaveStatus('Autosave failed.');
      console.error('Autosave error:', error);
    }
  }, [title, body, visibility, publishDate, category, currentDraftId, fetchContentData]);

  useEffect(() => {
    if (title || body) {
      const timer = setTimeout(async () => {
        await handleAutosave();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [title, body, handleAutosave]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submit: true }));
    setError(null);
    setSaveStatus('');

    const url = currentDraftId ? `/api/stories/${currentDraftId}` : '/api/stories';
    const method = currentDraftId ? 'PUT' : 'POST';

    const data = {
      title,
      body,
      category,
      visibility,
      publishDate,
      isDraft: false,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to publish story.');

      setTitle('');
      setBody('');
      setCategory('');
      setVisibility('public');
      setPublishDate('');
      setEditingStory(null);
      setCurrentDraftId(null);
      fetchContentData();
      setSaveStatus('Story published successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
      router.push('/content'); // Redirect to content page
    } catch (err) {
      setError(err.message);
      setSaveStatus('Publication failed.');
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    setLoading((prev) => ({ ...prev, delete: id }));
    setError(null);

    try {
      const res = await fetch(`/api/stories/${id}`, { method: 'DELETE', cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to delete story.');
      fetchContentData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setTitle(story.title || '');
    setBody(story.body || '');
    setCategory(story.category?._id || '');
    setVisibility(story.visibility || 'public');
    setCurrentDraftId(story._id);

    if (story.publishDate) {
      const date = new Date(story.publishDate);
      const offsetMs = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offsetMs);
      const formattedDate = localDate.toISOString().slice(0, 16);
      setPublishDate(formattedDate);
    } else {
      setPublishDate('');
    }

    setSaveStatus('');
    setActiveTab('create');
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setCategory('');
    setVisibility('public');
    setPublishDate('');
    setEditingStory(null);
    setCurrentDraftId(null);
    setSaveStatus('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'create') resetForm();
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center mx-4">
          <FiAlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-sm text-gray-600 mb-4">Please log in to access content management.</p>
          <Link
            href="/auth/signin"
            className="inline-block px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-3 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Content Management</h1>
            <p className="text-xs sm:text-sm text-gray-600">Create and manage your stories</p>
          </div>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => handleTabChange('create')}
              className={`px-3 py-2 text-xs sm:text-sm rounded-md font-medium flex items-center gap-1 transition-colors flex-1 justify-center ${
                activeTab === 'create' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Create</span>
            </button>
            <button
              onClick={() => handleTabChange('manage')}
              className={`px-3 py-2 text-xs sm:text-sm rounded-md font-medium flex items-center gap-1 transition-colors flex-1 justify-center ${
                activeTab === 'manage' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiList className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Manage</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchContentData}
              className="ml-2 flex items-center gap-1 text-xs text-red-600 hover:text-red-800 bg-red-100 px-2 py-1 rounded-md"
            >
              <FiRefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Create Content Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-4 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {editingStory ? (
                  <>
                    <FiEdit className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm sm:text-base">Edit Story</span>
                  </>
                ) : (
                  <>
                    <FiPlus className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm sm:text-base">Create New</span>
                  </>
                )}
              </h2>
              {editingStory && (
                <button
                  onClick={resetForm}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md"
                >
                  <FiX className="w-3 h-3" />
                  Cancel
                </button>
              )}
            </div>

            <div className="p-4">
              {/* Save Status */}
              {saveStatus && (
                <div className={`mb-4 p-2 rounded-lg flex items-center text-xs ${
                  saveStatus.includes('failed') 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {saveStatus.includes('failed') ? (
                    <FiAlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  ) : (
                    <FiCheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  )}
                  {saveStatus}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="title" className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <FiType className="w-3 h-3 mr-1 text-gray-500" />
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="Enter story title"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <FiFolder className="w-3 h-3 mr-1 text-gray-500" />
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="body" className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                    <FiFileText className="w-3 h-3 mr-1 text-gray-500" />
                    Content
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <Tiptap content={body} onChange={setBody} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="visibility" className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      {visibility === 'public' ? (
                        <FiEye className="w-3 h-3 mr-1 text-gray-500" />
                      ) : (
                        <FiEyeOff className="w-3 h-3 mr-1 text-gray-500" />
                      )}
                      Visibility
                    </label>
                    <select
                      id="visibility"
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="publishDate" className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <FiCalendar className="w-3 h-3 mr-1 text-gray-500" />
                      Publish Date & Time
                    </label>
                    <input
                      id="publishDate"
                      type="datetime-local"
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <FiClock className="w-3 h-3 mr-1" />
                      Leave blank to publish immediately
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-3">
                  <div className="text-xs text-gray-500 flex items-center">
                    {title || body ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Draft autosaves every 5 seconds
                      </>
                    ) : (
                      'Start typing to enable autosave'
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading.submit}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors shadow-sm w-full sm:w-auto justify-center"
                  >
                    {loading.submit ? (
                      <>
                        <div className="w-3 h-3 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-3 h-3" />
                        {editingStory ? 'Update Story' : 'Publish Story'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Content Tab */}
        {activeTab === 'manage' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiList className="w-4 h-4 text-indigo-600" />
                <span className="text-sm sm:text-base">Manage Content</span>
              </h2>
            </div>
            
            <div className="p-4">
              {loading.fetch ? (
                <div className="flex justify-center items-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-t-2 border-r-2 border-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-600">Loading your content...</p>
                  </div>
                </div>
              ) : stories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Visibility
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stories.map((story) => (
                        <tr key={story._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 max-w-[120px] sm:max-w-xs truncate">
                            <Link
                              href={`/story/${story.slug || story._id}`}
                              prefetch={true}
                              className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 truncate block"
                              title={story.title}
                            >
                              {story.title}
                            </Link>
                          </td>
                          <td className="px-3 py-3 hidden sm:table-cell">
                            <div className="flex items-center">
                              {story.isDraft ? (
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                  Draft
                                </span>
                              ) : story.publishDate && new Date(story.publishDate) > new Date() ? (
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  Scheduled
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Published
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              story.visibility === 'public' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {story.visibility}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEdit(story)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-900 rounded-md hover:bg-indigo-50 transition-colors"
                                title="Edit"
                                disabled={loading.delete === story._id}
                              >
                                <FiEdit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(story._id)}
                                className="p-1.5 text-red-600 hover:text-red-900 rounded-md hover:bg-red-50 transition-colors"
                                title="Delete"
                                disabled={loading.delete === story._id}
                              >
                                {loading.delete === story._id ? (
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
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <FiFileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-700 mb-2">No content yet</h3>
                  <p className="text-xs text-gray-500 mb-4">Start by creating your first story!</p>
                  <button
                    onClick={() => handleTabChange('create')}
                    className="px-4 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 mx-auto"
                  >
                    <FiPlus className="w-3 h-3" />
                    Create Story
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}