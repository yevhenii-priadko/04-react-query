import axios from 'axios';
import type { Movie } from '../types/movie';

interface MoviesResponse {
  results: Movie[];
}

const url = 'https://api.themoviedb.org/3/search/movie';
const myKey = import.meta.env.VITE_API_KEY;

async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return [];

  const response = await axios.get<MoviesResponse>(url, {
    params: { query },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data.results;
}

export default searchMovies;
