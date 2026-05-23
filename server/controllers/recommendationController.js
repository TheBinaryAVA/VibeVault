const Book = require('../models/Book');
const User = require('../models/User');

// Simple in-memory cache for trending books to reduce DB load
let trendingCache = {
  data: null,
  timestamp: null,
};

// @desc    Get book recommendations based on mood
// @route   POST /api/recommendations/mood
// @access  Public
const getMoodRecommendations = async (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ message: 'Mood is required' });
  }

  try {
    // Mood mapping logic
    const moodMap = {
      Happy: ['comedy', 'feel-good', 'lighthearted', 'humor', 'joyful', 'adventure', 'romance'],
      Sad: ['drama', 'tragedy', 'melancholy', 'emotional', 'tearjerker', 'heartbreaking'],
      Thriller: ['suspense', 'mystery', 'psychological', 'crime', 'action', 'horror'],
      Romantic: ['romance', 'love-story', 'passion', 'heartwarming', 'contemporary-romance'],
      Motivated: ['self-help', 'biography', 'inspirational', 'business', 'success', 'productivity'],
      Thoughtful: ['philosophy', 'literary-fiction', 'sci-fi', 'dystopian', 'non-fiction', 'deep', 'historical'],
    };

    const tagsToSearch = moodMap[mood] || [mood.toLowerCase()];

    // Find books that have any of the mood tags
    // Rank by ratingAvg
    const books = await Book.find({
      moodTags: { $in: tagsToSearch.map(tag => new RegExp(tag, 'i')) }
    }).sort({ ratingAvg: -1 }).limit(20);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending books
// @route   GET /api/recommendations/trending
// @access  Public
const getTrendingBooks = async (req, res) => {
  try {
    // Cache invalidation (1 hour)
    if (trendingCache.data && trendingCache.timestamp > Date.now() - 3600000) {
      return res.json(trendingCache.data);
    }

    // Top rated and most reviewed books
    const books = await Book.find({}).sort({ numReviews: -1, ratingAvg: -1 }).limit(10);
    
    trendingCache.data = books;
    trendingCache.timestamp = Date.now();

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/recommendations/personalized
// @access  Private
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('likedBooks');
    
    if (!user || user.likedBooks.length === 0) {
      // If no history, return trending
      const books = await Book.find({}).sort({ ratingAvg: -1 }).limit(10);
      return res.json({ reason: 'trending', books });
    }

    // Extract genres/tags from liked books
    const likedGenres = user.likedBooks.map(book => book.genre);
    const likedTags = user.likedBooks.flatMap(book => book.moodTags);
    
    // Find books matching these genres/tags but not already in likedBooks
    const likedBookIds = user.likedBooks.map(b => b._id);
    
    const recommendedBooks = await Book.find({
      _id: { $nin: likedBookIds },
      $or: [
        { genre: { $in: likedGenres } },
        { moodTags: { $in: likedTags } }
      ]
    }).sort({ ratingAvg: -1 }).limit(10);

    res.json({ reason: 'personalized', books: recommendedBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMoodRecommendations,
  getTrendingBooks,
  getPersonalizedRecommendations
};
