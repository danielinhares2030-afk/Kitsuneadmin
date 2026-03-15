const { useState, useEffect } = React;
const { auth, db, CORE_ID } = window;

const AdminApp = () => {
  const [user, setUser] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [imgbbKey] = useState('84639b3371d4ed8692f40ec29dc1932b');
  const [activeTab, setActiveTab] = useState('mangas'); 
  const [mangasDB, setMangasDB] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [mangaTitle, setMangaTitle] = useState('');
  const [searchSource, setSearchSource] = useState('MangaDex');
  const [mangaCoverFile, setMangaCoverFile] = useState(null); 
  const [mangaSinopse, setMangaSinopse] = useState('');
  const [mangaGenres, setMangaGenres] = useState([]); 
  const [mangaType, setMangaType] = useState('Manhwa'); 
  const [mangaStatus, setMangaStatus] = useState('Lançamento');

  const [selectedMangaId, setSelectedMangaId] = useState('');
  const [capNumber, setCapNumber] = useState('');
  const [capTitle, setCapTitle] = useState('');
  const [uploadMode, setUploadMode] = useState('galeria'); 
  const [capPagesFiles, setCapPagesFiles] = useState([]); 

  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  const allGenres = ['Ação', 'Romance', 'Comédia', 'Fantasia', 'Terror', 'Isekai', 'Shoujo', 'Shounen', 'Drama', 'Aventura', 'Mistério', 'Slice of Life'];
  const allTypes = ['Mangá', 'Manhwa', 'Manhua', 'Comic'];
  const allStatus = ['Lançamento', 'Completo', 'Hiato'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').onSnapshot((snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setMangasDB(list);
    });
    return () => unsub();
  }, [user]);

  const handleAdminLogin = async (e) => {
    e.preventDefault(); setAuthLoading(true);
    try { await auth.signInWithEmailAndPassword(adminEmail, adminPassword); } 
    catch (err) { setErrorMsg("Dados incorretos."); } 
    finally { setAuthLoading(false); }
  };

  const showSuccess = (msg) => { setSuccessMsg(msg); setErrorMsg(''); setTimeout(() => setSuccessMsg(''), 5000); };
  const showError = (msg) => { setErrorMsg(msg); setSuccessMsg(''); setTimeout(() => setErrorMsg(''), 6000); };
  // TRADUTOR AUTOMÁTICO INVISÍVEL
  const translateToPT = async (text) => {
    if (!text) return "";
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt-BR&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();
      return data[0].map(item => item[0]).join('');
    } catch (e) {
      console.error("Erro na tradução:", e);
      return text;
    }
  };

  // BUSCADORES ESPECIALIZADOS
  const handleAutoFill = async () => {
    if (!mangaTitle) return showError("Digite o título da obra primeiro!");
    setLoading(true); setLoadingText(`Buscando em ${searchSource}...`);

    try {
      let foundSinopse = ""; let foundGenres = []; let foundType = ""; 

      if (searchSource === 'MangaDex') {
        const res = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(mangaTitle)}&limit=5`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const manga = json.data[0];
          const desc = manga.attributes?.description || {};
          let rawDesc = desc['pt-br'] || desc['pt'];
          if (!rawDesc) {
            rawDesc = desc['en'] || Object.values(desc)[0] || '';
            if (rawDesc) { setLoadingText("Traduzindo sinopse para PT-BR..."); foundSinopse = await translateToPT(rawDesc); }
          } else { foundSinopse = rawDesc; }
          foundGenres = manga.attributes?.tags?.map(t => t.attributes?.name?.en) || [];
          if (manga.attributes?.publicationDemographic) foundGenres.push(manga.attributes.publicationDemographic);
          const lang = manga.attributes?.originalLanguage;
          if (lang === 'ko') foundType = 'Manhwa'; else if (lang === 'zh') foundType = 'Manhua'; else if (lang === 'ja') foundType = 'Mangá';
        }
      } 
      else if (searchSource === 'Manhwa') {
        const query = `query ($search: String) { Media (search: $search, type: MANGA, countryOfOrigin: "KR") { description(asHtml: false) genres } }`;
        const res = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { search: mangaTitle } }) });
        const json = await res.json();
        if (json.data?.Media) {
          let rawDesc = json.data.Media.description?.replace(/<[^>]*>?/gm, '') || '';
          if (rawDesc) { setLoadingText("Traduzindo Webtoon para PT-BR..."); foundSinopse = await translateToPT(rawDesc); }
          foundGenres = json.data.Media.genres || []; foundType = 'Manhwa';
        }
      } 
      else if (searchSource === 'Manhua') {
        const query = `query ($search: String) { Media (search: $search, type: MANGA, countryOfOrigin: "CN") { description(asHtml: false) genres } }`;
        const res = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { search: mangaTitle } }) });
        const json = await res.json();
        if (json.data?.Media) {
          let rawDesc = json.data.Media.description?.replace(/<[^>]*>?/gm, '') || '';
          if (rawDesc) { setLoadingText("Traduzindo Manhua para PT-BR..."); foundSinopse = await translateToPT(rawDesc); }
          foundGenres = json.data.Media.genres || []; foundType = 'Manhua';
        }
      }
      else if (searchSource === 'Shoujo') {
        const res = await fetch(`https://api.mangadex.org/manga?title=${encodeURIComponent(mangaTitle)}&publicationDemographic[]=shoujo&limit=1`);
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const manga = json.data[0];
          let rawDesc = manga.attributes?.description?.['pt-br'] || manga.attributes?.description?.['en'] || '';
          if (rawDesc && !manga.attributes?.description?.['pt-br']) {
            setLoadingText("Traduzindo Shoujo para PT-BR..."); foundSinopse = await translateToPT(rawDesc);
          } else { foundSinopse = rawDesc; }
          foundGenres = manga.attributes?.tags?.map(t => t.attributes?.name?.en) || [];
          foundGenres.push('Shoujo');
        }
      }
      else if (searchSource === 'AniList') {
        const query = `query ($search: String) { Media (search: $search, type: MANGA) { description(asHtml: false) genres countryOfOrigin } }`;
        const res = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables: { search: mangaTitle } }) });
        const json = await res.json();
        if (json.data?.Media) {
          let rawDesc = json.data.Media.description?.replace(/<[^>]*>?/gm, '') || '';
          if (rawDesc) { setLoadingText("Traduzindo para PT-BR..."); foundSinopse = await translateToPT(rawDesc); }
          foundGenres = json.data.Media.genres || [];
          const country = json.data.Media.countryOfOrigin;
          if (country === 'KR') foundType = 'Manhwa'; else if (country === 'CN' || country === 'TW') foundType = 'Manhua'; else if (country === 'JP') foundType = 'Mangá';
        }
      }

      if (foundSinopse || foundGenres.length > 0) {
        if (foundSinopse) setMangaSinopse(foundSinopse);
        if (foundType) setMangaType(foundType); 

        const mappedGenres = [];
        foundGenres.forEach(g => {
          if (!g) return;
          const lowerG = g.toLowerCase();
          allGenres.forEach(ag => {
            const lowerAg = ag.toLowerCase();
            if (
              lowerG.includes(lowerAg) || 
              (lowerG === 'action' && ag === 'Ação') ||
              (lowerG === 'comedy' && ag === 'Comédia') ||
              (lowerG === 'fantasy' && ag === 'Fantasia') ||
              (lowerG === 'romance' && ag === 'Romance') ||
              ((lowerG === 'horror' || lowerG === 'thriller') && ag === 'Terror') ||
              (lowerG === 'adventure' && ag === 'Aventura') ||
              (lowerG === 'mystery' && ag === 'Mistério') ||
              ((lowerG === 'reincarnation' || lowerG === 'isekai' || lowerG === 'system') && ag === 'Isekai')
            ) { mappedGenres.push(ag); }
          });
        });

        const newGenres = [...new Set([...mangaGenres, ...mappedGenres])];
        if(searchSource === 'Shoujo' && !newGenres.includes('Shoujo')) newGenres.push('Shoujo');
        
        setMangaGenres(newGenres);
        showSuccess(`✨ Dados encontrados e traduzidos com sucesso!`);
      } else {
        showError(`Não encontrado no buscador ${searchSource}.`);
      }
    } catch (err) {
      showError("Erro de comunicação com a base de dados mundial.");
    } finally {
      setLoading(false); setLoadingText('');
    }
  };
  const compressImage = (fileOrBase64, isZip) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width; let height = img.height;
        const MAX_WIDTH = 1080;
        if (width > MAX_WIDTH) { height = Math.floor((height * MAX_WIDTH) / width); width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(dataUrl.split(',')[1]); 
      };
      img.onerror = (err) => reject(err);
      if (isZip) { img.src = "data:image/jpeg;base64," + fileOrBase64; } 
      else { const reader = new FileReader(); reader.onload = (e) => { img.src = e.target.result; }; reader.readAsDataURL(fileOrBase64); }
    });
  };

  const uploadToImgBB = async (base64Image) => {
    try {
      const formData = new URLSearchParams(); formData.append('image', base64Image);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, { method: 'POST', body: formData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      const json = await response.json();
      if (json.success) return json.data.url;
      throw new Error(json.error?.message || "Falha.");
    } catch (err) { throw new Error("Erro de ligação ImgBB."); }
  };

  const toggleGenre = (genre) => {
    if (mangaGenres.includes(genre)) setMangaGenres(mangaGenres.filter(g => g !== genre));
    else setMangaGenres([...mangaGenres, genre]);
  };

  const handleAddManga = async (e) => {
    e.preventDefault();
    if (!mangaTitle || !mangaCoverFile || !mangaSinopse || mangaGenres.length === 0) return alert("Preencha todos os campos e selecione pelo menos 1 Gênero.");
    setLoading(true);
    try {
      setLoadingText('A comprimir e upar a capa...');
      const compressedCapa = await compressImage(mangaCoverFile, false);
      const coverUrl = await uploadToImgBB(compressedCapa);
      
      let origem = 'Outro'; let leitura = 'vertical';
      if(mangaType === 'Mangá') { origem = 'Japão'; leitura = 'pagina'; }
      if(mangaType === 'Manhwa') { origem = 'Coreia'; leitura = 'vertical'; }
      if(mangaType === 'Manhua') { origem = 'China'; leitura = 'vertical'; }
      if(mangaType === 'Comic') { origem = 'EUA'; leitura = 'pagina'; }

      setLoadingText('A guardar na base de dados...');
      await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').add({ 
        title: mangaTitle, img: coverUrl, sinopse: mangaSinopse,
        genres: mangaGenres, cat: mangaGenres[0], type: mangaType, status: mangaStatus, 
        rating: "5.0", cap: "0", views: 0, origem: origem, leitura: leitura, 
        timestamp: firebase.firestore.FieldValue.serverTimestamp() 
      });
      setMangaTitle(''); setMangaCoverFile(null); setMangaSinopse(''); setMangaGenres([]); setFileInputKey(Date.now());
      showSuccess(`Obra "${mangaTitle}" criada!`);
    } catch (err) { showError(`Erro: ${err.message}`); } finally { setLoading(false); setLoadingText(''); }
  };
  const handleZipSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!window.JSZip) { showError("Aguarde a carregar dependências..."); return; }
    setLoading(true); setLoadingText('A extrair ficheiro ZIP...');
    try {
      const zip = new window.JSZip();
      const contents = await zip.loadAsync(file);
      const extractedImages = [];
      for (const filename of Object.keys(contents.files)) {
        const fileData = contents.files[filename];
        if (!fileData.dir && filename.match(/\.(jpg|jpeg|png|webp)$/i)) {
          const base64 = await fileData.async('base64');
          extractedImages.push({ name: filename, base64: base64, isZip: true });
        }
      }
      extractedImages.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
      setCapPagesFiles(extractedImages);
      showSuccess(`ZIP lido! ${extractedImages.length} imagens prontas para upload.`);
    } catch (err) { showError("Erro ao ler ZIP."); } finally { setLoading(false); setLoadingText(''); }
  };

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    setCapPagesFiles(files);
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!selectedMangaId || !capNumber || capPagesFiles.length === 0) return alert("Faltam dados.");
    setLoading(true);
    try {
      const pagesUrls = new Array(capPagesFiles.length);
      const total = capPagesFiles.length;
      const batchSize = 5; 
      
      for (let i = 0; i < total; i += batchSize) {
        const batch = capPagesFiles.slice(i, i + batchSize);
        setLoadingText(`A upar ${i + 1} a ${Math.min(i + batchSize, total)} de ${total}...`);
        
        const batchPromises = batch.map(async (item, index) => {
          const compressed = await compressImage(item.isZip ? item.base64 : item, item.isZip);
          const url = await uploadToImgBB(compressed);
          pagesUrls[i + index] = url;
        });

        await Promise.all(batchPromises);
      }

      setLoadingText('A guardar o capítulo...');
      await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').doc(selectedMangaId).collection('capitulos').add({
        numero: capNumber, titulo: capTitle || `Capítulo ${capNumber}`, paginas: pagesUrls, timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').doc(selectedMangaId).set({ cap: capNumber, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      
      setCapNumber(''); setCapTitle(''); setCapPagesFiles([]); setFileInputKey(Date.now());
      showSuccess(`Capítulo ${capNumber} lançado em tempo recorde!`);
    } catch (err) { showError(`Erro: ${err.message}`); } finally { setLoading(false); setLoadingText(''); }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return alert("Falta título ou mensagem.");
    setLoading(true);
    try {
      await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('notifications').add({
        title: notifTitle, message: notifMsg, timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setNotifTitle(''); setNotifMsg(''); showSuccess("Aviso enviado!");
    } catch (err) { showError(`Erro: ${err.message}`); } finally { setLoading(false); }
  };

  const handleDeleteManga = async (mangaId) => {
    if (!window.confirm("Tem certeza que deseja apagar esta obra?")) return;
    setLoading(true); setDeletingId(mangaId);
    try { await db.collection('artifacts').doc(CORE_ID).collection('public').doc('data').collection('mangas').doc(mangaId).delete(); showSuccess("Apagado com sucesso!"); } 
    catch (err) { showError(err.message); } finally { setLoading(false); setDeletingId(null); }
  };
  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><i className="fa-solid fa-spinner fa-spin text-[#ff2e4d] text-[40px]"></i></div>;

  if (!user) return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center px-4 sm:px-8">
      <div className="max-w-md w-full mx-auto bg-[#111] p-8 rounded-[40px] shadow-2xl border border-white/5">
        <div className="w-16 h-16 bg-[#ff2e4d] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,46,77,0.4)]"><i className="fa-solid fa-lock text-white text-[32px]"></i></div>
        <h2 className="text-3xl font-black italic text-center uppercase tracking-tighter mb-2">Admin</h2>
        {errorMsg && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-xs text-center">{errorMsg}</div>}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input required type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="E-mail" className="w-full bg-[#050505] border border-white/10 py-4 px-4 rounded-2xl outline-none italic font-bold text-[16px] focus:border-[#ff2e4d]" />
          <input required type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Senha" className="w-full bg-[#050505] border border-white/10 py-4 px-4 rounded-2xl outline-none italic font-bold text-[16px] focus:border-[#ff2e4d]" />
          <button type="submit" disabled={authLoading} className="w-full bg-[#ff2e4d] hover:bg-red-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-colors mt-2 shadow-[0_4px_15px_rgba(255,46,77,0.3)]">Entrar</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 overflow-x-hidden">
      <header className="bg-[#111] border-b border-white/5 p-6 flex justify-between shadow-2xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff2e4d] rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(255,46,77,0.5)]"><i className="fa-solid fa-fire text-white text-[20px]"></i></div>
          <div><h1 className="font-black italic uppercase tracking-tighter text-xl">Kitsune <span className="text-[#ff2e4d]">Uploads</span></h1></div>
        </div>
        <button onClick={() => auth.signOut()} className="text-red-500 text-[10px] font-black uppercase flex items-center gap-1 hover:text-red-400 transition-colors"><i className="fa-solid fa-right-from-bracket text-[12px]"></i> Sair</button>
      </header>

      <main className="p-4 sm:p-6 max-w-lg mx-auto w-full">
        <div className="flex bg-[#111] p-1.5 rounded-[20px] mb-8 shadow-xl overflow-x-auto border border-white/5 no-scrollbar">
          <button onClick={() => setActiveTab('mangas')} className={`px-4 py-3 rounded-[15px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'mangas' ? 'bg-[#ff2e4d] text-white shrink-0 shadow-md' : 'text-gray-500 shrink-0 hover:text-gray-300'}`}><i className="fa-solid fa-book-open text-[14px]"></i> Obra</button>
          <button onClick={() => setActiveTab('capitulos')} className={`px-4 py-3 rounded-[15px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'capitulos' ? 'bg-[#ff2e4d] text-white shrink-0 shadow-md' : 'text-gray-500 shrink-0 hover:text-gray-300'} `}><i className="fa-solid fa-layer-group text-[14px]"></i> Caps</button>
          <button onClick={() => setActiveTab('notificacao')} className={`px-4 py-3 rounded-[15px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'notificacao' ? 'bg-[#ff2e4d] text-white shrink-0 shadow-md' : 'text-gray-500 shrink-0 hover:text-gray-300'} `}><i className="fa-solid fa-bell text-[14px]"></i> Avisos</button>
          <button onClick={() => setActiveTab('gerenciar')} className={`px-4 py-3 rounded-[15px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'gerenciar' ? 'bg-[#ff2e4d] text-white shrink-0 shadow-md' : 'text-gray-500 shrink-0 hover:text-gray-300'} `}><i className="fa-solid fa-gear text-[14px]"></i> Gerir</button>
        </div>

        {successMsg && <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-2xl mb-6 text-xs font-bold uppercase flex items-center gap-2"><i className="fa-solid fa-circle-check text-[18px]"></i> {successMsg}</div>}
        {errorMsg && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-xs font-bold uppercase flex items-center gap-2"><i className="fa-solid fa-circle-exclamation text-[18px]"></i> {errorMsg}</div>}

        {activeTab === 'mangas' && (
          <form onSubmit={handleAddManga} className="bg-[#111] p-6 rounded-[30px] space-y-5 shadow-2xl border border-white/5">
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 text-[#ff2e4d]">Criar Nova Obra</h2>
            
            <div className="bg-[#050505] p-4 rounded-2xl border border-blue-500/20">
              <label className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2"><i className="fa-solid fa-wand-magic-sparkles text-[14px]"></i> Auto-Preencher Inteligente</label>
              <input required value={mangaTitle} onChange={e => setMangaTitle(e.target.value)} placeholder="Título Original da Obra" className="w-full bg-[#111] border border-white/10 py-3 px-4 rounded-xl outline-none italic font-bold text-[16px] focus:border-blue-500 text-white mb-3" />
              
              <div className="flex flex-col gap-2">
                <select value={searchSource} onChange={e => setSearchSource(e.target.value)} className="w-full bg-[#111] border border-white/10 px-3 py-3 rounded-xl font-bold text-xs text-gray-300 outline-none focus:border-blue-500 cursor-pointer appearance-none">
                  <option value="MangaDex">MangaDex (Geral)</option>
                  <option value="Manhwa">Base Coreana (Especial Manhwa)</option>
                  <option value="Manhua">Base Chinesa (Especial Manhua)</option>
                  <option value="Shoujo">Base Romance (Especial Shoujo)</option>
                  <option value="AniList">AniList (Acervo Global)</option>
                </select>
                <button type="button" onClick={handleAutoFill} disabled={loading || !mangaTitle} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-black uppercase text-xs flex justify-center items-center gap-2 transition-colors disabled:opacity-50 w-full">
                  <i className="fa-solid fa-magnifying-glass text-[14px]"></i> {loading ? 'Buscando e Traduzindo...' : 'Auto-Preencher'}
                </button>
              </div>
            </div>
            
            <div className="w-full bg-[#050505] border border-dashed border-white/20 p-4 rounded-2xl text-center relative hover:bg-white/5 transition-colors cursor-pointer mt-4">
              <input key={fileInputKey} required type="file" accept="image/*" onChange={e => setMangaCoverFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <i className="fa-solid fa-image text-gray-500 mb-2 text-[24px] block"></i>
              <p className="text-xs font-bold text-gray-400">{mangaCoverFile ? <span className="text-[#ff2e4d]">{mangaCoverFile.name}</span> : "Toque para selecionar a capa"}</p>
            </div>
            
            <textarea required value={mangaSinopse} onChange={e => setMangaSinopse(e.target.value)} placeholder="Sinopse da história..." rows="4" className="w-full bg-[#050505] border border-white/10 p-4 rounded-2xl outline-none italic text-[14px] resize-none focus:border-[#ff2e4d] text-white leading-relaxed"></textarea>
            
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block ml-1">Gêneros</label>
              <div className="flex flex-wrap gap-2">
                {allGenres.map(g => (
                  <button type="button" key={g} onClick={() => toggleGenre(g)} className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors border ${mangaGenres.includes(g) ? 'bg-[#ff2e4d] border-[#ff2e4d] text-white shadow-lg' : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/30'}`}>{g}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block ml-1">Tipo da Obra</label>
                <select value={mangaType} onChange={e => setMangaType(e.target.value)} className="w-full bg-[#050505] border border-white/10 py-3 px-3 rounded-xl font-bold appearance-none text-[16px] focus:border-[#ff2e4d] text-gray-300">
                  {allTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block ml-1">Status</label>
                <select value={mangaStatus} onChange={e => setMangaStatus(e.target.value)} className="w-full bg-[#050505] border border-white/10 py-3 px-3 rounded-xl font-bold appearance-none text-[16px] focus:border-[#ff2e4d] text-gray-300">
                  {allStatus.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#ff2e4d] hover:bg-red-600 transition-colors text-white py-5 rounded-2xl uppercase tracking-widest font-black text-xs mt-4 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,46,77,0.3)]">
               {loading ? <><i className="fa-solid fa-spinner fa-spin mr-2 text-[16px]"></i> Salvando...</> : 'SALVAR OBRA DEFINITIVA'}
            </button>
          </form>
        )}
        {activeTab === 'capitulos' && (
          <form onSubmit={handleAddChapter} className="bg-[#111] p-6 rounded-[30px] space-y-5 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-[#ff2e4d]">Upar Capítulos</h2>
              <span className="bg-[#ff2e4d]/20 border border-[#ff2e4d]/30 text-[#ff2e4d] px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><i className="fa-solid fa-fire text-[10px]"></i> Modo Turbo</span>
            </div>
            
            <select required value={selectedMangaId} onChange={e => setSelectedMangaId(e.target.value)} className="w-full bg-[#050505] border border-white/10 py-4 px-4 rounded-2xl outline-none italic font-bold text-[16px] text-gray-300 focus:border-[#ff2e4d] appearance-none cursor-pointer">
              <option value="">-- Selecione a Obra --</option>
              {mangasDB.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>

            <div className="flex gap-4">
              <input required type="number" step="any" value={capNumber} onChange={e => setCapNumber(e.target.value)} placeholder="Nº Cap (Ex: 1)" className="flex-1 w-full bg-[#050505] border border-white/10 py-4 px-4 rounded-2xl outline-none italic font-bold text-[16px] text-white focus:border-[#ff2e4d]" />
              <input type="text" value={capTitle} onChange={e => setCapTitle(e.target.value)} placeholder="Título (Opcional)" className="flex-1 w-full bg-[#050505] border border-white/10 py-4 px-4 rounded-2xl outline-none italic font-bold text-[16px] text-white focus:border-[#ff2e4d]" />
            </div>

            <div className="flex gap-2 bg-[#050505] p-1.5 rounded-[20px] mb-4 border border-white/5">
              <button type="button" onClick={() => { setUploadMode('galeria'); setCapPagesFiles([]); setFileInputKey(Date.now()); }} className={`flex-1 py-3 rounded-[15px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${uploadMode === 'galeria' ? 'bg-[#ff2e4d] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}><i className="fa-solid fa-image text-[14px]"></i> Galeria</button>
              <button type="button" onClick={() => { setUploadMode('zip'); setCapPagesFiles([]); setFileInputKey(Date.now()); }} className={`flex-1 py-3 rounded-[15px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${uploadMode === 'zip' ? 'bg-[#ff2e4d] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}><i className="fa-solid fa-file-zipper text-[14px]"></i> .ZIP Turbo</button>
            </div>

            <div className="w-full bg-[#050505] border border-dashed border-white/20 p-6 rounded-2xl text-center relative transition-colors hover:bg-white/5 cursor-pointer">
              {uploadMode === 'zip' ? (
                <>
                  <input key={`zip-${fileInputKey}`} required type="file" accept=".zip" onChange={handleZipSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <i className="fa-solid fa-file-zipper text-blue-500 mb-3 text-[32px] block"></i>
                  <p className="text-xs font-bold text-gray-400">{capPagesFiles.length > 0 ? <span className="text-blue-400 font-black">{capPagesFiles.length} imagens extraídas do ZIP!</span> : "Toque para enviar o ficheiro .ZIP"}</p>
                </>
              ) : (
                <>
                  <input key={`gal-${fileInputKey}`} required type="file" accept="image/*" multiple onChange={handleFilesSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <i className="fa-solid fa-cloud-arrow-up text-[#ff2e4d] mb-3 text-[32px] block"></i>
                  <p className="text-xs font-bold text-gray-400">{capPagesFiles.length > 0 ? <span className="text-[#ff2e4d] font-black">{capPagesFiles.length} imagens selecionadas!</span> : "Toque para selecionar da Galeria"}</p>
                </>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#ff2e4d] hover:bg-red-600 transition-colors text-white py-5 rounded-2xl uppercase tracking-widest font-black text-xs mt-4 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,46,77,0.3)]">
               {loading ? <><i className="fa-solid fa-spinner fa-spin inline mr-2 text-[16px]"></i> {loadingText}</> : 'Publicar Capítulo'}
            </button>
          </form>
        )}

        {activeTab === 'notificacao' && (
          <form onSubmit={handleSendNotification} className="bg-[#111] p-6 rounded-[30px] space-y-5 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 text-yellow-500 relative z-10">Enviar Aviso Global</h2>
            <input required value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Título da Notificação" className="relative z-10 w-full bg-[#050505] border border-white/10 py-4 px-4 rounded-2xl outline-none italic font-bold text-[16px] text-white focus:border-yellow-500" />
            <textarea required value={notifMsg} onChange={e => setNotifMsg(e.target.value)} placeholder="Mensagem para os leitores..." rows="4" className="relative z-10 w-full bg-[#050505] border border-white/10 p-4 rounded-2xl outline-none italic text-[16px] text-white resize-none focus:border-yellow-500"></textarea>
            <button type="submit" disabled={loading} className="relative z-10 w-full bg-yellow-500 text-black py-5 rounded-2xl uppercase tracking-widest font-black text-xs mt-4 hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(234,179,8,0.3)]">
               {loading ? <i className="fa-solid fa-spinner fa-spin text-[16px]"></i> : 'Disparar Notificação'}
            </button>
          </form>
        )}

        {activeTab === 'gerenciar' && (
          <div className="bg-[#111] p-6 rounded-[30px] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 text-gray-300 relative z-10">Gerir Obras</h2>
            <div className="space-y-3 relative z-10">
              {mangasDB.length === 0 ? (
                <p className="text-center text-gray-600 font-bold text-xs uppercase tracking-widest py-8">Nenhuma obra no sistema.</p>
              ) : (
                mangasDB.map(manga => (
                  <div key={manga.id} className="bg-[#050505] border border-white/5 p-4 rounded-2xl flex justify-between items-center gap-4 hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                      <img src={manga.img} alt="capa" className="w-12 h-16 object-cover rounded-lg shadow-md" />
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-black italic uppercase text-sm truncate text-white">{manga.title}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Capítulos: {manga.cap}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteManga(manga.id)} disabled={loading} className="w-10 h-10 shrink-0 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                      {deletingId === manga.id && loading ? <i className="fa-solid fa-spinner fa-spin text-[16px]"></i> : <i className="fa-solid fa-trash text-[16px]"></i>}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AdminApp />);
