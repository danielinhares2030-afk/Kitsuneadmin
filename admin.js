const { useState, useEffect } = React;
const { db, CORE_ID } = window; // Usa a base de dados configurada no firebase.js

const AdminApp = () => {
  // Estados para Adicionar Mangá
  const [title, setTitle] = useState('');
  const [img, setImg] = useState('');
  const [type, setType] = useState('Mangá');
  const [status, setStatus] = useState('Lançamento');
  const [genres, setGenres] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [loadingManga, setLoadingManga] = useState(false);

  // Estados para Adicionar Capítulo
  const [mangas, setMangas] = useState([]);
  const [selectedMangaId, setSelectedMangaId] = useState('');
  const [capNum, setCapNum] = useState('');
  const [capTitle, setCapTitle] = useState('');
  const [pages, setPages] = useState('');
  const [loadingCap, setLoadingCap] = useState(false);

  // Carrega a lista de mangás para o Dropdown
  useEffect(() => {
    const unsub = db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').onSnapshot(snap => {
      if(snap) setMangas(snap.docs.map(d => ({id: d.id, ...d.data()})).sort((a,b) => a.title.localeCompare(b.title)));
    });
    return () => unsub();
  }, []);
  const handleAddManga = async (e) => {
    e.preventDefault();
    setLoadingManga(true);
    try {
      const genreArray = genres.split(',').map(g => g.trim()).filter(Boolean);
      await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').add({
        title, img, type, status, sinopse: synopsis, genres: genreArray,
        rating: "5.0", views: 0, cap: "0",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('🔥 Mangá criado com sucesso!');
      setTitle(''); setImg(''); setGenres(''); setSynopsis('');
    } catch (err) {
      alert('Erro: ' + err.message);
    } finally {
      setLoadingManga(false);
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if(!selectedMangaId) return alert('Selecione um mangá!');
    setLoadingCap(true);
    try {
      const pagesArray = pages.split('\n').map(p => p.trim()).filter(Boolean);
      
      // Adiciona o capítulo
      await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').doc(selectedMangaId).collection('capitulos').add({
        numero: capNum,
        titulo: capTitle,
        paginas: pagesArray,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Atualiza o Mangá principal com o último capítulo
      await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').doc(selectedMangaId).update({
        cap: capNum,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      alert('⚡ Capítulo adicionado com sucesso!');
      setCapNum(''); setCapTitle(''); setPages('');
    } catch (err) {
      alert('Erro: ' + err.message);
    } finally {
      setLoadingCap(false);
    }
  };
  return (
    <div className="min-h-screen p-6 md:p-10 font-sans animate-in">
      <header className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black italic text-[#ff2e4d]">KITSUNE <span className="text-white">ADMIN</span></h1>
        <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-bold">Painel de Gestão de Conteúdo</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* FORMULÁRIO: ADICIONAR MANGÁ */}
        <div className="bg-[#111] p-8 rounded-[30px] shadow-2xl border border-white/5">
          <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3"><i className="fa-solid fa-book-open text-[#ff2e4d]"></i> Nova Obra</h2>
          <form onSubmit={handleAddManga} className="space-y-4">
            <input type="text" placeholder="Título do Mangá" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white" />
            <input type="url" placeholder="URL da Capa (Imagem)" value={img} onChange={e=>setImg(e.target.value)} required className="w-full bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white" />
            <div className="flex gap-4">
              <select value={type} onChange={e=>setType(e.target.value)} className="flex-1 bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white">
                <option value="Mangá">Mangá</option><option value="Manhwa">Manhwa</option><option value="Manhua">Manhua</option><option value="Comic">Comic</option>
              </select>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="flex-1 bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white">
                <option value="Lançamento">Lançamento</option><option value="Completo">Completo</option><option value="Hiato">Hiato</option>
              </select>
            </div>
            <input type="text" placeholder="Gêneros (separados por vírgula. Ex: Ação, Romance)" value={genres} onChange={e=>setGenres(e.target.value)} className="w-full bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white" />
            <textarea placeholder="Sinopse da história..." value={synopsis} onChange={e=>setSynopsis(e.target.value)} rows="4" required className="w-full bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white"></textarea>
            <button type="submit" disabled={loadingManga} className="w-full bg-[#ff2e4d] hover:bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-colors">{loadingManga ? 'A SALVAR...' : 'PUBLICAR MANGÁ'}</button>
          </form>
        </div>

        {/* FORMULÁRIO: ADICIONAR CAPÍTULO */}
        <div className="bg-[#111] p-8 rounded-[30px] shadow-2xl border border-white/5">
          <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3"><i className="fa-solid fa-file-image text-blue-500"></i> Novo Capítulo</h2>
          <form onSubmit={handleAddChapter} className="space-y-4">
            <select value={selectedMangaId} onChange={e=>setSelectedMangaId(e.target.value)} required className="w-full bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white font-bold italic">
              <option value="">-- Selecione uma Obra --</option>
              {mangas.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
            <div className="flex gap-4">
               <input type="text" placeholder="Nº Capítulo (Ex: 15)" value={capNum} onChange={e=>setCapNum(e.target.value)} required className="flex-1 bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white" />
               <input type="text" placeholder="Título (Opcional)" value={capTitle} onChange={e=>setCapTitle(e.target.value)} className="flex-1 bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-[#ff2e4d] text-sm text-white" />
            </div>
            <textarea placeholder="Cole os URLs das imagens aqui (UMA POR LINHA)" value={pages} onChange={e=>setPages(e.target.value)} rows="6" required className="w-full bg-[#050505] border border-[#222] p-4 rounded-xl outline-none focus:border-blue-500 text-sm text-gray-300 font-mono text-xs whitespace-nowrap overflow-x-auto"></textarea>
            <button type="submit" disabled={loadingCap} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-colors">{loadingCap ? 'A ENVIAR IMAGENS...' : 'PUBLICAR CAPÍTULO'}</button>
          </form>
        </div>

      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(<AdminApp />);
