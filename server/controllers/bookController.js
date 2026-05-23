const Book = require('../models/Book');

// @desc    Fetch all books (with pagination and search)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { author: { $regex: req.query.keyword, $options: 'i' } },
        ]
      }
    : {};

  try {
    const count = await Book.countDocuments({ ...keyword });
    const books = await Book.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ books, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private (Assume admin for this endpoint, though standard protect used for now)
const createBook = async (req, res) => {
  const { title, author, description, cover, moodTags, genre } = req.body;

  try {
    const book = new Book({
      title,
      author,
      description,
      cover,
      moodTags,
      genre,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
};
