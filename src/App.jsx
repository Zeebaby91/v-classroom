import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Classroom from './pages/Classroom';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Signup is the Front Door */}
        <Route path="/" element={!user ? <Signup /> : <Navigate to="/home" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        
        {/* Protected Routes - Passing 'user' prop carefully */}
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/" />} />
        <Route path="/classroom" element={user ? <Classroom user={user} /> : <Navigate to="/" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}