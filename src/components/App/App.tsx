import { useState } from 'react';
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

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['movies', query, page],

    queryFn: async () => {
      const result = await searchMovies(query, page);
      if (result.results.length === 0) {
        toast.error('No movies found for your request.');
      }
      return result;
    },

    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });

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
      {isLoading || (isFetching && <Loader />)}
      {isError ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={data?.results || []} onSelect={setSelectedMovie} />
      )}
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
