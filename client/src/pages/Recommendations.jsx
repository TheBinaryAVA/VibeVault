import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import MoodSelector from '../components/MoodSelector';
import BookCard from '../components/BookCard';
import { Loader2 } from 'lucide-react';

const Recommendations = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    try {
      const { data } = await api.post('/recommendations/mood', { mood });
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How are you feeling today?</h1>
        <p className="text-gray-400 text-lg">Select a mood to get personalized book recommendations instantly.</p>
      </div>

      <MoodSelector selectedMood={selectedMood} onSelect={handleMoodSelect} />

      <div className="mt-16">
        {loading ? (
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            <p className="text-purple-400 animate-pulse">Finding the perfect books for your mood...</p>
          </div>
        ) : selectedMood && recommendations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-6">Top Picks for "{selectedMood}"</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </motion.div>
        ) : selectedMood && recommendations.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p>No books found for this mood right now.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Recommendations;
