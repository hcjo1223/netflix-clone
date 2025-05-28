// ✅ HeroSlider.jsx - 슬라이드 전환 시 글씨 애니메이션 추가

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_KEY;
    const fetchPopular = async () => {
      try {
        const res = await axios.get('https://api.themoviedb.org/3/trending/all/week', {
          params: { api_key: apiKey, language: 'ko' },
        });
        setMovies(res.data.results.slice(0, 10));
      } catch (err) {
        console.error('인기 영화 로딩 실패:', err);
      }
    };
    fetchPopular();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoaded(false); // 새 이미지 로드 시작
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies]);

  if (!movies.length) return null;

  const movie = movies[index];

  return (
    <div
      className="relative w-full h-[500px] bg-black text-white cursor-pointer overflow-hidden"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        key={movie.id}
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        className="w-full h-full object-cover opacity-70 transition-opacity duration-700"
        onLoad={() => setLoaded(true)}
      />

      <div
        key={movie.id + '-text'}
        className={`absolute bottom-20 left-8 z-10 max-w-md transition-all duration-700 transform ${
          loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}
      >
        <h1 className="text-4xl font-bold mb-4">{movie.title || movie.name}</h1>
        <p className="text-sm mb-4 line-clamp-3">{movie.overview}</p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">▶ 재생</button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">+ 내 리스트</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
