// components/StoryCard.js
import Link from 'next/link';

export default function StoryCard({ story }) {
  const formattedDate = new Date(story.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isUrdu = (text) => {
    const urduRegex = /[\u0600-\u06FF]/; // Urdu Unicode range
    return urduRegex.test(text);
  };

  // Determine if the story is in Urdu based on language field or text content
  const isStoryUrdu = story.language === 'ur' || (!story.language && (isUrdu(story.title) || isUrdu(story.body)));

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>{formattedDate}</span>
            {story.category && (
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                {story.category.name}
              </span>
            )}
          </div>
          <h3
            className={`text-xl font-bold text-gray-800 mb-1 leading-tight ${isStoryUrdu ? 'urdu-text' : ''}`}
            dir={isStoryUrdu ? 'rtl' : 'ltr'}
          >
            {story.title}
          </h3>
          {story.author && (
            <p className="text-sm text-gray-500 mb-4">
              By <span className="font-medium text-gray-600">{story.author.name}</span>
            </p>
          )}
          
          <div
            className={`text-gray-600 mb-4 line-clamp-3 ${isStoryUrdu ? 'urdu-text' : ''}`}
            dir={isStoryUrdu ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: story.body }}
          />
        </div>
        <div className="mt-auto">
          <Link href={`/story/${story.slug}`} passHref>
            <span className="inline-block text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors duration-200">
              Read More
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}