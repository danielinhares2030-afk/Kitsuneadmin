// 🌌 NEKOVERSE FUSION 23.0 – CATÁLOGO REFINADO E FLUIDEZ MÁXIMA
import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, updateProfile, GoogleAuthProvider,
  signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence
} from "firebase/auth";
import {
  getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc,
  increment, query, orderBy, limit
} from "firebase/firestore";

// 🔥 SUA CONFIGURAÇÃO REAL DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyACA1xbk3_qTemmFizUsdb9I8T6A6NC0D8",
  authDomain: "nekoverse-fusion.firebaseapp.com",
  projectId: "nekoverse-fusion",
  storageBucket: "nekoverse-fusion.firebasestorage.app",
  messagingSenderId: "327839249582",
  appId: "1:327839249582:web:a85bea686d49ae5c51a93f",
  measurementId: "G-VC0823L9NW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// 🎨 COMPONENTES SVG (COM VIEWBOX PARA NÃO CORTAR)
const Icons = {
  Search: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Bell: ({ filled }) => <svg viewBox="0 0 24 24" width="24" height="24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Heart: ({ filled, className }) => <svg viewBox="0 0 24 24" width="20" height="20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  User: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  HistoryRefresh: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  InfoCircle: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Share: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10c2 0 2.5 1.5 2.5 3s-1 3.5-3.5 4c-1.5.5-2.5 1.5-2.5 3v3H10.5v-3c0-1.5-1-2.5-2.5-3C5.5 10.5 4.5 9 4.5 7S5 4 7 4z"/></svg>,
  Crown: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>,
  Google: () => <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Shuffle: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,
  CheckCircle: () => <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};
