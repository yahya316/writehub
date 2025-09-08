// components/MyCommentsList.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MyCommentsList({ initialComments }) {
  const [comments, setComments] = useState(JSON.parse(initialComments));
  const [editingId, setEditingId] = useState(null);
  const [editingBody, setEditingBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEditClick = (comment) => {
    setEditingId(comment._id);
    setEditingBody(comment.body || comment.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: editingBody }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update comment');
      }

      setComments(
        comments.map((c) => 
          c._id === editingId ? { ...c, body: editingBody, updatedAt: new Date().toISOString() } : c
        )
      );
      setEditingId(null);
      setEditingBody('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }
      
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <ul className="divide-y divide-gray-200">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment._id} className="py-4">
              {editingId === comment._id ? (
                <form onSubmit={handleUpdate} className="flex flex-col">
                  <textarea
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editingBody}
                    onChange={(e) => setEditingBody(e.target.value)}
                    rows="4"
                    required
                  ></textarea>
                  <div className="mt-2 flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditingBody('');
                        setError(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    {comment.story ? (
                      <Link 
                        href={`/story/${comment.story.slug}`} 
                        className="font-semibold text-lg text-blue-600 hover:underline"
                      >
                        Re: {comment.story.title}
                      </Link>
                    ) : (
                      <span className="font-semibold text-lg text-gray-500">
                        Re: [Story no longer available]
                      </span>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(comment)}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {comment.body || comment.content}
                  </p>
                  <span className="text-sm text-gray-500 block mt-2">
                    Posted on {new Date(comment.createdAt).toLocaleDateString()}
                    {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                      <span className="ml-2">
                        (edited on {new Date(comment.updatedAt).toLocaleDateString()})
                      </span>
                    )}
                  </span>
                </>
              )}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">You have not posted any comments yet.</p>
        )}
      </ul>
    </div>
  );
}