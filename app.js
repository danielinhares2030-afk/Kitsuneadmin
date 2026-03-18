// 🔍 CATÁLOGO (COM TÍTULOS REFINADOS)
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
            <button onClick={() => setFilterType('all')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all z-10 btn-press ${filterType === 'all' ? 'text-white' : 'text-gray-500'}`}>Todos</button>
            <button onClick={() => setFilterType('anime')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all z-10 btn-press ${filterType === 'anime' ? 'text-white' : 'text-gray-500'}`}>⚔️ Animes</button>
            <button onClick={() => setFilterType('dorama')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all z-10 btn-press ${filterType === 'dorama' ? 'text-white' : 'text-gray-500'}`}>🎬 Doramas</button>
            <div className={`absolute top-1.5 bottom-1.5 w-[32%] rounded-lg transition-all duration-300 ease-out left-[1.5%] bg-white/10`}></div>
          </div>
        )}

        <div key={filterType} className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-4xl mx-auto md:mx-0">
          {filterType === 'anime' && (
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                <button onClick={()=>setFilterGenre("Todos")} className={`px-6 py-2.5 rounded-full border text-xs font-bold btn-press transition-colors whitespace-nowrap ${filterGenre === "Todos" ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-white/30'}`}>Todos os Animes</button>
                {animeGenres.map(genre => <button key={genre} onClick={()=>setFilterGenre(genre)} className={`px-6 py-2.5 rounded-full border text-xs font-bold btn-press transition-colors whitespace-nowrap ${filterGenre === genre ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-[#00F0FF]/50 hover:text-[#00F0FF]'}`}>{genre}</button>)}
              </div>
            </div>
          )}
          {filterType === 'dorama' && (
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                <button onClick={()=>setFilterGenre("Todos")} className={`px-6 py-2.5 rounded-full border text-xs font-bold btn-press transition-colors whitespace-nowrap ${filterGenre === "Todos" ? 'bg-[#FF007A] text-white border-[#FF007A] shadow-[0_0_15px_rgba(255,0,122,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-white/30'}`}>Todos os Doramas</button>
                {doramaGenres.map(genre => <button key={genre} onClick={()=>setFilterGenre(genre)} className={`px-6 py-2.5 rounded-full border text-xs font-bold btn-press transition-colors whitespace-nowrap ${filterGenre === genre ? 'bg-[#FF007A] text-white border-[#FF007A] shadow-[0_0_15px_rgba(255,0,122,0.4)]' : 'bg-[#12141D] text-gray-400 border-white/10 hover:border-[#FF007A]/50 hover:text-[#FF007A]'}`}>{genre}</button>)}
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
    <div className="w-[150px] md:w-[190px] aspect-[2/3] relative group cursor-pointer btn-press transition-transform">
      <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/5 shadow-xl transition-colors bg-gray-900">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent opacity-90"></div>
      </div>
      <div className="mt-2"><h4 className="font-bold text-sm text-white truncate px-1">{item.title}</h4></div>
    </div>
  );
}
// ▶️ PLAYER UNIVERSAL 
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
      <div className="fixed top-0 left-0 w-full p-4 z-[60] flex items-center"><button onClick={goBack} className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 btn-press"><Icons.ArrowLeft /></button></div>
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
        {!isPlaying && <button onClick={()=>setIsPlaying(true)} className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 btn-press shadow-lg mb-4" style={{backgroundColor: accentColor, color: isAnime ? 'black' : 'white'}}><Icons.Play /> Assistir Agora</button>}
        
        <div className="flex gap-3 w-full mb-3">
          <button onClick={()=>setIsPlaying(true)} className="flex-1 bg-[#12141D] border border-white/5 py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-gray-400 btn-press transition-colors uppercase tracking-widest"><Icons.HistoryRefresh /> <span>Continuar</span></button>
          <button onClick={toggleFavorite} className={`flex-1 border py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold btn-press transition-colors uppercase tracking-widest ${isFavorited ? 'bg-white/10 border-white/20 text-white' : 'bg-[#12141D] border-white/5 text-gray-400'}`}><Icons.Heart filled={isFavorited} className={isFavorited ? "text-red-500" : ""} /> <span>{isFavorited ? 'Salvo' : 'Favoritar'}</span></button>
        </div>
        
        <button onClick={toggleNotify} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold btn-press transition-colors mb-8 border uppercase tracking-widest ${isNotified ? 'bg-white/10 border-white/20 text-white' : 'bg-[#12141D] border-white/5 text-gray-400'}`}><Icons.Bell filled={isNotified} /> {isNotified ? 'Notificação On' : 'Notificar Novos Eps'}</button>
        <div className="flex flex-wrap gap-2 w-full justify-center mb-8">{allGenres.map(g => <span key={g} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-widest">{g}</span>)}</div>
        <div className="w-full mb-8 bg-[#12141D] p-6 rounded-2xl border border-white/5"><h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{color: accentColor}}>Sinopse</h3><p className="text-sm text-gray-400 leading-relaxed">{item.synopsis || "Carregando..."}</p><div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">País: <span className="text-white">{item.country || "Desconhecido"}</span></div></div>
        <div className="w-full"><div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3"><h3 className="text-sm font-bold text-white uppercase tracking-widest">Episódios</h3></div><div className="space-y-3">{[1,2,3,4,5].map(ep => <div key={ep} className="flex items-center gap-4 p-3 bg-[#12141D] border border-white/5 hover:bg-white/10 transition-colors cursor-pointer btn-press rounded-xl group"><div className="w-28 md:w-36 aspect-video bg-gray-800 relative shrink-0 rounded-lg overflow-hidden"><img src={item.epImg || item.img} className="w-full h-full object-cover opacity-60" alt="" /><div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Play /></div></div><div className="flex-1"><h4 className="font-bold text-white text-sm">Episódio {ep}</h4><p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">{isAnime ? "24 min" : "1h 05m"}</p></div><Icons.Share /></div>)}</div></div>
      </div>
    </div>
  );
}
// 👤 PERFIL & RANKING
function ProfileManager({ user, setUser, navigateToPlayer }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeModal, setActiveModal] = useState(null);
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
          <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold btn-press transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>Geral</button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold btn-press transition-all ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>Histórico</button>
          <button onClick={() => setActiveTab('ranking')} className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold btn-press flex items-center justify-center gap-1 transition-all ${activeTab === 'ranking' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg border border-yellow-500/50' : 'text-yellow-600'}`}><Icons.Trophy /> Ranking</button>
        </div>
      </div>
      <div key={activeTab} className="animate-in fade-in slide-in-from-left-4 duration-300 w-full">
        {activeTab === 'dashboard' && <ProfileOverview user={user} stats={stats} openModal={setActiveModal} />}
        {activeTab === 'history' && <HistoryTab user={user} navigateToPlayer={navigateToPlayer} />}
        {activeTab === 'ranking' && <RankingTab />}
      </div>
      {activeModal === 'account' && <ModalAccount user={user} setUser={setUser} close={() => setActiveModal(null)} />}
      {activeModal === 'notifications' && <ModalNotifications close={() => setActiveModal(null)} />}
      {activeModal === 'preferences' && <ModalPreferences close={() => setActiveModal(null)} />}
    </div>
  );
}

