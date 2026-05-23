const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  const { bookId, text, rating } = req.body;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      book: bookId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      text,
      rating: Number(rating),
    });

    // Update book ratings
    const reviews = await Review.find({ book: bookId });
    book.numReviews = reviews.length;
    book.ratingAvg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await book.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this review' });
    }

    const bookId = review.book;
    
    await review.deleteOne();

    // Update book ratings
    const book = await Book.findById(bookId);
    if (book) {
      const reviews = await Review.find({ book: bookId });
      book.numReviews = reviews.length;
      book.ratingAvg = reviews.length > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length : 0;
      await book.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getReviews,
  deleteReview,
};
