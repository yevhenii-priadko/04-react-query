import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import { toast, Toaster } from 'react-hot-toast';
import searchMovies from '../../services/movieService';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

const Paginate =
  (ReactPaginate as unknown as { default: typeof ReactPaginate }).default ||
  ReactPaginate;

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [page, setPage] = useState(1);

  const [query, setQuery] = useState('');

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery({
    queryKey: ['movies', query, page],

    queryFn: () => searchMovies(query, page),

    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data, query]);

  const handleSearch = (newQuery: string) => {
    const trimmed = newQuery.trim();

    if (!trimmed) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(trimmed);
    setPage(1);
  };

  return (
    <>
      {isLoading || (isFetching && <Loader />)}
      <SearchBar onSubmit={handleSearch} />

      {query && data?.total_pages && data.total_pages > 1 && (
        <Paginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }: { selected: number }) =>
            setPage(selected + 1)
          }
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isError ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={data?.results || []} onSelect={setSelectedMovie} />
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
