export function isUrdu(text) {
  if (!text) return false;
  const urduRegex = /[\u0600-\u06FF]/; // Urdu Unicode range
  return urduRegex.test(text);
}

export function getStoryLanguage(story) {
  // Check story.language first, fallback to text detection
  return story.language === 'ur' || (!story.language && (isUrdu(story.title) || isUrdu(story.body))) ? 'ur' : 'en';
}