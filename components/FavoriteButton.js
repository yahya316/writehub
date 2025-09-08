// components/FavoriteButton.js
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FavoriteButton({ storyId, initialFavorites }) {
  const { data: session, status, update } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialFavorites.includes(storyId));
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async () => {
    if (status !== 'authenticated') {
      alert('Please log in to save stories.');
      return;
    }
    
    setLoading(true);
    const action = isFavorited ? 'remove' : 'add';

    try {
      const res = await fetch(`/api/user/favorites/${storyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error('Failed to update favorites.');
      
      setIsFavorited(!isFavorited);
      // Manually update the session client-side to reflect the change
      await update();
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <button
      onClick={handleFavoriteClick}
      className={`px-4 py-2 rounded-md ${
        isFavorited
          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      disabled={loading || status !== 'authenticated'}
    >
      {loading ? 'Saving...' : isFavorited ? '★ Favorited' : '☆ Favorite'}
    </button>
  );
}