import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; 
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

export default function Classroom({ user }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

    // 1. DATA: Session anchor for clearing chat
 const [sessionStartTime] = useState(() => Date.now());

  const courseLibrary = [
    { 
      id: 1, 
      title: "React Fundamentals", 
      teacher: "Mr. Michael", 
      url: "https://www.youtube.com/embed/PfP84mUvZcM?si=QbIIkctGy-Y3vY0p",
      thumb: "https://i.pinimg.com/736x/2b/ee/11/2bee11a830bacc5ae9006df56b20c33a.jpg" 
    },
    { 
      id: 2, 
      title: "Advanced Frontend", 
      teacher: "DR. Ibrahim Aliyu", 
      url: "https://www.youtube.com/embed/qyHyFsT7Hig?si=T0CmxTyfZaLPyQRr",
      thumb: "https://i.pinimg.com/736x/25/ca/b4/25cab42c8a8ca29c2220ee58250a4212.jpg"
    },
    { 
      id: 3, 
      title: "Tailwind ", 
      teacher: "Zainab Abduulkarim", 
      url: "https://www.youtube.com/embed/mr15Xzb1Ook?si=YXDx4Tau8VZnPTqX",
      thumb: "https://i.pinimg.com/736x/02/d8/ac/02d8ac344042438f03d4d6860475fddd.jpg"
    }
  ];

  // 2. STATE MANAGEMENT
  const [activeVideo, setActiveVideo] = useState(courseLibrary[0]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [room, setRoom] = useState('General'); 
  const [isChatMuted, setIsChatMuted] = useState(false); 
  const [pinnedMessage, setPinnedMessage] = useState("Welcome to V-Class! Select a course below."); 
  const [handRaised, setHandRaised] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);



  // 3. ATTENDANCE & SYNC
useEffect(() => {
  if (!user) return;
  
  const logEntry = async () => {
    await addDoc(collection(db, 'attendance'), {
      name: user.displayName || user.email.split('@')[0],
      email: user.email,
      status: 'Online',
      timestamp: serverTimestamp()
    });
  };
  logEntry();

  // Listen for all attendance records and filter unique online users
  const unsub = onSnapshot(collection(db, 'attendance'), (snapshot) => {
    // We use a Map to ensure we only count the latest status for each unique email
    const uniqueUsers = new Map();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      uniqueUsers.set(data.email, data.status);
    });
    
    // Count how many of those unique users are currently "Online"
    const activeCount = Array.from(uniqueUsers.values()).filter(status => status === 'Online').length;
    setOnlineCount(activeCount);
  });
  
  return () => unsub();
}, [user]);


  // 4. CHAT SUBSCRIPTION
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter: Only show chat from the current session
      const filtered = allChats.filter(chat => {
        const chatTime = chat.createdAt?.toMillis() || Date.now();
        return chatTime >= sessionStartTime;
      });

      setMessages(filtered);
    });
    return () => unsubscribe();
  }, [sessionStartTime]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, room]);

  // 5. HANDLERS
  const handleLogout = async () => {
    if (user) {
      await addDoc(collection(db, 'attendance'), {
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        status: 'Absent',
        timestamp: serverTimestamp()
      });
    }
    await auth.signOut();
    navigate('/');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isChatMuted) return;
    await addDoc(collection(db, 'messages'), {
      user: user?.email?.split('@')[0] || 'Student',
      text: inputText,
      room: room, 
      createdAt: serverTimestamp()
    });
    setInputText('');
  };

  const sendReaction = async (emoji) => {
    await addDoc(collection(db, 'messages'), {
      user: user?.email?.split('@')[0],
      text: emoji,
      room,
      type: 'reaction',
      createdAt: serverTimestamp()
    });
  };

  return (
    <main className="h-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 bg-slate-950 px-6 flex items-center justify-between shadow-xl z-30">
        <div className="flex items-center gap-4">
          <span className="text-blue-500 font-black italic tracking-tighter text-xl">V-CLASS.</span>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">
                 {onlineCount} {onlineCount === 1 ? 'Person' : 'People'} Online
               </span>
             </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsChatMuted(!isChatMuted)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase ${isChatMuted ? 'bg-red-500 text-white' : 'text-slate-400'}`}>
            {isChatMuted ? 'Muted' : 'Chat Active'}
          </button>
          <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase bg-red-600 text-white hover:bg-red-700 transition-all">
            Leave
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        
        {/* VIDEO CONTENT */}
        <section className="flex-grow flex flex-col p-4 gap-4 bg-[#020617]">
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {courseLibrary.map((course) => (
              <button
                key={course.id}
                onClick={() => { setActiveVideo(course); setIsVideoLoading(true); }}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border shrink-0 ${activeVideo.id === course.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
              >
                <img src={course.thumb} alt="" className="w-6 h-6 rounded-md object-cover border border-white/10" />
                {course.title}
              </button>
            ))}
          </div>

          <div className="flex-grow bg-slate-900 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-8 left-8 z-20">
              <h2 className="text-2xl font-black text-white">{activeVideo.title}</h2>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Lecturer: {activeVideo.teacher}</p>
            </div>

            <iframe
              key={activeVideo.url}
              src={activeVideo.url}
              onLoad={() => setIsVideoLoading(false)}
              className={`w-full h-full border-none transition-opacity duration-1000 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
              allowFullScreen
            ></iframe>

            {isVideoLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950">
                <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-black text-[8px] uppercase tracking-widest">Loading Stream...</p>
              </div>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl z-20">
              <button 
                onClick={() => setHandRaised(!handRaised)} 
                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${handRaised ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}
              >
                 {handRaised ? '✋ Hand Raised' : 'Raise Hand'}
              </button>
              <div className="flex gap-1 border-l border-white/10 pl-3">
                 {['🔥', '👏', '💯', '❤️'].map(emoji => (
                   <button key={emoji} onClick={() => sendReaction(emoji)} className="w-10 h-10 hover:bg-white/10 rounded-xl transition-all text-lg active:scale-125">{emoji}</button>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* CHAT SIDEBAR */}
        <aside className="w-[400px] bg-slate-950/40 border-l border-white/5 flex flex-col">
  <div className="p-4 border-b border-white/5 flex flex-col gap-4">
    {/* Room Switcher */}
    <div className="flex gap-4">
      {['General', 'Q&A'].map(r => (
        <button 
          key={r} 
          onClick={() => setRoom(r)} 
          className={`text-[10px] font-black uppercase tracking-widest ${room === r ? 'text-blue-500 border-b-2 border-blue-500 pb-1' : 'text-slate-500'}`}
        >
          # {r}
        </button>
      ))}
    </div>

    {/* Dynamic Pinned Section */}
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex flex-col gap-1 relative group">
      <div className="flex justify-between items-center">
        <span className="text-blue-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
          <span className="animate-pulse text-xs">📌</span> Pinned in {room}
        </span>
        <button 
          onClick={() => setPinnedMessage(`Welcome to ${room}! Feel free to ask questions.`)} 
          className="text-[7px] text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 uppercase font-bold transition-opacity"
        >
          Reset
        </button>
      </div>
      <p className="text-[10px] text-blue-200 line-clamp-2 italic">
        {pinnedMessage}
      </p>
    </div>
  </div>

  {/* Filtered Message List */}
  <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide">
    {messages
      .filter(m => m.room === room)
      .map((msg) => (
        <div key={msg.id} className="flex gap-3 group p-3 rounded-2xl border border-white/5 bg-white/5 relative">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`} 
            className="w-8 h-8 rounded-full bg-slate-800" 
            alt="avatar" 
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black text-blue-500 uppercase block">{msg.user}</span>
              
              {/* Pin Button for this specific message */}
              <button 
                onClick={() => setPinnedMessage(`${msg.user}: ${msg.text}`)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-400 transition-all"
                title="Pin message"
              >
                <span className="text-xs">📌</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-1">{msg.text}</p>
          </div>
        </div>
      ))}
    <div ref={scrollRef} />
  </div>

  {/* Chat Input */}
  <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-white/5">
    <input 
      disabled={isChatMuted}
      type="text" 
      value={inputText} 
      onChange={(e) => setInputText(e.target.value)}
      placeholder={`Message #${room}...`}
      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-xs outline-none focus:border-blue-500 disabled:opacity-30 transition-all"
    />
  </form>
</aside>

      </div>
    </main>
  );
}