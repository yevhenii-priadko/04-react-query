import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import { toast, Toaster } from 'react-hot-toast';
import searchMovies from '../../services/movieService';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasError, setHasError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string): Promise<void> => {
    setHasError(false);

    if (!query.trim()) {
      toast.error('Please enter your search query.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await searchMovies(query);

      if (result.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies(result);
    } catch (err) {
      setHasError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {hasError ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      <Toaster position="top-left" />
    </>
  );
}

export default App;
