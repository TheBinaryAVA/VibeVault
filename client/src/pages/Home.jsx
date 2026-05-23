import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [personalizedBooks, setPersonalizedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [trendingRes, personalizedRes] = await Promise.all([
          api.get('/recommendations/trending'),
          userInfo ? api.get('/recommendations/personalized') : Promise.resolve({ data: { books: [] } })
        ]);
        
        setTrendingBooks(trendingRes.data);
        if (userInfo) {
          setPersonalizedBooks(personalizedRes.data.books);
        }
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12"
    >
      <section className="text-center py-12 px-4 rounded-3xl bg-gradient-to-br from-purple-900/40 to-gray-900 border border-purple-500/20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Discover Books by <span className="text-gradient">Mood</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Not sure what to read next? Tell us how you're feeling, and our AI will recommend the perfect book for your current mood.
        </p>
        <Link 
          to="/recommendations"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-bold transition shadow-lg shadow-purple-500/30"
        >
          Try Mood Matcher
        </Link>
      </section>

      {user && personalizedBooks.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            Recommended for You
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {personalizedBooks.slice(0, 5).map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