function ProfileOverview({ user, stats, openModal }) {
  return (
    <div className="max-w-4xl mx-auto mt-6 w-full animate-in fade-in">
      <div className="flex flex-col items-center gap-4 mb-10 bg-[#12141D] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden text-center">
        <div className="w-24 h-24 rounded-full border-4 border-[#05050A] bg-gradient-to-tr from-[#00F0FF] to-[#FF007A] p-1 relative shadow-2xl z-10 mx-auto">
           <div className="w-full h-full bg-[#05050A] rounded-full flex items-center justify-center text-4xl overflow-hidden">{user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover"/> : "👤"}</div>
           <button onClick={() => openModal('account')} className="absolute bottom-0 right-0 bg-white text-black rounded-full p-1.5 border-2 border-[#12141D] btn-press z-20"><Icons.Edit /></button>
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
         <ProfileMenuItem icon={<Icons.User />} title="Gerenciar Conta" subtitle="Nome e Avatar" onClick={() => openModal('account')} />
         <ProfileMenuItem icon={<Icons.Bell />} title="Notificações" subtitle="Alertas de episódios" onClick={() => openModal('notifications')} />
         <ProfileMenuItem icon={<Icons.Settings />} title="Preferências" subtitle="Reprodução e Qualidade" onClick={() => openModal('preferences')} />
      </div>
      <button onClick={() => signOut(auth)} className="w-full bg-[#12141D] border border-white/5 text-red-500 font-bold p-5 rounded-3xl hover:bg-red-500/10 btn-press transition-colors uppercase text-sm tracking-widest">Sair da Conta</button>
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
        <div className="space-y-4">{historyItems.map((item, i) => <div key={i} onClick={() => navigateToPlayer(item)} className="flex gap-4 bg-[#12141D] border border-white/5 rounded-2xl p-3 hover:bg-white/10 cursor-pointer btn-press transition-all"><div className="w-32 h-20 rounded-xl overflow-hidden relative shrink-0"><img src={item.img} className="w-full h-full object-cover opacity-70" alt="" /></div><div className="flex flex-col justify-center"><h4 className="font-bold text-white text-md">{item.title}</h4><p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{color: item.type === 'anime' ? '#00F0FF' : '#FF007A'}}>{item.type}</p></div></div>)}</div>
      )}
    </div>
  );
}

