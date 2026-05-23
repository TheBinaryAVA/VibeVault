import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Loader2, BookOpen } from 'lucide-react';
import api from '../api/axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) setUser(JSON.parse(userInfo));

    const fetchBook = async () => {
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/reviews/${id}`)
        ]);
        setBook(bookRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching book details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to review');
    try {
      const { data } = await api.post('/reviews', {
        bookId: id,
        text: reviewText,
        rating: reviewRating
      });
      // Add user name manually since it's just created
      data.user = { name: user.name }; 
      setReviews([data, ...reviews]);
      setReviewText('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><Loader2 className="w-12 h-12 animate-spin text-purple-500"/></div>;
  if (!book) return <div className="text-center text-xl mt-12">Book not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="glass rounded-3xl p-8 flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img src={book.cover} alt={book.title} className="w-full rounded-xl shadow-2xl" />
        </div>
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            {book.moodTags.map(tag => (
              <span key={tag} className="bg-purple-900/50 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-400 mb-6">by {book.author}</p>
          
          <div className="flex items-center gap-6 mb-8 bg-gray-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold">{book.ratingAvg.toFixed(1)}</span>
            </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="flex items-center gap-2 text-gray-400">
              <BookOpen className="w-5 h-5" />
              <span>{book.genre}</span>
            </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="text-gray-400">
              {book.numReviews} Reviews
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2">Synopsis</h3>
          <p className="text-gray-300 leading-relaxed text-lg">{book.description}</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Reviews</h2>
        
        {user ? (
          <form onSubmit={submitReview} className="bg-gray-800 p-6 rounded-xl mb-8 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Rating</label>
              <select 
                value={reviewRating} 
                onChange={e => setReviewRating(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[5,4,3,2,1].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <textarea
              required
              className="w-full bg-gray-700 text-white p-4 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 mb-4 h-24"
              placeholder="What did you think of this book?"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            ></textarea>
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold transition">
              Submit Review
            </button>
          </form>
        ) : (
          <div className="bg-gray-800 p-6 rounded-xl mb-8 text-center border border-gray-700">
            <p className="text-gray-400 mb-2">Please login to write a review</p>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? <p className="text-gray-500">No reviews yet.</p> : null}
          {reviews.map(review => (
            <div key={review._id} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold">{review.user?.name || 'Anonymous'}</span>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
              <p className="text-gray-300">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
