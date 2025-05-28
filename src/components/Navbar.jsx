import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-10 bg-gradient-to-b from-black p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600 hover:opacity-80 netflix-logo">
            NETFLIX
        </Link>

        <ul className="flex gap-6 text-sm text-white">
            <li><Link to="/movies" className="hover:underline">영화</Link></li>
            <li><Link to="/tv" className="hover:underline">TV 프로그램</Link></li>
            <li><Link to="/mylist" className="hover:underline">내 리스트</Link></li>
        </ul>
        <div className="text-white">프로필</div>
      </div>
    </header>
  );
};

export default Navbar;