const FusionLogo = ({ className }) => (
  <svg viewBox="0 0 340 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="20" y="60" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="50" fill="#00F0FF" letterSpacing="1">NEKO</text>
    <text x="165" y="60" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="50" fill="#FF007A" letterSpacing="1">VERSE</text>
    <line x1="150" y1="15" x2="160" y2="70" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
    <text x="165" y="82" fontFamily="Inter, sans-serif" fontWeight="bold" fontSize="16" fill="#FFFFFF" letterSpacing="14" opacity="0.6">FUSION</text>
  </svg>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState("");
  const [initialFilter, setInitialFilter] = useState("all");
  const [showWelcomeAnim, setShowWelcomeAnim] = useState({ show: false, msg: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const lastActive = localStorage.getItem("nkv_last_active");
        const now = Date.now();
        const INACTIVITY_LIMIT = 7 * 24 * 60 * 60 * 1000; 

        if (lastActive && (now - parseInt(lastActive) > INACTIVITY_LIMIT)) {
          await signOut(auth);
          localStorage.removeItem("nkv_last_active");
          setUser(null);
          setAuthChecked(true);
        } else {
          localStorage.setItem("nkv_last_active", now.toString());
          setTimeout(() => {
            setUser(u);
            setAuthChecked(true);
          }, 300);
        }
      } else {
        setUser(null);
        setAuthChecked(true);
      }
    });
    const splashTimer = setTimeout(() => setShowSplash(false), 2000); 
    return () => { unsubscribe(); clearTimeout(splashTimer); };
  }, []);

  const navigateToPlayer = (item) => {
    setSelectedItem(item);
    setPage("player");
  };

  const navigateToCatalog = (filter) => {
    setInitialFilter(filter || "all");
    setPage("search");
  };

  const playRandom = async () => {
    const snap = await new Promise(resolve => {
       const unsub = onSnapshot(collection(db, "content"), (snapshot) => { unsub(); resolve(snapshot); });
    });
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if(data.length > 0) {
      const randomItem = data[Math.floor(Math.random() * data.length)];
      navigateToPlayer(randomItem);
    } else {
      setAuthError("Catálogo vazio no momento.");
      setTimeout(() => setAuthError(""), 3000);
    }
  };

  if (showWelcomeAnim.show) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#05050A] flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00F0FF]/10 via-[#05050A] to-[#FF007A]/10 opacity-70 animate-pulse"></div>
         <FusionLogo className="w-64 md:w-80 mb-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-in zoom-in duration-700" />
         <div className="relative w-56 h-1 bg-white/10 rounded-full overflow-hidden mb-6 shadow-lg">
           <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00F0FF] to-[#FF007A] animate-[loading_2.5s_ease-in-out_forwards]"></div>
         </div>
         <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em] relative z-10 drop-shadow-md animate-in slide-in-from-bottom-4 duration-700 text-center px-4">{showWelcomeAnim.msg}</h2>
         <style>{`@keyframes loading { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
      </div>
    );
  }

  if (showSplash) return <EpicCollisionSplash />;
  if (!authChecked) return <div className="h-screen bg-[#0A0B10]" />;
  if (!user) return <Auth authError={authError} setAuthError={setAuthError} triggerWelcome={setShowWelcomeAnim} />;
  
  return (
    <>
      <Main 
        user={user} setUser={setUser} 
        page={page} setPage={setPage} 
        selectedItem={selectedItem} navigateToPlayer={navigateToPlayer} 
        playRandom={playRandom} navigateToCatalog={navigateToCatalog} 
        initialFilter={initialFilter} 
      />
      {authError && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-[200] animate-in slide-in-from-top">
          {authError}
        </div>
      )}
    </>
  );
}
function EpicCollisionSplash() {
  return (
    <div className="h-screen w-full bg-[#020205] flex items-center justify-center relative overflow-hidden">
      <style>{`
        .beam-blue { position: absolute; left: -50%; width: 50%; height: 4px; background: #00F0FF; box-shadow: 0 0 20px 2px rgba(0,240,255,0.4); border-radius: 10px; animation: shoot-right 0.8s cubic-bezier(0.8, 0, 0.2, 1) forwards; }
        .beam-pink { position: absolute; right: -50%; width: 50%; height: 4px; background: #FF007A; box-shadow: 0 0 20px 2px rgba(255,0,122,0.4); border-radius: 10px; animation: shoot-left 1.5s cubic-bezier(0.8, 0, 0.2, 1) forwards; }
        .shockwave-ring { position: absolute; width: 0; height: 0; border: 2px solid rgba(255,255,255,0.8); border-radius: 50%; opacity: 0; animation: ripple 1.2s ease-out 0.8s forwards; }
        .logo-reveal { opacity: 0; transform: scale(0.9); z-index: 60; animation: reveal 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1s forwards; }
        @keyframes shoot-right { 0% { transform: translateX(0); } 100% { transform: translateX(100vw); } }
        @keyframes shoot-left { 0% { transform: translateX(0); } 100% { transform: translateX(-100vw); } }
        @keyframes ripple { 0% { width: 10px; height: 10px; opacity: 1; border-width: 10px; } 100% { width: 400px; height: 400px; opacity: 0; border-width: 1px; } }
        @keyframes reveal { 0% { opacity: 0; transform: scale(0.9); filter: blur(10px); } 100% { opacity: 1; transform: scale(1); filter: blur(0); } }
      `}</style>
      <div className="beam-blue"></div>
      <div className="beam-pink"></div>
      <div className="shockwave-ring"></div>
      <div className="logo-reveal flex flex-col items-center">
        <FusionLogo className="w-[300px] md:w-[400px] h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
      </div>
    </div>
  );
}

function Auth({ authError, setAuthError, triggerWelcome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault(); 
    if (!isLogin && !username.trim()) return setAuthError("Digite um Nome de Usuário para se cadastrar.");
    setLoading(true); setAuthError("");
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        triggerWelcome({ show: true, msg: "Acesso Verificado" });
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: username });
        await setDoc(doc(db, "global_ranking", res.user.uid), { name: username, photoURL: "", score: 0 });
        triggerWelcome({ show: true, msg: `Bem-vindo(a), ${username}!` });
      }
      setTimeout(() => triggerWelcome({ show: false, msg: "" }), 2500);
    } catch (err) { 
      let msg = err.message;
      if (msg.includes("invalid-credential")) msg = "Credenciais incorretas.";
      if (msg.includes("email-already-in-use")) msg = "Email já cadastrado.";
      setAuthError(msg); setLoading(false);
    } 
  };

  const handleGoogleAuth = async () => {
    setAuthError("");
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      triggerWelcome({ show: true, msg: `Olá, ${res.user.displayName || 'Otaku'}!` });
      setTimeout(() => triggerWelcome({ show: false, msg: "" }), 2500);
    } catch (err) { setAuthError("Login cancelado."); } 
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00F0FF]/10 via-[#05050A] to-[#FF007A]/10 opacity-70 pointer-events-none"></div>
      
      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center">
        <FusionLogo className="w-56 md:w-64 mb-10 drop-shadow-xl" />
        
        <form onSubmit={handleEmailAuth} className="w-full space-y-4 mb-6">
          {!isLogin && (
            <div className="animate-in slide-in-from-top-2">
              <input required type="text" placeholder="Nome de Usuário (Ex: Otaku99)" value={username} onChange={e=>setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-white focus:bg-white/10 text-white font-bold transition-all placeholder-gray-500" />
            </div>
  )}
          <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#00F0FF] focus:bg-white/10 text-white transition-all placeholder-gray-500" />
          
          <div>
            <input required type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#FF007A] focus:bg-white/10 text-white transition-all placeholder-gray-500" />
            
            <div className="flex items-center justify-between mt-3 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/20 bg-black/50 group-hover:border-[#00F0FF] transition-colors">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="opacity-0 absolute w-full h-full cursor-pointer" />
                  {rememberMe && <Icons.Check />}
                </div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest group-hover:text-white transition-colors">Lembrar de mim</span>
              </label>
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black active:scale-95 transition-all mt-4 uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-70 text-sm">
            {loading ? "Processando..." : (isLogin ? "Acessar Conta" : "Criar Conta Oficial")}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 w-full mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Ou continue com</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 bg-[#12141D] border border-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/5 active:scale-95 transition-all text-sm">
          <Icons.Google /> Conectar com Google
        </button>

        <div className="mt-8 text-center space-y-2 w-full">
          <button onClick={() => setIsLogin(!isLogin)} className="text-gray-400 text-xs hover:text-white transition-colors font-bold uppercase tracking-widest">
            {isLogin ? "Não tem conta? Cadastre-se" : "Já possui conta? Faça Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Main({ user, setUser, page, setPage, selectedItem, navigateToPlayer, playRandom, navigateToCatalog, initialFilter }) {
  if (page === "player") return <UniversalPlayer user={user} item={selectedItem} goBack={() => setPage("home")} />;

  return (
    <div className="bg-[#0A0B10] text-white min-h-screen flex flex-col font-sans">
      <TopBar user={user} />
      <div className="flex-grow pb-28 md:pb-8 w-full relative z-10 overflow-x-hidden">
        {page === "home" && <div key="home" className="animate-in fade-in duration-500 w-full"><Home user={user} navigateToPlayer={navigateToPlayer} navigateToCatalog={navigateToCatalog} /></div>}
        {page === "search" && <div key="search" className="pt-24 max-w-[1400px] mx-auto w-full flex justify-center animate-in fade-in zoom-in-95 duration-500"><CatalogSearch user={user} navigateToPlayer={navigateToPlayer} initialFilter={initialFilter} /></div>}
        {page === "profile" && <div key="profile" className="pt-24 max-w-[1400px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500"><ProfileManager user={user} setUser={setUser} navigateToPlayer={navigateToPlayer} /></div>}
      </div>
      <BottomNav page={page} setPage={setPage} playRandom={playRandom} navigateToCatalog={navigateToCatalog} />
    </div>
  );
}

function TopBar({ user }) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if(!user) return;
    const unsub = onSnapshot(query(collection(db, "users", user.uid, "notifications"), orderBy("date", "desc")), (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-b from-[#0A0B10] via-[#0A0B10]/90 to-transparent z-50 pt-3 pb-8 pointer-events-none">
      <div className="flex justify-between items-center px-4 max-w-[1400px] mx-auto relative pointer-events-auto">
        <FusionLogo className="w-32 md:w-40 h-auto drop-shadow-lg" />
        <div className="flex gap-4 items-center">
          <button onClick={() => setShowNotif(!showNotif)} className="p-2 text-white hover:text-gray-300 transition-colors relative btn-press bg-black/40 rounded-full backdrop-blur-md border border-white/10">
            <Icons.Bell filled={unreadCount > 0} />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF007A] rounded-full animate-pulse shadow-[0_0_10px_#FF007A]"></span>}
          </button>
        </div>

        {showNotif && (
          <div className="absolute top-14 right-4 w-80 bg-[#12141D]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4">
            <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-widest">Notificações</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Nenhuma notificação.</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} onClick={async () => await setDoc(doc(db, "users", user.uid, "notifications", n.id), { read: true }, { merge: true })} className={`p-3 rounded-xl cursor-pointer transition-colors ${n.read ? 'bg-white/5 opacity-70' : 'bg-[#FF007A]/10 border border-[#FF007A]/20'}`}>
                    <h4 className={`text-sm ${n.read ? 'text-gray-300' : 'text-[#FF007A] font-bold'}`}>{n.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{n.desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function BottomNav({ page, setPage, playRandom, navigateToCatalog }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0A0B10]/95 backdrop-blur-2xl border-t border-white/10 pb-safe z-50">
      <div className="flex justify-around items-center p-2 max-w-[1400px] mx-auto">
        <button onClick={() => setPage("home")} className={`flex flex-col items-center p-3 rounded-2xl transition-transform active:scale-95 w-20 relative ${page === "home" ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-gray-500'}`}>
          <span className="text-2xl mb-1"><Icons.Home /></span><span className="text-[10px] font-bold uppercase tracking-widest mt-1">Início</span>
        </button>
        <button onClick={() => navigateToCatalog('all')} className={`flex flex-col items-center p-3 rounded-2xl transition-transform active:scale-95 w-20 relative ${page === "search" ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-gray-500'}`}>
          <span className="text-2xl mb-1"><Icons.Search /></span><span className="text-[10px] font-bold uppercase tracking-widest mt-1">Catálogo</span>
        </button>
        <button onClick={playRandom} className="flex flex-col items-center p-3 rounded-2xl transition-transform active:scale-95 w-20 relative text-[#00F0FF] hover:text-[#FF007A] group">
          <span className="text-3xl mb-1 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] group-hover:drop-shadow-[0_0_10px_rgba(255,0,122,0.5)] transition-all"><Icons.Shuffle /></span><span className="text-[10px] font-bold uppercase tracking-widest text-white">Surpresa</span>
        </button>
        <button onClick={() => setPage("profile")} className={`flex flex-col items-center p-3 rounded-2xl transition-transform active:scale-95 w-20 relative ${page === "profile" ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-gray-500'}`}>
          <span className="text-2xl mb-1"><Icons.User /></span><span className="text-[10px] font-bold uppercase tracking-widest mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}

function HeroCarousel({ items, navigateToPlayer }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  let featured = items.filter(i => !i.isEpisode).slice(0, 5);
  if (featured.length === 0) featured = items.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % featured.length), 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const item = featured[currentIndex];
  const isAnime = item.type === "anime";
  const accentColor = isAnime ? "#00F0FF" : "#FF007A";

  return (
    <div key={item.id} className="relative w-full h-[65vh] md:h-[75vh] bg-black overflow-hidden animate-in fade-in duration-500">
      <img src={item.img} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-[#0A0B10]/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-10 z-10 flex flex-col items-center text-center">
        <div className="flex gap-2 mb-3">
           <span className="bg-black/50 text-white backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded border border-white/20 uppercase tracking-widest shadow-lg">🔥 Destaque</span>
           <span className="bg-black/50 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded border uppercase tracking-widest shadow-lg" style={{borderColor: accentColor, color: accentColor}}>{item.type}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] mb-6 max-w-4xl leading-tight tracking-tight">{item.title}</h1>
        <button onClick={() => navigateToPlayer(item)} className="bg-white text-black px-10 py-4 rounded-full font-black uppercase text-sm shadow-xl active:scale-95 transition-all">Reproduzir</button>
      </div>
    </div>
  );
}

function Home({ user, navigateToPlayer, navigateToCatalog }) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "content"), (snap) => setContent(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user]);

  if (content.length === 0) return <div className="h-screen flex items-center justify-center text-gray-500">Carregando Catálogo...</div>;

  const animes = content.filter(i => i.type === "anime" && !i.isEpisode);
  const doramas = content.filter(i => i.type === "dorama" && !i.isEpisode);
  const episodesMixed = content.filter(i => i.isEpisode);
  const populares = [...content].filter(i => !i.isEpisode).reverse().slice(0, 10);

  return (
    <div className="w-full -mt-24 animate-in fade-in duration-700">
      <HeroCarousel items={content} navigateToPlayer={navigateToPlayer} />
      <div className="space-y-12 max-w-[1400px] mx-auto w-full relative z-20 pb-10 pt-10">
        <Section title="Animes Recentes" items={animes} navigate={navigateToPlayer} accent="#00F0FF" icon="⚔️" user={user} filterType="anime" navigateToCatalog={navigateToCatalog} />
        <Section title="Doramas Recentes" items={doramas} navigate={navigateToPlayer} accent="#FF007A" icon="🎬" user={user} filterType="dorama" navigateToCatalog={navigateToCatalog} />
        {episodesMixed.length > 0 && <Section title="Lançamentos Recentes" items={episodesMixed} type="landscape" navigate={navigateToPlayer} accent="#9900FF" icon="📺" filterType="all" navigateToCatalog={navigateToCatalog} />}
        <Section title="Populares na Nekoverse" items={populares} isRanking accent="#FFD700" icon="👑" navigate={navigateToPlayer} user={user} filterType="all" navigateToCatalog={navigateToCatalog} />
      </div>
    </div>
  );
}
function Section({ title, items, navigate, type, isRanking, accent, icon, user, filterType, navigateToCatalog }) {
  if (items.length === 0) return null;
  return (
    <section className="px-4 md:px-8">
      <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl md:text-3xl">{icon}</span>}
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide" style={{color: accent || 'white'}}>{title}</h2>
        </div>
        <button onClick={() => navigateToCatalog && navigateToCatalog(filterType || 'all')} className="text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-white transition-colors active:scale-95 bg-white/5 px-4 py-2 rounded-lg border border-white/10" style={{color: accent}}>
          Ver Tudo {'>'}
        </button>
      </div>
      <div className="flex overflow-x-auto gap-4 pb-6 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="snap-start shrink-0" onClick={() => navigate && navigate(item)}>
            {type === 'landscape' ? <EpisodeCard item={item} accent={accent} /> : <PosterCard item={item} user={user} accent={accent} rank={isRanking ? index + 1 : null} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function PosterCard({ item, user, accent, rank }) {
  const [isFavorited, setIsFavorited] = useState(false);
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid, "favorites", item.id), (docSnap) => setIsFavorited(docSnap.exists()));
    return () => unsub();
  }, [user, item.id]);

  const toggleFav = async (e) => {
    e.stopPropagation(); if (!user) return;
    const favRef = doc(db, "users", user.uid, "favorites", item.id);
    if (isFavorited) await deleteDoc(favRef); else await setDoc(favRef, { ...item, savedAt: new Date().toISOString() });
  };

  return (
    <div className="w-[150px] md:w-[200px] aspect-[2/3] rounded-[24px] overflow-hidden relative border border-white/5 shadow-xl transition-transform active:scale-95 bg-[#0B0F19] group">
      {rank && <div className="absolute -top-3 -left-3 bg-gradient-to-br from-yellow-400 to-orange-600 text-black w-10 h-10 flex items-center justify-center rounded-xl font-black text-xl z-20 shadow-lg">{rank}</div>}
      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05050A]/90 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-4">
        <h4 className="font-bold text-sm md:text-base text-white truncate drop-shadow-md mb-2">{item.title}</h4>
        <div className="flex justify-between items-center w-full">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10" style={{color: accent || (item.type === 'anime' ? '#00F0FF' : '#FF007A')}}>
            {item.type}
          </span>
          {user && (
            <button onClick={toggleFav} className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 active:scale-90 transition-transform">
              <Icons.Heart filled={isFavorited} className={isFavorited ? "text-red-500 scale-110 transition-transform" : "text-white"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function EpisodeCard({ item, accent }) {
  return (
    <div className="w-[260px] md:w-[320px] relative group cursor-pointer active:scale-95 transition-transform">
      <div className="aspect-video rounded-[20px] overflow-hidden relative border border-white/5 shadow-xl bg-gray-900">
        <img src={item.epImg || item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10]/80 to-transparent"></div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
          <span className="text-white text-[10px] font-bold uppercase tracking-widest" style={{color: item.type === 'anime' ? '#00F0FF' : '#FF007A'}}>{item.type} | {item.ep || "Ep. 1"}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40"><Icons.Play /></div>
        </div>
      </div>
      <div className="mt-3"><h4 className="font-bold text-sm md:text-base text-white truncate px-1">{item.title}</h4></div>
    </div>
  );
}

// 🔍 CATÁLOGO (TEXTOS ATUALIZADOS REQ 10)
function CatalogSearch({ user, navigateToPlayer, initialFilter }) {
  const [content, setContent] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState(initialFilter || "all");
  const [filterGenre, setFilterGenre] = useState("Todos");

  const animeGenres = ["Ação", "Shounen", "Isekai", "Romance", "Yuri", "Yaoi", "Fantasia", "Slice of Life"];
  const doramaGenres = ["Drama", "Romance", "Comédia", "Histórico", "Yuri", "BL", "Thriller", "Melodrama"];

  useEffect(() => { if (initialFilter) setFilterType(initialFilter); }, [initialFilter]);
  useEffect(() => { setFilterGenre("Todos"); }, [filterType]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "content"), (snap) => setContent(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user]);

  const results = content.filter(item => {
    const matchText = item.title?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || item.type === filterType;
    const matchGenre = filterGenre === "Todos" || item.genre === filterGenre; 
    return matchText && matchType && matchGenre;
  });

  return (
    <div className="px-4 pb-10 w-full max-w-[1400px] mx-auto flex flex-col">
      <div className="pt-4 pb-2 w-full">
        {filterType === 'anime' && <h2 className="text-4xl md:text-5xl font-black mb-8 text-center text-[#00F0FF] tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">Catálogo de Animes</h2>}
        {filterType === 'dorama' && <h2 className="text-4xl md:text-5xl font-black mb-8 text-center text-[#FF007A] tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,0,122,0.5)]">Catálogo de Doramas</h2>}
        {filterType === 'all' && <h2 className="text-3xl font-black mb-8 flex items-center gap-3 justify-center md:justify-start"><Icons.Search /> Explorar Catálogo</h2>}

        <div className="relative mb-6 w-full max-w-3xl mx-auto md:mx-0">
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Buscar ${filterType === 'anime' ? 'animes' : filterType === 'dorama' ? 'doramas' : 'títulos'}...`} className="w-full bg-[#12141D] border border-white/10 p-5 pl-14 rounded-2xl text-white outline-none focus:border-[#FF007A] transition-colors shadow-lg text-lg" />
          <div className="absolute left-5 top-5 text-gray-500 scale-125"><Icons.Search /></div>
        </div>

        {filterType === 'all' && (
          <div className="flex bg-[#12141D] p-1.5 rounded-xl border border-white/10 shadow-lg relative mb-6 w-full max-w-2xl mx-auto md:mx-0">
            <button onClick={() => setFilterType('all')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all z-10 active:scale-95 ${filterType === 'all' ? 'text-white' : 'text-gray-500'}`}>Todos</button>
            <button onClick={() => setFilterType('anime')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all z-10 active:scale-95 ${filterType === 'anime' ? 'text-white' : 'text-gray-500'}`}>⚔️ Animes</button>
            <button onClick={() => setFilterType('dorama')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all z-10 active:scale-95 ${filterType === 'dorama' ? 'text-white' : 'text-gray-500'}`}>🎬 Doramas</button>
            <div className={`absolute top-1.5 bottom-1.5 w-[32%] rounded-lg transition-all duration-300 ease-out left-[1.5%] bg-white/10`}></div>
          </div>
        )}

        <div key={filterType} className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl mx-auto md:mx-0">
          {filterType === 'anime' && (
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                <button onClick={()=>setFilterGenre("Todos")} className={`px-6 py-2.5 rounded-full border text-xs font-bold active:scale-95 transition-colors whitespace-nowrap ${filterGenre === "Todos" ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-white/30'}`}>Todos os Animes</button>
                {animeGenres.map(genre => <button key={genre} onClick={()=>setFilterGenre(genre)} className={`px-6 py-2.5 rounded-full border text-xs font-bold active:scale-95 transition-colors whitespace-nowrap ${filterGenre === genre ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-[#00F0FF]/50 hover:text-[#00F0FF]'}`}>{genre}</button>)}
              </div>
            </div>
          )}
          {filterType === 'dorama' && (
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                <button onClick={()=>setFilterGenre("Todos")} className={`px-6 py-2.5 rounded-full border text-xs font-bold active:scale-95 transition-colors whitespace-nowrap ${filterGenre === "Todos" ? 'bg-[#FF007A] text-white border-[#FF007A] shadow-[0_0_15px_rgba(255,0,122,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-white/30'}`}>Todos os Doramas</button>
                {doramaGenres.map(genre => <button key={genre} onClick={()=>setFilterGenre(genre)} className={`px-6 py-2.5 rounded-full border text-xs font-bold active:scale-95 transition-colors whitespace-nowrap ${filterGenre === genre ? 'bg-[#FF007A] text-white border-[#FF007A] shadow-[0_0_15px_rgba(255,0,122,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-[#FF007A]/50 hover:text-[#FF007A]'}`}>{genre}</button>)}
              </div>
            </div>
          )}
        </div>
      </div>
  <div key={filterType + filterGenre + search} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-2 animate-in zoom-in-95 duration-500 w-full">
        {results.length === 0 ? <div className="col-span-full text-center py-20 text-gray-500 w-full">Nenhum título encontrado.</div> : results.map(item => <div key={item.id} onClick={() => navigateToPlayer(item)} className="flex justify-center"><SearchPosterCard item={item} /></div>)}
      </div>
    </div>
  );
}

