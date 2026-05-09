import { Link, NavLink } from 'react-router-dom';

export default function Navbar({ isAuth, user, onLogout }) {
  const linkStyle = ({ isActive }) => 
    `text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`;

  return (
    <nav className="h-20 flex justify-between items-center px-10 bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
      <Link to="/" className="text-2xl font-black text-blue-500 tracking-tighter italic">V-CLASS.</Link>

      <div className="hidden lg:flex gap-8">
        {isAuth && (
          <>
            <NavLink to="/" className={linkStyle}>Home</NavLink>
            <NavLink to="/classroom" className={linkStyle}>Classroom</NavLink>
          </>
        )}
      </div>

      <div className="flex items-center gap-6">
        {!isAuth ? (
          <Link to="/signup" className="bg-blue-600 px-5 py-2 rounded-lg text-[10px] font-black uppercase">Sign Up</Link>
        ) : (
          <div className="flex items-center gap-6">
            {user && (
              <div className="text-right">
                <p className="text-white font-black text-[10px] uppercase leading-none">{user.name}</p>
                <p className="text-blue-500 font-bold text-[8px] uppercase tracking-widest">{user.course}</p>
              </div>
            )}
            <button onClick={onLogout} className="text-red-400 text-[10px] font-black uppercase border border-red-900/30 px-3 py-1 rounded-md">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}