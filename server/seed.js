const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');
const Review = require('./models/Review');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const moodTagsPool = [
  'comedy', 'feel-good', 'lighthearted', 'humor', 'joyful', 'adventure', 'romance',
  'drama', 'tragedy', 'melancholy', 'emotional', 'tearjerker', 'heartbreaking',
  'suspense', 'mystery', 'psychological', 'crime', 'action', 'horror',
  'love-story', 'passion', 'heartwarming', 'contemporary-romance',
  'self-help', 'biography', 'inspirational', 'business', 'success', 'productivity',
  'philosophy', 'literary-fiction', 'sci-fi', 'dystopian', 'non-fiction', 'deep', 'historical'
];

const genresPool = [
  'Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction', 'Mystery',
  'Thriller', 'Romance', 'Biography', 'Self-Help', 'History',
  'Horror', 'Poetry', 'Humor', 'Philosophy'
];

const authorsPool = [
  'Jane Austen', 'J.K. Rowling', 'Stephen King', 'George Orwell', 'Mark Twain',
  'Agatha Christie', 'J.R.R. Tolkien', 'Ernest Hemingway', 'F. Scott Fitzgerald', 'Gabriel Garcia Marquez',
  'Leo Tolstoy', 'Charles Dickens', 'Virginia Woolf', 'James Joyce', 'Herman Melville'
];

const getRandomItems = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const importData = async () => {
  try {
    await Book.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    const books = [];

    for (let i = 1; i <= 200; i++) {
      const numTags = Math.floor(Math.random() * 3) + 2; // 2 to 4 tags
      const tags = getRandomItems(moodTagsPool, numTags);
      const genre = getRandomItems(genresPool, 1)[0];
      const author = getRandomItems(authorsPool, 1)[0];
      const ratingAvg = (Math.random() * (5 - 3) + 3).toFixed(1); // 3.0 to 5.0
      const numReviews = Math.floor(Math.random() * 500) + 10;

      books.push({
        title: `Amazing Book Title ${i} - A journey through ${tags[0]}`,
        author: author,
        description: `This is the fantastic description for book number ${i}. It is full of ${tags.join(', ')}. Perfect for readers who enjoy ${genre.toLowerCase()}!`,
        cover: `https://picsum.photos/seed/${i + 1000}/300/450`,
        moodTags: tags,
        genre: genre,
        ratingAvg: Number(ratingAvg),
        numReviews: numReviews,
      });
    }

    await Book.insertMany(books);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Book.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