function SearchPosterCard({ item }) {
  return (
    <div className="w-[150px] md:w-[190px] aspect-[2/3] relative group cursor-pointer active:scale-95 transition-transform">
      <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/5 shadow-xl transition-colors bg-gray-900">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent opacity-90"></div>
      </div>
      <div className="mt-2"><h4 className="font-bold text-sm text-white truncate px-1">{item.title}</h4></div>
    </div>
  );
}

// ▶️ PLAYER UNIVERSAL (INTACTO)
function UniversalPlayer({ user, item, goBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isNotified, setIsNotified] = useState(false); 
  
  const isAnime = item.type === "anime";
  const accentColor = isAnime ? "#00F0FF" : "#FF007A";
  const allGenres = [item.genre, ...(item.extraGenres ? item.extraGenres.split(',').map(g=>g.trim()) : [])].filter(Boolean);

  useEffect(() => {
    if (!user) return;
    const unsubFav = onSnapshot(doc(db, "users", user.uid, "favorites", item.id), (docSnap) => setIsFavorited(docSnap.exists()));
    const unsubNotif = onSnapshot(doc(db, "subscriptions", item.id, "users", user.uid), (docSnap) => setIsNotified(docSnap.exists()));
    return () => { unsubFav(); unsubNotif(); };
  }, [user, item.id]);

  const handleWatch = async () => {
    setIsPlaying(true);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid, "history", item.id), { ...item, watchedAt: new Date().toISOString() });
      await setDoc(doc(db, "global_ranking", user.uid), { name: user.displayName || user.email.split('@')[0], photoURL: user.photoURL || null, score: increment(isAnime ? 1 : 2) }, { merge: true });
    } catch (e) {}
  };

  const toggleFavorite = async () => {
    if (!user) return;
    const favRef = doc(db, "users", user.uid, "favorites", item.id);
    if (isFavorited) await deleteDoc(favRef); else await setDoc(favRef, { ...item, savedAt: new Date().toISOString() });
  };

  const toggleNotify = async () => {
    if (!user) return;
    const subRef = doc(db, "subscriptions", item.id, "users", user.uid);
    if (isNotified) await deleteDoc(subRef); else await setDoc(subRef, { active: true });
  };

  const statusBadge = item.status === 'Completa' 
    ? <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/30">Completa</span>
    : <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/30">{item.status || "Em Lançamento"}</span>;

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white animate-in slide-in-from-right flex flex-col font-sans pb-20">
      <div className="fixed top-0 left-0 w-full p-4 z-[60] flex items-center"><button onClick={goBack} className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 transition-colors"><Icons.ArrowLeft /></button></div>
      <div className="w-full aspect-video relative bg-black shrink-0 z-50">
        {!isPlaying ? <div className="w-full h-full"><img src={item.img} alt="" className="w-full h-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-transparent to-transparent"></div></div> 
        : <div className="w-full h-full bg-black">{item.videoUrl ? <video src={item.videoUrl} controls autoPlay className="w-full h-full object-contain" /> : <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-gray-500">Conectando...</div>}</div>}
      </div>
      <div className="px-5 pt-6 relative z-10 flex flex-col items-center max-w-3xl mx-auto w-full">
        <div className="flex gap-2 mb-4">
          <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">{item.type}</span>
          {statusBadge}
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-center mb-1 text-white leading-tight drop-shadow-md">{item.title}</h1>
        <p className="text-gray-400 text-xs mb-8 text-center font-bold uppercase tracking-widest">
           <span>{item.author || "Nekoverse Studio"}</span><span className="mx-2 text-gray-700">•</span><span style={{color: accentColor}}>{item.ep || "Série"}</span>
        </p>
        {!isPlaying && <button onClick={()=>setIsPlaying(true)} className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg mb-4" style={{backgroundColor: accentColor, color: isAnime ? 'black' : 'white'}}><Icons.Play /> Assistir Agora</button>}
        
        <div className="flex gap-3 w-full mb-3">
          <button onClick={()=>setIsPlaying(true)} className="flex-1 bg-[#12141D] border border-white/5 py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-400 active:scale-95 transition-colors uppercase tracking-widest"><Icons.HistoryRefresh /> <span>Continuar</span></button>
          <button onClick={toggleFavorite} className={`flex-1 border py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition-colors uppercase tracking-widest ${isFavorited ? 'bg-white/10 border-white/20 text-white' : 'bg-[#12141D] border-white/5 text-gray-400'}`}><Icons.Heart filled={isFavorited} className={isFavorited ? "text-red-500" : ""} /> <span>{isFavorited ? 'Salvo' : 'Favoritar'}</span></button>
        </div>
        
        <button onClick={toggleNotify} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition-colors mb-8 border uppercase tracking-widest ${isNotified ? 'bg-white/10 border-white/20 text-white' : 'bg-[#12141D] border-white/5 text-gray-400'}`}><Icons.Bell filled={isNotified} /> {isNotified ? 'Notificação On' : 'Notificar Novos Eps'}</button>
        <div className="flex flex-wrap gap-2 w-full justify-center mb-8">{allGenres.map(g => <span key={g} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-widest">{g}</span>)}</div>
        <div className="w-full mb-8 bg-[#12141D] p-6 rounded-2xl border border-white/5"><h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{color: accentColor}}>Sinopse</h3><p className="text-sm text-gray-400 leading-relaxed">{item.synopsis || "Carregando..."}</p><div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">País: <span className="text-white">{item.country || "Desconhecido"}</span></div></div>
        <div className="w-full"><div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3"><h3 className="text-sm font-bold text-white uppercase tracking-widest">Episódios</h3></div><div className="space-y-3">{[1,2,3,4,5].map(ep => <div key={ep} className="flex items-center gap-4 p-3 bg-[#12141D] border border-white/5 hover:bg-white/10 transition-colors cursor-pointer active:scale-95 rounded-xl group"><div className="w-28 md:w-36 aspect-video bg-gray-800 relative shrink-0 rounded-lg overflow-hidden"><img src={item.epImg || item.img} className="w-full h-full object-cover opacity-60" alt="" /><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Play /></div></div><div className="flex-1"><h4 className="font-bold text-white text-sm">Episódio {ep}</h4><p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">{isAnime ? "24 min" : "1h 05m"}</p></div><Icons.Share /></div>)}</div></div>
      </div>
    </div>
  );
}
// 👤 PERFIL & RANKING (INTACTOS)
function ProfileManager({ user, setUser, navigateToPlayer }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ animes: 0, doramas: 0, hours: 0 });
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(collection(db, "users", user.uid, "history"), (snap) => {
      const historyData = snap.docs.map(d => d.data());
      const animesCount = historyData.filter(i => i.type === 'anime').length;
      const doramasCount = historyData.filter(i => i.type === 'dorama').length;
      setStats({ animes: animesCount, doramas: doramasCount, hours: Math.round((animesCount * 0.4) + (doramasCount * 1)) });
    });
    return () => unsub();
  }, [user?.uid]);
  if (!user) return null;
  return (
    <div className="pb-10 px-4 max-w-7xl mx-auto w-full">
      <div className="flex justify-center mb-8 w-full max-w-md mx-auto">
        <div className="bg-[#12141D] p-1.5 rounded-2xl border border-white/10 flex gap-1 w-full shadow-xl">
          <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>Geral</button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold active:scale-95 transition-all ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>Histórico</button>
          <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold active:scale-95 flex items-center justify-center gap-1 transition-all ${activeTab === 'ranking' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg border border-yellow-500/50' : 'text-yellow-600'}`}><Icons.Trophy /> Ranking</button>
        </div>
      </div>
      <div key={activeTab} className="animate-in fade-in slide-in-from-left-4 duration-300 w-full">
        {activeTab === 'dashboard' && <ProfileOverview user={user} stats={stats} />}
        {activeTab === 'history' && <HistoryTab user={user} navigateToPlayer={navigateToPlayer} />}
        {activeTab === 'ranking' && <RankingTab />}
      </div>
    </div>
  );
}

