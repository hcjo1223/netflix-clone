import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [creditsMovie, setCreditsMovie] = useState([]);
  const [creditsTv, setCreditsTv] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [translated, setTranslated] = useState(null); // 번역 결과
  const [translating, setTranslating] = useState(false); // 번역 로딩 상태


  const movieSliderRef = useRef();
  const tvSliderRef = useRef();

  const scrollMovie = (direction) => {
    if (movieSliderRef.current) {
      const { scrollLeft, clientWidth } = movieSliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      movieSliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  const scrollTV = (direction) => {
    if (tvSliderRef.current) {
      const { scrollLeft, clientWidth } = tvSliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      tvSliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };



  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_KEY;
    const fetchPerson = async () => {
      try {
        const [res] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/person/${id}`, {
            params: {
              api_key: apiKey,
              append_to_response: 'movie_credits,images,tv_credits',
              language: 'en',
            },
          }),
        ]);

        console.log('PersonDetail', res.data);
        const sortedMovie = res.data.movie_credits.cast
          .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        const sortedTv = res.data.tv_credits.cast
          .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));

        setPerson(res.data);
        setCreditsMovie(sortedMovie);
        setCreditsTv(sortedTv);
        setImages(res.data.images.profiles);
        setSelectedImage(res.data.images.profiles?.[0]?.file_path || null);

        const translateText = async () => {
          const apiKey2 = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;
          setTranslating(true);  // 시작
          try {
            const trans = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey2}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                q: [res.data.biography, res.data.name],
                target: 'ko',
                source: 'en',
                format: 'text',
                }),
            }
            );
    
            const transData = await trans.json();
            setTranslated(transData.data.translations);
          } catch (err) {
            console.error('번역 실패:', err);
            setTranslated('번역에 실패했습니다.');
       
          }  finally {
            setTranslating(false); // 완료
          }
        }

        if (res.data.biography) {
          translateText();
        }

      } catch (err) {
        console.error('인물 정보 로딩 실패:', err);
      }
    };

    fetchPerson();
  }, [id]);

  if (!person) return <div className="text-white p-4">인물 정보를 불러오는 중...</div>;

  return (
    <div className='test'>

      <div className="mt-16 p-8 px-12">
      <div className="flex flex-start justify-center">
        <div className='column'>
          <img
            src={`https://image.tmdb.org/t/p/original${selectedImage}`}
            alt={person.name}
            className="container profile"
          />
          <section className="facts pl-1 pt-1">
            <h3>인물 정보</h3>
            <p><strong>활동명</strong> {person.name}</p>
            <p><strong>전문 분야</strong> {person.known_for_department}</p>
            <p><strong>참여 작품 수</strong> {person.tv_credits.cast.length + person.movie_credits.cast.length}</p>
            <p><strong>성별</strong> {person.gender == 1 ? '여성' : '남성'} </p>
            <p><strong>생일</strong> {person.birthday.split('-')[0] + '년 ' + person.birthday.split('-')[1] + '월 ' + person.birthday.split('-')[2] + '일'} </p>
            <p><strong>출생지</strong> {person.place_of_birth}</p>

              <p><strong>다른 이름</strong>
                <ul>
                  {person.also_known_as?.map((person) => (
                    <li key={person}>
                        <span>{person}</span>
                    </li>
                  ))}
                </ul>
              </p>
          </section>
        </div>
        <div className="pl-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">{person.name}</h1>
            <div className="text-sm mb-3 leading-relaxed whitespace-pre-line">
              {person?.biography && (
                <div className="biography-section">
                  {translating ? (
                    <div>번역 중...</div>
                  ) : (
                    <div>{translated[0].translatedText}</div>
                  )}
                </div>

              )}
            </div>
              <div className="mt-10 relative">
          <h2 className="text-2xl font-semibold mb-4">🎬 프로필</h2>
          <div className="grid md:grid-cols-8 gap-1">
            {images?.slice(0, 20).map((img) => (
              <div key={img.file_path} className="text-center text-sm">
                <img
                  src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                  onClick={() => setSelectedImage(img.file_path)}
                  className={`cursor-pointer w-full rounded border ${
                    selectedImage === img.file_path ? 'border-red-500' : 'border-transparent'
                  }`}
                />
              </div>
            ))}
          </div>

        </div>

          </div>
        </div>
      </div>
        

        <div className="mt-10 relative">
          <h2 className="text-2xl font-semibold mb-4">🎬 주요 출연작 - 영화</h2>
          <div className="relative">
            <button 
              onClick={() => scrollMovie('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-4"
            >
              ◀
            </button>

            <div
              ref={movieSliderRef}
              className="flex overflow-x-scroll no-scrollbar space-x-3 scroll-smooth"
            >
              {creditsMovie?.slice(0, 20).map((movie) => (
              <Link
                key={movie.credit_id}
                to={`/movie/${movie.id}`}
                className="shrink-0 text-center"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  title={movie.overview}
                  className="w-[300px] h-[450px] object-cover rounded hover:scale-105 transition"
                />
                <div title={movie.title} className="mt-3 w-[300px] truncate">{movie.title}</div>
                <div className="text-xs text-gray-400">{movie.character}</div>
                <div className="text-xs text-gray-500">{movie.release_date}</div>
              </Link>
            ))}
            </div>

            <button 
              onClick={() => scrollMovie('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-4"
            >
              ▶
            </button>
          </div>
        </div>

        <div className="mt-10 relative">
          <h2 className="text-2xl font-semibold mb-4">🎬 주요 출연작 - TV 시리즈</h2>
          <div className="relative">
            <button 
              onClick={() => scrollTV('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-4"
            >
              ◀
            </button>

            <div
              ref={tvSliderRef}
              className="flex overflow-x-scroll no-scrollbar space-x-3 scroll-smooth"
            >
            {creditsTv?.slice(0, 20).map((tv) => (
              <Link
                key={tv.credit_id}
                to={`/tv/${tv.id}`}
                className="shrink-0 text-center"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                  alt={tv.title}
                  title={tv.overview}
                  className="w-[300px] h-[450px] object-cover rounded hover:scale-105 transition"
                />
                <div title={tv.title} className="w-[300px] mt-3 truncate">{tv.name}</div>
                <div className="text-xs text-gray-400">{tv.character}</div>
                <div className="text-xs text-gray-500">{tv.first_air_date}</div>
              </Link>
              
            ))}
            </div>

            <button 
              onClick={() => scrollTV('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white px-2 py-4"
            >
              ▶
            </button>
          </div>
        </div>


      </div>
    </div>
    
  );
};

export default PersonDetail;