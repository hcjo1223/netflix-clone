import { useEffect, useState } from 'react';
import { fetchLatestMovie } from '../api';

const Hero = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchLatestMovie().then(setMovie);
  }, []);

  if (!movie) return null;

  return (
    <section
      className="relative h-[70vh] bg-cover bg-center text-white"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
      <div className="absolute bottom-20 left-8 z-10 max-w-md">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-sm mb-4 line-clamp-3">{movie.overview}</p>
        <div className="flex gap-4">
          <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">▶ 재생</button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">+ 내 리스트</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