function ProfileOverview({ user, stats }) {
  return (
    <div className="max-w-4xl mx-auto mt-6 w-full animate-in fade-in">
      <div className="flex flex-col items-center gap-4 mb-10 bg-[#12141D] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden text-center">
        <div className="w-24 h-24 rounded-full border-4 border-[#05050A] bg-gradient-to-tr from-[#00F0FF] to-[#FF007A] p-1 relative shadow-2xl z-10 mx-auto">
           <div className="w-full h-full bg-[#05050A] rounded-full flex items-center justify-center text-4xl overflow-hidden">{user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover"/> : "👤"}</div>
           <button className="absolute bottom-0 right-0 bg-white text-black rounded-full p-1.5 border-2 border-[#12141D] active:scale-95 z-20"><Icons.Edit /></button>
        </div>
        <h1 className="text-2xl font-black text-white">{user.displayName || "Otaku Mestre"}</h1>
        <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">ID: {user.uid.substring(0, 8)}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-[#12141D] border border-white/5 rounded-2xl p-4 text-center"><p className="text-gray-500 text-[10px] uppercase mb-2">Horas</p><p className="text-xl font-black text-white">{stats.hours}h</p></div>
        <div className="bg-[#12141D] border border-[#00F0FF]/20 rounded-2xl p-4 text-center"><p className="text-gray-500 text-[10px] uppercase mb-2">Animes</p><p className="text-xl font-black text-[#00F0FF]">{stats.animes}</p></div>
        <div className="bg-[#12141D] border border-[#FF007A]/20 rounded-2xl p-4 text-center"><p className="text-gray-500 text-[10px] uppercase mb-2">Doramas</p><p className="text-xl font-black text-[#FF007A]">{stats.doramas}</p></div>
      </div>
      <div className="bg-[#12141D] border border-white/5 rounded-3xl overflow-hidden shadow-xl mb-6">
         <ProfileMenuItem icon={<Icons.User />} title="Gerenciar Conta" subtitle="Nome e Avatar" />
         <ProfileMenuItem icon={<Icons.Bell />} title="Notificações" subtitle="Alertas de episódios" />
         <ProfileMenuItem icon={<Icons.Settings />} title="Preferências" subtitle="Reprodução e Qualidade" />
      </div>
      <button onClick={() => signOut(auth)} className="w-full bg-[#12141D] border border-white/5 text-red-500 font-bold p-5 rounded-3xl hover:bg-red-500/10 active:scale-95 transition-colors uppercase text-sm tracking-widest">Sair da Conta</button>
    </div>
  );
}
function RankingTab() {
  const [ranking, setRanking] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "global_ranking"), orderBy("score", "desc"), limit(10));
    const unsub = onSnapshot(q, (snap) => setRanking(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);
  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);
  return (
    <div className="px-4 max-w-4xl mx-auto mt-6 w-full animate-in fade-in">
      <div className="bg-gradient-to-r from-yellow-600/20 via-[#12141D] to-orange-600/20 border border-yellow-500/30 p-6 rounded-3xl mb-10 text-center relative overflow-hidden"><Icons.Trophy className="mx-auto text-yellow-500 w-12 h-12 mb-2 drop-shadow-[0_0_15px_#facc15] relative z-10" /><h2 className="text-2xl font-black text-white relative z-10">Top Nekoverse</h2></div>
      {top3.length > 0 && <div className="flex justify-center items-end gap-2 md:gap-6 mb-10 h-48">
          {top3[1] && <div className="flex flex-col items-center w-24 animate-in slide-in-from-bottom-4"><div className="relative mb-2"><div className="w-14 h-14 rounded-full border-[3px] border-gray-300 overflow-hidden shadow-[0_0_15px_#d1d5db]">{top3[1].photoURL ? <img src={top3[1].photoURL} alt="" className="w-full h-full object-cover"/> : "👤"}</div><div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-300 text-black text-[10px] font-black px-2 rounded-full">#2</div></div><h4 className="text-white text-[10px] font-bold truncate w-full text-center">{top3[1].name}</h4><div className="w-full h-16 bg-gray-300/10 rounded-t-xl mt-2 flex flex-col justify-end pb-2 border-t-2 border-gray-300"><p className="text-sm font-black text-center">{top3[1].score}</p></div></div>}
          {top3[0] && <div className="flex flex-col items-center w-28 relative z-10 animate-in slide-in-from-bottom-8"><Icons.Crown className="text-yellow-400 w-6 h-6 absolute -top-8 animate-pulse" /><div className="relative mb-2"><div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden shadow-[0_0_25px_#facc15]">{top3[0].photoURL ? <img src={top3[0].photoURL} alt="" className="w-full h-full object-cover"/> : "👤"}</div><div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-3 rounded-full shadow-lg">#1</div></div><h4 className="text-yellow-400 text-xs font-bold truncate w-full text-center">{top3[0].name}</h4><div className="w-full h-24 bg-yellow-500/10 rounded-t-xl mt-2 flex flex-col justify-end pb-3 border-t-2 border-yellow-400"><p className="text-xl font-black text-center">{top3[0].score}</p></div></div>}
          {top3[2] && <div className="flex flex-col items-center w-24 animate-in slide-in-from-bottom-4"><div className="relative mb-2"><div className="w-12 h-12 rounded-full border-[3px] border-orange-600 overflow-hidden shadow-[0_0_15px_#ea580c]">{top3[2].photoURL ? <img src={top3[2].photoURL} alt="" className="w-full h-full object-cover"/> : "👤"}</div><div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-[10px] font-black px-2 rounded-full">#3</div></div><h4 className="text-white text-[10px] font-bold truncate w-full text-center">{top3[2].name}</h4><div className="w-full h-12 bg-orange-600/10 rounded-t-xl mt-2 flex flex-col justify-end pb-2 border-t-2 border-orange-600"><p className="text-sm font-black text-center">{top3[2].score}</p></div></div>}
      </div>}
      <div className="space-y-3">{rest.map((user, index) => <div key={user.id} className="flex items-center justify-between bg-[#12141D] p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"><div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full flex items-center justify-center font-black bg-white/5 text-gray-400 text-xs">{index + 4}</div><div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">{user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover"/> : "👤"}</div><h4 className="font-bold text-white text-sm">{user.name}</h4></div><p className="text-[#00F0FF] font-black text-base">{user.score}</p></div>)}</div>
    </div>
  );
}

function HistoryTab({ user, navigateToPlayer }) {
  const [historyItems, setHistoryItems] = useState([]);
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "users", user.uid, "history"), (snap) => setHistoryItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user]);
  return (
    <div className="px-4 max-w-4xl mx-auto mt-6 w-full animate-in fade-in">
      {historyItems.length === 0 ? <p className="text-gray-500 text-center py-10 bg-[#12141D] rounded-2xl border border-white/5">Histórico Vazio</p> : (
        <div className="space-y-4">{historyItems.map((item, i) => <div key={i} onClick={() => navigateToPlayer(item)} className="flex gap-4 bg-[#12141D] border border-white/5 rounded-2xl p-3 hover:bg-white/10 cursor-pointer active:scale-95 transition-all"><div className="w-32 h-20 rounded-xl overflow-hidden relative shrink-0"><img src={item.img} className="w-full h-full object-cover opacity-70" alt="" /></div><div className="flex flex-col justify-center"><h4 className="font-bold text-white text-md">{item.title}</h4><p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{color: item.type === 'anime' ? '#00F0FF' : '#FF007A'}}>{item.type}</p></div></div>)}</div>
      )}
    </div>
  );
}

function ProfileMenuItem({ icon, title, subtitle }) {
  return <div className="flex items-center justify-between p-5 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors active:scale-95"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-gray-400 flex items-center justify-center">{icon}</div><div><h4 className="font-bold text-white text-sm">{title}</h4><p className="text-gray-500 text-xs mt-0.5">{subtitle}</p></div></div><div className="text-gray-600">{'>'}</div></div>;