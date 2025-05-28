import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovies } from '../api';

const Row = ({ title, fetchUrl }) => {
    const [movies, setMovies] = useState([]);
    const rowRef = useRef();
    const rowType = 
        fetchUrl.indexOf('discover') == -1 
        ? fetchUrl.split('/')[1] 
        : ( fetchUrl.indexOf('tv') == -1 ? 'movie' : 'tv' );

    useEffect(() => {
        fetchMovies(fetchUrl)
        .then((data) => {
            if(fetchUrl.indexOf('discover') != -1){
                if(rowType == 'movie'){
                    const sortedMovie = data
                    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                    setMovies(sortedMovie)
                } else {
                    const sortedTv = data
                    .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));
                    setMovies(sortedTv)
                }
                
            } else {

                setMovies(data);
            }

        })
        .catch((err) => console.error('API 실패:', err));

    }, [fetchUrl]);

   

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="p-4 relative">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-4"
                >
                    ◀
                </button>
                <div
                    ref={rowRef}
                    className="flex overflow-x-scroll overflow-y-hidden no-scrollbar space-x-3 scroll-smooth"
                >
                {movies.map((movie) => (
                    <Link key={movie.id} to={`/${rowType}/${movie.id}`} className="shrink-0">
                        <img
                            className="w-[150px] h-[225px] object-cover rounded hover:scale-105 transition"
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title || movie.name}
                        />
                    </Link>
                ))}
                </div>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-4"
                >
                    ▶
                </button>
            </div>
        </div>
    );
};

export default Row;