import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieById, fetchMovieVideosById, fetchMovieImagesById } from '../api';
import CommentSection from '../components/CommentSection';


const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [images, setImages] = useState(null);
    const [translated, setTranslated] = useState(null);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [mediaTab, setMediaTab] = useState('videos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [crews, setCrews] = useState(null);

    useEffect(() => {
        fetchMovieById(id)
        .then((data) => {
            setMovie(data);
            console.log('MovieDetail', data);

            const mergedByName = {};

            data.credits.crew.slice(0, 6).forEach(person => {
            const key = person.name;

            if (!mergedByName[key]) {
                // 초기 객체 세팅
                mergedByName[key] = {
                ...person,
                job: [person.job],
                };
            } else {
                // 이미 존재하면 job 추가
                if (!mergedByName[key].job.includes(person.job)) {
                mergedByName[key].job.push(person.job);
                }
            }
            });

            // 배열로 변환 및 job을 문자열로 변환
            const result = Object.values(mergedByName).map(person => ({
            ...person,
            job: person.job.join(', '),
            }));
            setCrews(result)
            console.log(result);
            
        })
        .catch((err) => console.error('영화 상세 API 실패:', err));

        fetchMovieImagesById(id)
        .then((data) => {
            setImages(data);
            console.log('setImages', data);
        })

        fetchMovieVideosById(id)
        .then((data) => {
            setVideos(data.filter(v => v.site === 'YouTube') || [])
        })
        .catch((err) => console.error('영화 상세 비디오 API 실패:', err));


    }, [id]);

    // 모달 열릴 때 body 스크롤 잠금
    useEffect(() => {
        if (selectedVideo || selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedVideo || selectedImage]);

    useEffect(() => {
        const handleEsc = (event) => {
        if (event.key === 'Escape') {
            setIsModalOpen(false);
            setSelectedVideo(null);
            setSelectedImage(null);
        }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

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

    const renderMediaContent = () => {
    if (mediaTab === 'videos') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video) => (
                <div
                key={video.id}
                className="shrink-0 cursor-pointer hover:opacity-80"
                onClick={() => {setSelectedVideo(video.key); setIsModalOpen(true);}}
                >
                <img
                    src={`https://img.youtube.com/vi/${video.key}/0.jpg`}
                    className="w-full rounded"
                    alt={video.name}
                />
                <p className="text-sm mt-1 truncate ml-1 mr-1">{video.name}</p>
                </div>
            ))}
        </div>
      );
    } else if (mediaTab === 'posters') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {movie.images?.posters?.map((img) => (
            <img
              key={img.file_path}
              src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
              className="rounded w-full"
              alt="poster"
              onClick={() => {setSelectedImage(img.file_path); setIsModalOpen(true);} }
            />
          ))}
        </div>
      );
    } else if (mediaTab === 'backdrops') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images?.map((img) => (
            <img
              key={img.file_path}
              src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
              className="rounded w-full"
              alt="backdrop"
              onClick={() => {setSelectedImage(img.file_path); setIsModalOpen(true);} }
            />
          ))}
        </div>
      );
    }
  };
    
    if (!movie) return <div className="text-block p-4">로딩 중...</div>;

    return (
        <div>
            {/* 비디오 모달 */}
            {isModalOpen && selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative w-[90%] max-w-4xl">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-1 right-3 text-white text-2xl z-10"
                        >
                            ✕
                        </button>
                        <iframe
                            width="100%"
                            height="500"
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="rounded"
                        ></iframe>
                    </div>
                </div>
            )}

            {/* 이미지 모달 */}
            {isModalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="relative w-[90%] max-w-4xl pt-[300px]">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-1 right-3 text-white text-2xl z-10"
                        >
                            ✕
                        </button>
                        <img
                            width="100%"
                            height="100%"
                            src={`https://image.tmdb.org/t/p/original${selectedImage}`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="rounded"
                        />
                    </div>
                </div>
            )}
            <div className="relative bg-gray-900 text-white">
                {/* 배경 이미지 */}
                <div
                    className="relative w-full bg-cover bg-center pl-24 firstgroud"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`}}
                >   
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="px-64 relative z-10 flex flex-col md:flex-row pt-16 px-12 py-10 gap-10 items-start">
                        {/* 포스터 */}
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            className="w-60 rounded shadow-lg"
                            alt={movie.title}
                        />

                        {/* 텍스트 정보 */}
                        <div className="max-w-3xl">
                            <h1 className="text-4xl font-bold">
                                {movie.title}{' '}
                                <span className="text-gray-300">({movie.release_date?.slice(0, 4)})</span>
                            </h1>
                            <div className="text-sm text-gray-400 mt-2">
                                <span className="border px-2 py-0.5 rounded mr-2">{movie.adult ? '청불' : '전체관람가'}</span>
                                {movie.release_date} · {movie.genres?.map((g) => g.name).join(', ')} · {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                            </div>
                            <p className="mt-4 italic text-lg text-gray-200">{movie.tagline}</p>
                            <p className="mt-3 text-sm leading-relaxed">{movie.overview}</p>

                            {/* 액션 버튼 */}
                            <div className="flex gap-4 mt-6">
                                <button 
                                    onClick={() => setSelectedVideo(videos[0]?.key)} 
                                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
                                >
                                    ▶ 트레일러 재생
                                </button>
                                <button
                                    onClick={handleTranslate}
                                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
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

                            {/* 감독/작가 */}
                            <div className="mt-6">
                                <ol className="people relative flex">
                                {/* {movie.credits?.crew
                                    ?.filter((p) => p.job === 'Director' || p.job === 'Writer')
                                    .slice(0, 5)
                                    .map((person) => (
                                        <li key={person.credit_id} className='basis-60'>
                                            <p className='font-semibold text-lg mb-1'>{person.name}</p>
                                            <p className='text-sm text-gray-300'>{person.job}</p> 
                                        </li>
                                ))} */}
                                {crews
                                    .map((person) => (
                                        <li key={person.credit_id} className='basis-1/3 w-1/3'>
                                            <p ><a className='cursor-pointer font-semibold text-lg mb-1 hover:text-gray-300' onClick={() => navigate(`/person/${person.id}`)}>{person.name}</a></p>
                                            <p className='text-sm'>{person.job}</p> 
                                        </li>
                                ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
             {/* 출연진 */}
            <div className="bg-white text-black px-64 py-6">
                <h2 className="text-2xl font-bold mb-4">주요 출연진</h2>
                <div className="flex overflow-x-auto gap-4 pb-4">
                {movie.credits?.cast?.slice(0, 10).map((actor) => (
                    <div
                    key={actor.id}
                    className="bg-white shadow rounded-lg w-36 shrink-0 text-center cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/person/${actor.id}`)}
                    >
                    <img
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        className="rounded-t-lg w-full h-44 object-cover"
                    />
                    <div className="p-2">
                        <div className="font-bold text-sm truncate">{actor.name}</div>
                        <div className="text-xs text-gray-600 truncate">{actor.character}</div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            
            <CommentSection movieId={id} />
            
            
           

            

             {/* 미디어 탭 */}
            <div className="bg-gray-800 text-white px-64 py-8">
                <div className="flex gap-6 mb-6">
                <button onClick={() => setMediaTab('videos')} className={`px-4 py-2 rounded ${mediaTab === 'videos' ? 'bg-blue-600' : 'bg-gray-600'}`}>동영상</button>
                <button onClick={() => setMediaTab('posters')} className={`px-4 py-2 rounded ${mediaTab === 'posters' ? 'bg-blue-600' : 'bg-gray-600'}`}>포스터</button>
                <button onClick={() => setMediaTab('backdrops')} className={`px-4 py-2 rounded ${mediaTab === 'backdrops' ? 'bg-blue-600' : 'bg-gray-600'}`}>배경</button>
                </div>
                {renderMediaContent()}
            </div>
            
            
            
            
        </div>
    );
};



export default MovieDetail;