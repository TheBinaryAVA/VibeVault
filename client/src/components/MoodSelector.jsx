const moods = [
  { name: 'Happy', emoji: '😄', color: 'from-yellow-400 to-orange-500' },
  { name: 'Sad', emoji: '😢', color: 'from-blue-400 to-indigo-600' },
  { name: 'Thriller', emoji: '😱', color: 'from-red-500 to-rose-700' },
  { name: 'Romantic', emoji: '🥰', color: 'from-pink-400 to-rose-500' },
  { name: 'Motivated', emoji: '💪', color: 'from-green-400 to-emerald-600' },
  { name: 'Thoughtful', emoji: '🤔', color: 'from-purple-400 to-violet-600' }
];

const MoodSelector = ({ selectedMood, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {moods.map((mood) => (
        <button
          key={mood.name}
          onClick={() => onSelect(mood.name)}
          className={`
            relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300
            ${selectedMood === mood.name 
              ? 'ring-4 ring-white ring-offset-4 ring-offset-gray-900 scale-105 shadow-xl shadow-purple-500/20' 
              : 'hover:scale-105 hover:shadow-lg opacity-80 hover:opacity-100'
            }
          `}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-20`}></div>
          {selectedMood === mood.name && (
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-100 -z-10`}></div>
          )}
          
          <span className="text-4xl relative z-10">{mood.emoji}</span>
          <span className={`font-bold relative z-10 ${selectedMood === mood.name ? 'text-white' : 'text-gray-300'}`}>
            {mood.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
