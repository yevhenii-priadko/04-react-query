import axios from 'axios';
import type { Movie } from '../types/movie';

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

const url = 'https://api.themoviedb.org/3/search/movie';
const myKey = import.meta.env.VITE_API_KEY;

async function searchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  if (!query.trim()) return { results: [], total_pages: 0 };

  const response = await axios.get<MoviesResponse>(url, {
    params: { query, page },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
}

export default searchMovies;
