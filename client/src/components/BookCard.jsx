import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const BookCard = ({ book }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-purple-500 transition-colors group flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {book.moodTags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="bg-purple-600/80 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-400 text-sm mb-2">{book.author}</p>
        
        <div className="flex items-center gap-1 mt-auto">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-bold">{book.ratingAvg.toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({book.numReviews})</span>
        </div>
        
        <Link 
          to={`/book/${book._id}`}
          className="mt-4 block text-center bg-gray-700 hover:bg-purple-600 transition-colors py-2 rounded-lg font-medium"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default BookCard;