function ProfileMenuItem({ icon, title, subtitle, onClick }) {
  return <div onClick={onClick} className="flex items-center justify-between p-5 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors btn-press"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-gray-400 flex items-center justify-center">{icon}</div><div><h4 className="font-bold text-white text-sm">{title}</h4><p className="text-gray-500 text-xs mt-0.5">{subtitle}</p></div></div><div className="text-gray-600">{'>'}</div></div>;
}

function ModalAccount({ user, setUser, close }) {
  const [name, setName] = useState(user?.displayName || "");
  const [avatar, setAvatar] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);

  const animeAvatars = [{ id: 'a1', url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Shadow" }, { id: 'a2', url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Light" }];
  const doramaAvatars = [{ id: 'd1', url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" }, { id: 'd2', url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" }];

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try { 
      await updateProfile(user, { displayName: name, photoURL: avatar }); 
      await setDoc(doc(db, "global_ranking", user.uid), { photoURL: avatar, name: name }, { merge: true });
      setUser(prev => ({ ...prev, displayName: name, photoURL: avatar }));
      close();
    } catch (e) {} finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#12141D] border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
        <button onClick={close} className="absolute top-4 right-4 text-gray-500 hover:text-white"><Icons.Close /></button>
        <h2 className="text-2xl font-bold text-white mb-6">Gerenciar Perfil</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-[#00F0FF] uppercase tracking-widest mb-3 block">Escolha seu Avatar</label>
            <div className="grid grid-cols-4 gap-3 mb-4">{[...animeAvatars, ...doramaAvatars].map(av => <div key={av.id} onClick={() => setAvatar(av.url)} className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all btn-press ${avatar === av.url ? 'border-[#00F0FF] scale-105 shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'border-transparent opacity-60 hover:opacity-100 bg-white/5'}`}><img src={av.url} alt="" className="w-full h-full object-cover" /></div>)}</div>
          </div>
          <div><label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Nome</label><input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#00F0FF]" /></div>
          <button type="submit" disabled={saving} className="w-full bg-white text-black font-bold p-4 rounded-xl btn-press">{saving ? "Salvando..." : "Salvar Perfil"}</button>
        </form>
      </div>
    </div>
  );
}

function ModalNotifications({ close }) { return ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in"><div className="bg-[#12141D] border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-2xl"><button onClick={close} className="absolute top-4 right-4 text-gray-500 hover:text-white"><Icons.Close /></button><h2 className="text-2xl font-bold text-white mb-6">Notificações</h2><div className="flex justify-between items-center p-4 bg-white/5 rounded-xl mb-6"><div><p className="font-bold text-white">Novos Episódios</p></div><button className="w-12 h-6 rounded-full bg-[#00F0FF] relative"><div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white"></div></button></div><button onClick={close} className="w-full bg-white text-black font-bold p-4 rounded-xl btn-press">Concluído</button></div></div> ); }
function ModalPreferences({ close }) { return ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in"><div className="bg-[#12141D] border border-white/10 rounded-3xl w-full max-w-md p-6 relative shadow-2xl"><button onClick={close} className="absolute top-4 right-4 text-gray-500 hover:text-white"><Icons.Close /></button><h2 className="text-2xl font-bold text-white mb-6">Reprodução</h2><select className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white mb-6 outline-none"><option>Automático</option><option>1080p</option></select><button onClick={close} className="w-full bg-white text-black font-bold p-4 rounded-xl btn-press">Salvar Preferências</button></div></div> ); }
Política de Privacidade do GoogleAbre em uma nova janela
Termos de Serviço do GoogleAbre em uma nova janela
Sua privacidade e os apps do GeminiAbre em uma nova janela
O Gemini pode apresentar informações imprecisas, inclusive sobre pessoas. Por isso, cheque as respostas. Esse conteúdo foi criado por outra pessoa. Ele pode estar incorreto ou representar riscos.

