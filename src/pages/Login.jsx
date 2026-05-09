import { useState } from 'react';
import { auth } from '../firebase'; // Go up one folder
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/home'); // <--- CHANGE THIS FROM /classroom TO /home
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 text-slate-900">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <h2 className="text-2xl font-black mb-6 uppercase italic">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-slate-100 rounded-xl outline-none" onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl">Login</button>
        </form>
        <p className="mt-4 text-center text-xs font-bold text-slate-400">
          Need an account? <Link to="/" className="text-blue-600 underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}