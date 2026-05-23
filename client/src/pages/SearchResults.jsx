import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import { Loader2 } from 'lucide-react';

const SearchResults = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/books?keyword=${query}`);
        setBooks(data.books);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setBooks([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-xl">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
