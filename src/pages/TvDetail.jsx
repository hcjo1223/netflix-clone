import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTvById } from '../api';
import CommentSection from '../components/CommentSection';


const TvDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [images, setImages] = useState(null);
    const [credits, setCredits] = useState(null);
    const [translated, setTranslated] = useState(null);

    useEffect(() => {
        fetchTvById(id)
        .then((data) => {
            setMovie(data);
            setImages(data.images)
            setCredits(data.credits);
            console.log(data);
        })
        .catch((err) => console.error('영화 상세 API 실패:', err));
    }, [id]);

    const handleTranslate = async () => {
        if (!movie?.overview) return;

        try {
            const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;

            const res = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                q: [movie.tagline, movie.overview],
                target: 'en',
                source: 'ko',
                format: 'text',
                }),
            }
            );

            const data = await res.json();
            setTranslated(data.data.translations);
        } catch (err) {
            console.error('Google 번역 실패:', err);
            alert('번역 중 오류가 발생했습니다.');
        }
    };


    
    if (!movie) return <div className="text-block p-4">로딩 중...</div>;

    return (
        <div className="p-24 text-block">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            {/* <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-64 mb-4"
            /> */}
            <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="w-full mb-4"
            />
            <div className='flex'>
                {images?.posters?.slice(0, 5).map((img) => (
                <div
                    key={img.file_path}
                    className='flex-initial
'
                >
                    <img
                    src={`https://image.tmdb.org/t/p/original${img.file_path}`}
                    className="rounded h-full w-auto object-cover mb-1"
                    />
                </div>
                ))}
             
            </div>
            
            
            {/* <p className="text-lg font-bold mb-2 max-w-xl">{movie.tagline}</p> */}
            <p className="text-sm mb-2">{movie.overview}</p>

            <div className="text-sm text-gray-200 bg-gray-700 p-3 mb-2 rounded leading-relaxed">
                <button
                    onClick={handleTranslate}
                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-sm"
                >
                    줄거리 영어로 번역
                </button>
                    { translated && (
                        <p>
                            {/* {translated[0].translatedText}<br></br> */}
                            {translated[1].translatedText}
                        </p>
                    )}
            </div>


            <p className="text-sm mb-2">⭐ 평점: {movie.vote_average} / 10</p>
            <p className="text-sm mb-2">🎬 장르: {movie.genres.map((g) => g.name).join(', ')}</p>
            <p className="text-sm mb-2">📆 출시일: {movie.first_air_date}</p>
            
            <h2 className="text-lg font-semibold mt-6 mb-2">출연진</h2>
            <div className="flex gap-3 overflow-x-auto">
                {credits?.cast?.slice(0, 10).map((actor) => (
                <div
                    key={actor.id}
                    className="text-center text-xs w-24 cursor-pointer hover:opacity-80"
                    onClick={() => navigate(`/person/${actor.id}`)}
                >
                    <img
                    src={`https://image.tmdb.org/t/p/original${actor.profile_path}`}
                    alt={actor.name}
                    className="rounded h-32 w-full object-cover mb-1"
                    />
                    <div>{actor.name}</div>
                </div>
                ))}
            </div>
            <CommentSection movieId={id} />
        </div>
    );
};



export default TvDetail;