'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { BiHeart, BiSolidHeart } from 'react-icons/bi';

export default function LikeButton({ storyId, initialLikeCount, isInitiallyLiked }) {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLike = async () => {
    
    if (!session) {
      alert('You must be logged in to like a story.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      });
      console.log('Sending like request for storyId:', storyId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update like status.');
      }

      setLikeCount(data.likeCount);
      setIsLiked(data.isLiked);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const heartIcon = isLiked ? (
    <BiSolidHeart className="h-6 w-6 text-red-500" />
  ) : (
    <BiHeart className="h-6 w-6 text-red-500 hover:text-red-600 transition-colors" />
  );

  return (
    <div className="flex items-center space-x-1">
      <button 
        onClick={handleLike} 
        disabled={isLoading}
        className="p-2 rounded-full transition-colors focus:outline-none"
      >
        {heartIcon}
      </button>
      <span className="text-gray-600 text-sm font-medium">{likeCount}</span>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}