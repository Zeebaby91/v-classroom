import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase';

export default function Home() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleJoinClass = (e) => {
    e.preventDefault();
    if (userName.trim() !== "") {
      navigate('/classroom', { state: { studentName: userName } });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Navigation / Logout */}
      <nav className="p-6 flex justify-end">
        <button onClick={() => auth.signOut()} className="text-[10px] font-black text-slate-500 hover:text-red-500 uppercase tracking-widest transition-all">
          Logout
        </button>
      </nav>

      <main className="px-6 md:px-16 py-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <span className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-4 block underline decoration-blue-500/30 underline-offset-8">V-Class Session</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-tight italic">
            Enter The <span className="text-blue-500">Room.</span>
          </h1>
          
          <form onSubmit={handleJoinClass} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Your Name..." 
              className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 w-full sm:w-64 transition-all text-white"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="bg-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
            >
              Join Now
            </button>
          </form>
        </div>

        <div className="lg:w-1/2">
          <div className="aspect-square rounded-[3rem] bg-slate-900 border border-white/5 overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://i.pinimg.com/736x/c7/ae/5d/c7ae5dc48595c24507ccf53e68051c74.jpg" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              alt="Classroom" 
            />
          </div>
        </div>
      </main>
    </div>
  );
}