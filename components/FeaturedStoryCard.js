import { useState } from 'react';
import parse from 'html-react-parser';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FeaturedStoryCard({ story }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const isUrdu = (text) => {
    const urduRegex = /[\u0600-\u06FF]/; 
    return urduRegex.test(text);
  };

  const isStoryUrdu = story.language === 'ur' || (!story.language && (isUrdu(story.title) || isUrdu(story.body)));

  return (
    <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl">
      <div className="p-6 flex flex-col">
        <div>
          <h3 className={`text-3xl font-bold text-gray-800 mb-2 ${isStoryUrdu ? 'urdu-text' : ''}`} dir={isStoryUrdu ? 'rtl' : 'ltr'}>
            {story.title}
          </h3>
          <div className={`text-gray-700 prose prose-sm max-w-none ${isExpanded ? '' : 'line-clamp-4'} ${isStoryUrdu ? 'urdu-text' : ''}`} dir={isStoryUrdu ? 'rtl' : 'ltr'}>
            {parse(story.body)}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              By <span className="font-medium">{story.author?.name || 'Unknown Author'}</span> 
              {' | '}
              Category: <span className="font-medium">{story.category?.name || 'Uncategorized'}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Likes: <span className="font-medium">{story.likeCount || 0}</span>
            </p>
          </div>
          
          <button
            onClick={toggleExpansion}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
          >
            {isExpanded ? (
              <>
                Show less
                <FaChevronUp className="ml-1" />
              </>
            ) : (
              <>
                Read more
                <FaChevronDown className="ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}