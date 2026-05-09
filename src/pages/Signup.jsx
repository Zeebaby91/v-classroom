import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // Creating the user profile in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });
      
      navigate('/classroom'); // Success!
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Line 33 was likely here—we made sure it's inside the 'Signup' function!
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
        <h2 className="text-2xl font-black mb-2 uppercase italic text-slate-900">
          Join <span className="text-blue-600">V-Class</span>
        </h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">
          Create your account to enter
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            required 
            className="w-full p-4 bg-slate-100 rounded-xl outline-none text-slate-900" 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            className="w-full p-4 bg-slate-100 rounded-xl outline-none text-slate-900" 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password (min 6 chars)" 
            required 
            className="w-full p-4 bg-slate-100 rounded-xl outline-none text-slate-900" 
            onChange={e => setPassword(e.target.value)} 
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
        </p>
      </div>
    </div>
  );
}