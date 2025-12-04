import React, { useEffect, useState } from 'react';
import { mockService } from '../services/mockService';
import { Actor, Movie, ActorStatus, MovieCensorship, MovieStatus } from '../types';
import { Search, Film, X, Filter, ExternalLink, Heart, ChevronLeft, ChevronRight, Calendar, Database, RotateCcw, Edit2, Save, Tag } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const Actors: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [jumpPage, setJumpPage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ActorStatus | 'ALL'>('ALL');
  const [filterFavorite, setFilterFavorite] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [startBirthDate, setStartBirthDate] = useState('');
  const [endBirthDate, setEndBirthDate] = useState('');

  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  
  const [actorMovies, setActorMovies] = useState<Movie[]>([]);
  const [actorMoviesLoading, setActorMoviesLoading] = useState(false);
  const [moviePage, setMoviePage] = useState(1);
  const [moviePageSize] = useState(10);
  const [movieTotalPages, setMovieTotalPages] = useState(1);
  const [movieTotalElements, setMovieTotalElements] = useState(0);
  const [movieJumpPage, setMovieJumpPage] = useState('');

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [movieSearch, setMovieSearch] = useState('');
  const [movieSearchTag, setMovieSearchTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [movieFilterStatus, setMovieFilterStatus] = useState<MovieStatus | 'ALL'>('ALL');
  const [filterCensorship, setFilterCensorship] = useState<MovieCensorship | 'ALL'>('ALL');
  const [filter115, setFilter115] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterNas, setFilterNas] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterFavoriteMovie, setFilterFavoriteMovie] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterHasSehuatang, setFilterHasSehuatang] = useState<'ALL' | 'YES' | 'NO'>('ALL');

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<ActorStatus>(ActorStatus.ACTIVE);
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editProfile, setEditProfile] = useState('');

  useEffect(() => { fetchActors(1); }, []);

  useEffect(() => {
    if (selectedActor) {
      setMovieSearch(''); setMovieSearchTag(''); setStartDate(''); setEndDate('');
      setMovieFilterStatus('ALL'); setFilterCensorship('ALL'); setFilter115('ALL'); setFilterNas('ALL'); setFilterFavoriteMovie('ALL'); setFilterHasSehuatang('ALL');
      setMoviePage(1);
      
      setIsEditing(false);
      setEditStatus(selectedActor.status);
      setEditBirthDate(selectedActor.birthDate || '');
      setEditProfile(selectedActor.profile || '');

      mockService.getTags(selectedActor.id).then(res => setAvailableTags(res.data));
      fetchActorMovies(selectedActor.id, 1);
    }
  }, [selectedActor]);

  const fetchActors = async (pageToFetch: number) => {
      setLoading(true);
      const filters = { searchTerm, status: filterStatus, isFavorite: filterFavorite, startBirthDate, endBirthDate };
      const result = await mockService.getActors(pageToFetch, pageSize, filters);
      setActors(result.data.records); setTotalPages(result.data.pages); setTotalElements(result.data.total); setPage(result.data.current); setLoading(false);
  };

  const fetchActorMovies = async (actorId: string, pageToFetch: number, overrideFilters?: any) => {
      setActorMoviesLoading(true);
      const filters = overrideFilters || {
          actorId, searchTerm: movieSearch, searchTag: movieSearchTag, status: movieFilterStatus,
          censorship: filterCensorship, in115: filter115, inNas: filterNas,
          isFavorite: filterFavoriteMovie, hasSehuatang: filterHasSehuatang, startDate, endDate
      };
      const result = await mockService.getMovies(pageToFetch, moviePageSize, filters);
      setActorMovies(result.data.records); setMovieTotalPages(result.data.pages); setMovieTotalElements(result.data.total); setMoviePage(result.data.current); setActorMoviesLoading(false);
  };

  // Handlers 
  const handleSearch = () => fetchActors(1);
  const handlePageChange = (p: number) => { if (p >= 1 && p <= totalPages) { fetchActors(p); setJumpPage(''); } };
  const handleJumpToPage = () => { const p = parseInt(jumpPage); if (!isNaN(p)) handlePageChange(p); };

  const handleActorMovieSearch = () => { if (selectedActor) fetchActorMovies(selectedActor.id, 1); };
  const handleMoviePageChange = (p: number) => { if (selectedActor && p >= 1 && p <= movieTotalPages) { fetchActorMovies(selectedActor.id, p); setMovieJumpPage(''); } };
  const handleMovieJumpToPage = () => { const p = parseInt(movieJumpPage); if (!isNaN(p)) handleMoviePageChange(p); };

  const toggleActorFavorite = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const actor = actors.find(a => a.id === id);
      if (!actor) return;
      const newFav = !actor.isFavorite;
      setActors(prev => prev.map(a => a.id === id ? { ...a, isFavorite: newFav } : a));
      if (selectedActor && selectedActor.id === id) setSelectedActor(prev => prev ? { ...prev, isFavorite: newFav } : null);
      await mockService.toggleActorFavorite(id);
  };

  const handleSaveActor = async () => {
      if (!selectedActor) return;
      const updates = { status: editStatus, birthDate: editBirthDate, profile: editProfile };
      setSelectedActor(prev => prev ? { ...prev, ...updates } : null);
      setActors(prev => prev.map(a => a.id === selectedActor.id ? { ...a, ...updates } : a));
      await mockService.updateActor(selectedActor.id, updates);
      setIsEditing(false);
  };

  const resetInternalFilters = () => {
      setMovieSearch(''); setMovieSearchTag(''); setStartDate(''); setEndDate('');
      setMovieFilterStatus('ALL'); setFilterCensorship('ALL'); setFilter115('ALL'); setFilterNas('ALL'); setFilterFavoriteMovie('ALL'); setFilterHasSehuatang('ALL');
      if (selectedActor) fetchActorMovies(selectedActor.id, 1, { actorId: selectedActor.id, searchTerm: '', searchTag: '', status: 'ALL', censorship: 'ALL', in115: 'ALL', inNas: 'ALL', isFavorite: 'ALL', hasSehuatang: 'ALL', startDate: '', endDate: '' });
  };

  const updateMovieStatus = async (id: string, newStatus: MovieStatus) => {
    setActorMovies(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    if (selectedMovie && selectedMovie.id === id) setSelectedMovie(prev => prev ? { ...prev, status: newStatus } : null);
    await mockService.updateMovieStatus(id, newStatus);
  };

  const toggleMovieFavorite = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const movie = actorMovies.find(m => m.id === id);
      if (!movie) return;
      const newFav = !movie.isFavorite;
      setActorMovies(prev => prev.map(m => m.id === id ? { ...m, isFavorite: newFav } : m));
      if (selectedMovie && selectedMovie.id === id) setSelectedMovie(prev => prev ? { ...prev, isFavorite: newFav } : null);
      await mockService.toggleMovieFavorite(id);
  };

  return (
    <div className="space-y-6 h-full flex flex-col pb-20 relative">
      {/* ... Content ... */}
      <div className="flex flex-col gap-4 flex-shrink-0">
        <div><h1 className="text-3xl font-bold text-white">演职人员</h1><p className="text-slate-400">浏览演员及其参演作品 ({totalElements} 名)</p></div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                 <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="搜索演员姓名..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                 <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="date" placeholder="出生日期起" value={startBirthDate} onChange={(e) => setStartBirthDate(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" /></div>
                 <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="date" placeholder="出生日期止" value={endBirthDate} onChange={(e) => setEndBirthDate(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" /></div>
                 <div className="relative"><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ActorStatus | 'ALL')} className="w-full appearance-none pl-4 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">全部状态</option><option value={ActorStatus.ACTIVE}>在籍</option><option value={ActorStatus.RETIRED}>退役</option></select><Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} /></div>
                 <div className="relative"><select value={filterFavorite} onChange={(e) => setFilterFavorite(e.target.value as 'ALL' | 'YES' | 'NO')} className="w-full appearance-none pl-4 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">全部演员</option><option value="YES">已收藏</option><option value="NO">未收藏</option></select><Heart className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} /></div>
             </div>
             <div className="flex justify-end pt-2 border-t border-slate-700"><button onClick={handleSearch} className="w-full md:w-auto px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"><Search size={20} /> 立即查询</button></div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden relative">
        {loading ? <div className="w-full h-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div> : (
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 content-start">
            {actors.map((actor) => (
                <div key={actor.id} onClick={() => setSelectedActor(actor)} className={`bg-slate-800 rounded-xl overflow-hidden border cursor-pointer hover:bg-slate-700/50 transition-all group relative ${selectedActor?.id === actor.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-800 hover:border-slate-600'}`}>
                <div className="aspect-square w-full overflow-hidden relative bg-slate-900">
                    <img src={actor.imageUrl} alt={actor.name} className={`w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ${actor.status === ActorStatus.RETIRED ? 'grayscale' : ''}`} />
                    <div className="absolute top-2 right-2 z-10">{actor.status === ActorStatus.ACTIVE ? <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white/20"></span></span> : <span className="inline-block h-3 w-3 rounded-full bg-slate-500 border border-white/20"></span>}</div>
                    <button onClick={(e) => toggleActorFavorite(e, actor.id)} className="absolute top-2 left-2 z-10 p-1.5 rounded-full hover:bg-black/20 transition-colors group/fav">{actor.isFavorite ? <Heart size={18} className="text-red-500 fill-red-500 drop-shadow-md" /> : <Heart size={18} className="text-white/50 drop-shadow-md group-hover/fav:text-white group-hover/fav:scale-110 transition-all" />}</button>
                </div>
                <div className="p-3">
                    <div className="flex justify-between items-start mb-1"><h3 className="text-white font-medium truncate">{actor.name}</h3><span className={`text-[10px] px-1.5 py-0.5 rounded border ${actor.status === ActorStatus.ACTIVE ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>{actor.status === ActorStatus.ACTIVE ? '在籍' : '退役'}</span></div>
                    {actor.birthDate && <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1"><Calendar size={10} /><span>{actor.birthDate}</span></div>}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1"><Film size={12} /><span>{actor.movieCount} 部影片</span></div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {!loading && actors.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-auto bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex-shrink-0">
              <div className="flex items-center gap-4"><button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronLeft size={20} /></button><span className="text-slate-400 text-sm">第 <span className="text-white font-bold">{page}</span> 页，共 {totalPages} 页</span><button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronRight size={20} /></button></div>
              <div className="flex items-center gap-2 border-l border-slate-700 pl-4 ml-2"><input type="number" min="1" max={totalPages} value={jumpPage} onChange={(e) => setJumpPage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()} className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" /><button onClick={handleJumpToPage} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">GO</button></div>
          </div>
      )}

      {selectedActor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedActor(null)}>
             <div className="bg-slate-900 w-full max-w-7xl max-h-[95vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700" onClick={e => e.stopPropagation()}>
                 {/* Left: Info */}
                 <div className="w-full md:w-1/4 lg:w-1/5 bg-slate-950 p-6 flex flex-col items-center border-r border-slate-800 relative flex-shrink-0 overflow-y-auto">
                     <button onClick={() => setSelectedActor(null)} className="absolute top-4 left-4 md:hidden text-slate-400"><X size={24} /></button>
                     <div className="relative mb-4 w-40 h-40 group">
                        <img src={selectedActor.imageUrl} alt={selectedActor.name} className={`w-full h-full rounded-full object-cover object-top border-4 shadow-xl ${selectedActor.status === ActorStatus.ACTIVE ? 'border-green-500' : 'border-slate-600 grayscale'}`} />
                        <button onClick={(e) => toggleActorFavorite(e, selectedActor.id)} className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform cursor-pointer"><Heart size={20} className={`transition-colors ${selectedActor.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-400'}`} /></button>
                        <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-slate-950 ${selectedActor.status === ActorStatus.ACTIVE ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                     </div>
                     <h2 className="text-xl font-bold text-white mb-2 text-center">{selectedActor.name}</h2>
                     <div className="flex flex-col gap-3 w-full mt-2">
                         <div className="flex justify-between items-center py-2 border-b border-slate-800 min-h-[40px]">
                             <span className="text-slate-500 text-xs">状态</span>
                             {isEditing ? (<select value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none"><option value={ActorStatus.ACTIVE}>在籍</option><option value={ActorStatus.RETIRED}>已引退</option></select>) : (<span className={`text-xs font-medium ${selectedActor.status === ActorStatus.ACTIVE ? 'text-green-400' : 'text-slate-500'}`}>{selectedActor.status === ActorStatus.ACTIVE ? '目前在籍' : '已引退'}</span>)}
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-slate-800 min-h-[40px]">
                             <span className="text-slate-500 text-xs">出生日期</span>
                             {isEditing ? (<input type="date" value={editBirthDate} onChange={(e) => setEditBirthDate(e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 w-32 focus:outline-none" />) : (<span className="text-slate-300 text-xs font-mono">{selectedActor.birthDate || '-'}</span>)}
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-slate-800 min-h-[40px]"><span className="text-slate-500 text-xs">收录作品</span><span className="text-indigo-400 text-xs font-bold">{movieTotalElements} 部</span></div>
                     </div>
                     <div className="w-full mt-4 bg-slate-800/50 p-3 rounded-lg border border-slate-800 relative group/profile">
                         <div className="flex justify-between items-center mb-2"><h4 className="text-xs font-bold text-slate-400">简介</h4><button onClick={isEditing ? handleSaveActor : () => setIsEditing(true)} className={`p-1 rounded transition-colors ${isEditing ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-700'}`}>{isEditing ? <Save size={14} /> : <Edit2 size={14} />}</button></div>
                         {isEditing ? <textarea value={editProfile} onChange={(e) => setEditProfile(e.target.value)} className="w-full h-32 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded p-2 resize-none focus:outline-none" placeholder="输入简介..." /> : <p className="text-xs text-slate-300 leading-relaxed text-justify min-h-[60px] whitespace-pre-wrap">{selectedActor.profile || <span className="text-slate-600 italic">暂无简介...</span>}</p>}
                     </div>
                     <div className="mt-auto w-full pt-6">{selectedActor.sourceUrl ? <a href={selectedActor.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 text-xs"><ExternalLink size={14} /> Javbus 资料</a> : <button disabled className="w-full py-2 bg-slate-800/50 text-slate-600 rounded-lg border border-slate-800 cursor-not-allowed flex items-center justify-center gap-2 text-xs"><ExternalLink size={14} /> 无资料链接</button>}</div>
                 </div>

                 {/* Right: Movies */}
                 <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
                     <div className="p-4 border-b border-slate-800 bg-slate-900 z-10 flex flex-col gap-4">
                         <div className="flex justify-between items-center"><h3 className="text-lg font-bold text-white flex items-center gap-2"><Film className="text-indigo-500" size={20} /> 参演作品</h3><button onClick={() => setSelectedActor(null)} className="hidden md:block p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"><X size={24} /></button></div>
                         {/* Internal Filters */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                             <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input type="text" placeholder="搜索番号/标题..." value={movieSearch} onChange={e => setMovieSearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" /></div>
                             <div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><select value={movieSearchTag} onChange={(e) => setMovieSearchTag(e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"><option value="">所有标签</option>{availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}</select></div>
                             <select value={movieFilterStatus} onChange={e => setMovieFilterStatus(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none"><option value="ALL">状态: 全部</option><option value={MovieStatus.IN_LIBRARY}>已入库</option><option value={MovieStatus.TO_DOWNLOAD}>待下载</option><option value={MovieStatus.PENDING}>待处理</option><option value={MovieStatus.EXCLUDED}>已排除</option></select>
                             <select value={filterCensorship} onChange={e => setFilterCensorship(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none"><option value="ALL">码类: 全部</option><option value={MovieCensorship.CENSORED}>有码</option><option value={MovieCensorship.UNCENSORED}>无码</option></select>
                             <div className="flex gap-2"><select value={filter115} onChange={e => setFilter115(e.target.value as any)} className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none"><option value="ALL">115</option><option value="YES">已存</option><option value="NO">未存</option></select><select value={filterNas} onChange={e => setFilterNas(e.target.value as any)} className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none"><option value="ALL">NAS</option><option value="YES">已存</option><option value="NO">未存</option></select></div>
                             <select value={filterHasSehuatang} onChange={e => setFilterHasSehuatang(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none"><option value="ALL">色花堂: 全部</option><option value="YES">有</option><option value="NO">无</option></select>
                             <div className="relative"><Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs focus:outline-none" /></div>
                             <div className="relative"><Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs focus:outline-none" /></div>
                             <div className="flex gap-2 lg:col-span-4 justify-end border-t border-slate-700/50 pt-2 mt-1"><button onClick={handleActorMovieSearch} className="flex items-center justify-center gap-2 px-6 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-md transition-colors shadow-lg shadow-indigo-500/30 font-bold"><Search size={14} /> 立即查询</button><button onClick={resetInternalFilters} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors border border-slate-600"><RotateCcw size={14} /></button></div>
                         </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900/50">
                        {actorMoviesLoading ? <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div> : actorMovies.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {actorMovies.map(movie => (
                              <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} onToggleFavorite={toggleMovieFavorite} onUpdateStatus={updateMovieStatus} />
                          ))}
                          </div>
                        ) : (<div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4"><div className="p-4 bg-slate-800/50 rounded-full"><Database size={32} className="opacity-50" /></div><p>暂无符合条件的影片</p></div>)}
                     </div>

                     {!actorMoviesLoading && actorMovies.length > 0 && (
                        <div className="p-3 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <div className="flex items-center gap-4"><button onClick={() => handleMoviePageChange(moviePage - 1)} disabled={moviePage === 1} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronLeft size={16} /></button><span className="text-slate-400 text-xs">第 <span className="text-white font-bold">{moviePage}</span> / {movieTotalPages} 页</span><button onClick={() => handleMoviePageChange(moviePage + 1)} disabled={moviePage === movieTotalPages} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronRight size={16} /></button></div>
                            <div className="flex items-center gap-2 border-l border-slate-800 pl-4 ml-2"><input type="number" min="1" max={movieTotalPages} value={movieJumpPage} onChange={(e) => setMovieJumpPage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleMovieJumpToPage()} className="w-12 px-1 py-1 bg-slate-800 border border-slate-700 rounded text-center text-white text-xs focus:outline-none" /><button onClick={handleMovieJumpToPage} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">GO</button></div>
                        </div>
                     )}
                 </div>
             </div>
          </div>
      )}

      {selectedMovie && <MovieDetailModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onToggleFavorite={toggleMovieFavorite} onUpdateStatus={updateMovieStatus} />}
    </div>
  );
};