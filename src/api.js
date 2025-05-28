import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

export const fetchLatestMovie = async () => {
  const res = await axiosInstance.get('/discover/movie', {
    params: {
      api_key: import.meta.env.VITE_TMDB_KEY,
      sort_by: 'popularity.desc',
      include_adult: true,
      page: 1,
      language: 'ko',
    },
  });
  return res.data.results[0]; // 가장 최근 작품 1개
};


export const fetchMovies = async (path) => {
  const res = await axiosInstance.get(path, {
    params: {
      api_key: import.meta.env.VITE_TMDB_KEY,
      language: 'ko',
    },
  });
  return res.data.results;
};

export const fetchMovieById = async (id) => {
  const res = await axiosInstance.get(`/movie/${id}`, {
    params: {
      api_key: import.meta.env.VITE_TMDB_KEY,
      append_to_response: 'credits,images',
      language: 'ko',  
    },
  });
  return res.data;
};
export const fetchMovieVideosById = async (id) => {
  const res = await axiosInstance.get(`/movie/${id}/videos`, {
    params: {
      api_key: import.meta.env.VITE_TMDB_KEY,
      language: 'ko',
    },
  });
  return res.data.results;
};
export const fetchMovieImagesById = async (id) => {
  const res = await axiosInstance.get(`/movie/${id}/images`, {
    params: {
      api_key: import.meta.env.VITE_TMDB_KEY,
      include_image_language: 'en,null,ko',
    },
  });
  return res.data.backdrops;
};

export const fetchTvById = async (id) => {
  const res = await axiosInstance.get(`/tv/${id}`, {
    params: {
      api_key: import.meta.env.VITE_TMDB_KEY,
      append_to_response: 'credits,images',
      language: 'ko',  
    },
  });
  return res.data;
};
