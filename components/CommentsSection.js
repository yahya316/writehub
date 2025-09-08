// components/CommentsSection.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaComment, FaTrash, FaExclamationCircle, FaSpinner, FaLock, FaPaperPlane } from 'react-icons/fa';
import { HiUserCircle } from 'react-icons/hi';

export default function CommentsSection({ storyId }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?storyId=${storyId}`);
      if (!res.ok) throw new Error('Failed to fetch comments.');
      const data = await res.json();
      setComments(data.comments);
      setCommentCount(data.comments.length);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, body: newComment }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to post comment.');
      }

      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete comment.');
      }
      
      fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center">
        <FaComment className="mr-2" />
        Comments
        <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {commentCount}
        </span>
      </h2>
      
      {status === 'loading' ? (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-blue-600 text-2xl" />
        </div>
      ) : session ? (
        <form onSubmit={handlePostComment} className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center justify-center">
                {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="flex-grow">
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="4"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={loading}
              ></textarea>
              {error && <p className="text-red-500 text-sm mt-2 flex items-center">
                <FaExclamationCircle className="mr-1" />
                {error}
              </p>}
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className={`px-5 py-2.5 text-white rounded-lg transition-colors flex items-center ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-1" />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center">
          <FaLock className="text-blue-600 mr-2" />
          <p className="text-blue-800">
            <a href="/auth/login" className="font-medium text-blue-700 hover:text-blue-900 underline transition-colors">Log in</a> to post a comment.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-5 rounded-lg border border-gray-200 transition-colors hover:border-gray-300">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center justify-center">
                      {comment.author.name ? comment.author.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                {(session?.user?.id === comment.author._id || session?.user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Delete comment"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-gray-700 pl-13">{comment.body}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 px-4 bg-gray-50 rounded-lg border border-gray-200">
            <FaComment className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No comments yet</h3>
            <p className="text-gray-500">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}