import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import MovieDetail from './pages/MovieDetail';
import PersonDetail from './pages/PersonDetail';
import TvDetail from './pages/TvDetail';
import HeroSlider from './components/HeroSlider';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              {/* <Hero /> */}
              {/* <Row title="🔥 Trending Now" fetchUrl="/trending/all/week" /> */}
              <Row title="🤔 Upcoming" fetchUrl="/movie/upcoming" />
              <Row title="😎 Popular Movie" fetchUrl="/movie/popular" />
              <Row title="🤯 Popular TV Series" fetchUrl="/tv/popular" />
              <Row title="⚒️ Top Rated Movie" fetchUrl="/movie/top_rated" />
              <Row title="📡 Top Rated TV Series" fetchUrl="/tv/top_rated" />
              <Row title="🎬 Animation Movies" fetchUrl="/discover/movie?with_genres=16?sort_by=popularity.desc" />
              <Row title="🐶 Animation TV Series" fetchUrl="/discover/tv?with_genres=16?sort_by=popularity.desc" />
            </>
          }
        />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<TvDetail />} />
        <Route path="/person/:id" element={<PersonDetail />} />
      </Routes>
    </>
  );
}

export default App;
