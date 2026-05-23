import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import BookDetails from './pages/BookDetails';
import Recommendations from './pages/Recommendations';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
