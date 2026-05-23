import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gradient">
          <BookOpen className="text-purple-500" />
          MoodBook AI
        </Link>

        <form onSubmit={handleSearch} className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search books or authors..."
            className="w-full bg-gray-700 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </form>

        <div className="flex items-center gap-4">
          <Link to="/recommendations" className="hover:text-purple-400 transition font-medium">
            Mood Matcher
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-300">
                <User className="w-5 h-5" /> {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg shadow-purple-500/30"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
