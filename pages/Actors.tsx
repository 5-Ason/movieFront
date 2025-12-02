import React, { useEffect, useState } from 'react';
import { mockService } from '../services/mockService';
import { Actor, Movie, ActorStatus, MovieCensorship, MovieStatus } from '../types';
import { Search, Film, X, Filter, ExternalLink, Cloud, HardDrive, Ban, CheckCircle, Download, Heart, ChevronLeft, ChevronRight, Calendar, Users, Database, RotateCcw, List, Magnet, Copy, Check, AlertCircle, Link, Tag } from 'lucide-react';

export const Actors: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [jumpPage, setJumpPage] = useState('');

  // Filter State (Inputs)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ActorStatus | 'ALL'>('ALL');
  const [filterFavorite, setFilterFavorite] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  
  // Birth Date Filter
  const [startBirthDate, setStartBirthDate] = useState('');
  const [endBirthDate, setEndBirthDate] = useState('');

  // Detail Modal State
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  
  // --- Actor Movies State (Pagination) ---
  const [actorMovies, setActorMovies] = useState<Movie[]>([]);
  const [actorMoviesLoading, setActorMoviesLoading] = useState(false);
  const [moviePage, setMoviePage] = useState(1);
  const [moviePageSize] = useState(10); // Slightly smaller page size for modal
  const [movieTotalPages, setMovieTotalPages] = useState(1);
  const [movieTotalElements, setMovieTotalElements] = useState(0);
  const [movieJumpPage, setMovieJumpPage] = useState('');

  // --- Movie Detail Modal State (Nested) ---
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // --- Detail Modal Internal Filter State ---
  const [movieSearch, setMovieSearch] = useState('');
  const [movieSearchTag, setMovieSearchTag] = useState(''); // Added Tag Search
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [movieFilterStatus, setMovieFilterStatus] = useState<MovieStatus | 'ALL'>('ALL');
  const [filterCensorship, setFilterCensorship] = useState<MovieCensorship | 'ALL'>('ALL');
  const [filter115, setFilter115] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterNas, setFilterNas] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterFavoriteMovie, setFilterFavoriteMovie] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterHasSehuatang, setFilterHasSehuatang] = useState<'ALL' | 'YES' | 'NO'>('ALL');

  // Available Tags
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    fetchActors(1);
  }, []);

  useEffect(() => {
    if (selectedActor) {
      // Reset internal filters when actor opens
      setMovieSearch('');
      setMovieSearchTag('');
      setStartDate('');
      setEndDate('');
      setMovieFilterStatus('ALL');
      setFilterCensorship('ALL');
      setFilter115('ALL');
      setFilterNas('ALL');
      setFilterFavoriteMovie('ALL');
      setFilterHasSehuatang('ALL');
      setMoviePage(1);
      
      // Fetch tags specific to this actor
      mockService.getTags(selectedActor.id).then(setAvailableTags);

      // Fetch movies for this actor
      fetchActorMovies(selectedActor.id, 1);
    }
  }, [selectedActor]);

  const fetchActors = async (pageToFetch: number) => {
      setLoading(true);
      const filters = {
          searchTerm,
          status: filterStatus,
          isFavorite: filterFavorite,
          startBirthDate,
          endBirthDate
      };
      
      const result = await mockService.getActors(pageToFetch, pageSize, filters);
      setActors(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setPage(result.number);
      setLoading(false);
  };

  const fetchActorMovies = async (actorId: string, pageToFetch: number, overrideFilters?: any) => {
      setActorMoviesLoading(true);
      const filters = overrideFilters || {
          actorId: actorId,
          searchTerm: movieSearch,
          searchTag: movieSearchTag,
          status: movieFilterStatus,
          censorship: filterCensorship,
          in115: filter115,
          inNas: filterNas,
          isFavorite: filterFavoriteMovie,
          hasSehuatang: filterHasSehuatang,
          startDate,
          endDate
      };

      const result = await mockService.getMovies(pageToFetch, moviePageSize, filters);
      setActorMovies(result.content);
      setMovieTotalPages(result.totalPages);
      setMovieTotalElements(result.totalElements);
      setMoviePage(result.number);
      setActorMoviesLoading(false);
  };

  const handleSearch = () => {
      fetchActors(1);
  };

  const handleActorMovieSearch = () => {
      if (selectedActor) {
          fetchActorMovies(selectedActor.id, 1);
      }
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchActors(newPage);
          setJumpPage('');
      }
  };

  const handleMoviePageChange = (newPage: number) => {
      if (selectedActor && newPage >= 1 && newPage <= movieTotalPages) {
          fetchActorMovies(selectedActor.id, newPage);
          setMovieJumpPage('');
      }
  };

  const handleJumpToPage = () => {
      const p = parseInt(jumpPage, 10);
      if (!isNaN(p)) {
          handlePageChange(p);
      }
  };

  const handleMovieJumpToPage = () => {
      const p = parseInt(movieJumpPage, 10);
      if (!isNaN(p)) {
          handleMoviePageChange(p);
      }
  };

  // Movie Actions (Mirrored from Movies.tsx)
  const updateMovieStatus = async (id: string, newStatus: MovieStatus) => {
    setActorMovies(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    if (selectedMovie && selectedMovie.id === id) {
        setSelectedMovie(prev => prev ? { ...prev, status: newStatus } : null);
    }
    await mockService.updateMovieStatus(id, newStatus);
  };

  const toggleMovieFavorite = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const movie = actorMovies.find(m => m.id === id);
      if (!movie) return;
      const newFav = !movie.isFavorite;
      
      setActorMovies(prev => prev.map(m => m.id === id ? { ...m, isFavorite: newFav } : m));
      if (selectedMovie && selectedMovie.id === id) {
          setSelectedMovie(prev => prev ? { ...prev, isFavorite: newFav } : null);
      }
      await mockService.toggleMovieFavorite(id);
  };

  const copyToClipboard = (text: string, id?: string) => {
      navigator.clipboard.writeText(text).then(() => {
          setCopiedLink(id || text);
          setTimeout(() => setCopiedLink(null), 2000);
      });
  };

  const resetInternalFilters = () => {
      setMovieSearch('');
      setMovieSearchTag('');
      setStartDate('');
      setEndDate('');
      setMovieFilterStatus('ALL');
      setFilterCensorship('ALL');
      setFilter115('ALL');
      setFilterNas('ALL');
      setFilterFavoriteMovie('ALL');
      setFilterHasSehuatang('ALL');
      if (selectedActor) {
          // Pass default empty filters explicitly to fix stale state issue
          fetchActorMovies(selectedActor.id, 1, {
              actorId: selectedActor.id,
              searchTerm: '',
              searchTag: '',
              status: 'ALL',
              censorship: 'ALL',
              in115: 'ALL',
              inNas: 'ALL',
              isFavorite: 'ALL',
              hasSehuatang: 'ALL',
              startDate: '',
              endDate: ''
          });
      }
  };

  // Helper Functions
  const getStatusBadge = (status: MovieStatus) => {
      switch (status) {
          case MovieStatus.IN_LIBRARY:
              return { icon: <CheckCircle size={14} />, label: '已入库', color: 'bg-emerald-600 text-white' };
          case MovieStatus.TO_DOWNLOAD:
              return { icon: <Download size={14} />, label: '待下载', color: 'bg-blue-600 text-white' };
          case MovieStatus.EXCLUDED:
              return { icon: <Ban size={14} />, label: '已排除', color: 'bg-slate-600 text-slate-200' };
          default:
              return { icon: <List size={14} />, label: '待处理', color: 'bg-amber-600 text-white' };
      }
  };

  const getIgnoreStatusInfo = (status: number) => {
      switch (status) {
          case 1: return { label: '存在无码资源', color: 'bg-yellow-600 border-yellow-500' };
          case 2: return { label: '存在字幕资源', color: 'bg-green-600 border-green-500' };
          default: return null;
      }
  };

  const isStatusLocked = selectedMovie?.status === MovieStatus.IN_LIBRARY;

  return (
    <div className="space-y-6 h-full flex flex-col pb-20 relative">
      <div className="flex flex-col gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white">演职人员</h1>
          <p className="text-slate-400">浏览演员及其参演作品 ({totalElements} 名)</p>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-4">
             {/* Row 1 */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="搜索演员姓名..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
                 
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="date"
                      placeholder="出生日期起"
                      value={startBirthDate}
                      onChange={(e) => setStartBirthDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    />
                 </div>
                 
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="date"
                      placeholder="出生日期止"
                      value={endBirthDate}
                      onChange={(e) => setEndBirthDate(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    />
                 </div>

                 {/* Status Filter */}
                 <div className="relative">
                    <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as ActorStatus | 'ALL')}
                    className="w-full appearance-none pl-4 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                    <option value="ALL">全部状态</option>
                    <option value={ActorStatus.ACTIVE}>在籍</option>
                    <option value={ActorStatus.RETIRED}>退役</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                 </div>

                 {/* Favorite Filter */}
                 <div className="relative">
                    <select
                    value={filterFavorite}
                    onChange={(e) => setFilterFavorite(e.target.value as 'ALL' | 'YES' | 'NO')}
                    className="w-full appearance-none pl-4 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                    <option value="ALL">全部演员</option>
                    <option value="YES">已收藏</option>
                    <option value="NO">未收藏</option>
                    </select>
                    <Heart className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                 </div>
             </div>
             
             {/* Search Button */}
             <div className="flex justify-end pt-2 border-t border-slate-700">
                  <button 
                    onClick={handleSearch}
                    className="w-full md:w-auto px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
                  >
                      <Search size={20} /> 立即查询
                  </button>
             </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden relative">
        {/* Actors Grid - Always Full Width */}
        {loading ? (
           <div className="w-full h-full flex items-center justify-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
           </div>
        ) : (
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 content-start">
            {actors.map((actor) => (
                <div 
                key={actor.id} 
                onClick={() => setSelectedActor(actor)}
                className={`
                    bg-slate-800 rounded-xl overflow-hidden border cursor-pointer hover:bg-slate-700/50 transition-all group relative
                    ${selectedActor?.id === actor.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-800 hover:border-slate-600'}
                `}
                >
                <div className="aspect-square w-full overflow-hidden relative bg-slate-900">
                    <img 
                    src={actor.imageUrl} 
                    alt={actor.name} 
                    className={`w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ${actor.status === ActorStatus.RETIRED ? 'grayscale' : ''}`}
                    />
                    
                    {/* Status Dot */}
                    <div className="absolute top-2 right-2 z-10">
                        {actor.status === ActorStatus.ACTIVE ? (
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white/20"></span>
                            </span>
                        ) : (
                            <span className="inline-block h-3 w-3 rounded-full bg-slate-500 border border-white/20"></span>
                        )}
                    </div>

                    {/* Favorite Icon */}
                    {actor.isFavorite && (
                        <div className="absolute top-2 left-2 z-10">
                            <Heart size={16} className="text-red-500 fill-red-500 drop-shadow-md" />
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-white font-medium truncate">{actor.name}</h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            actor.status === ActorStatus.ACTIVE 
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                            {actor.status === ActorStatus.ACTIVE ? '在籍' : '退役'}
                        </span>
                    </div>
                    {actor.birthDate && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                            <Calendar size={10} />
                            <span>{actor.birthDate}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <Film size={12} />
                        <span>{actor.movieCount} 部影片</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && actors.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-auto bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                  <button 
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
                  >
                      <ChevronLeft size={20} />
                  </button>
                  
                  <span className="text-slate-400 text-sm">
                      第 <span className="text-white font-bold">{page}</span> 页，共 {totalPages} 页
                  </span>
                  
                  <button 
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
                  >
                      <ChevronRight size={20} />
                  </button>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-700 pl-4 ml-2">
                   <span className="text-slate-500 text-sm">跳转到</span>
                   <input 
                      type="number" 
                      min="1" 
                      max={totalPages}
                      value={jumpPage}
                      onChange={(e) => setJumpPage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
                      className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                   />
                   <span className="text-slate-500 text-sm">页</span>
                   <button 
                      onClick={handleJumpToPage}
                      className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
                   >
                       GO
                   </button>
              </div>
          </div>
      )}

      {/* Actor Detail Modal */}
      {selectedActor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedActor(null)}>
             <div 
                className="bg-slate-900 w-full max-w-7xl max-h-[95vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700"
                onClick={e => e.stopPropagation()}
             >
                 {/* Left Column: Profile Info */}
                 <div className="w-full md:w-1/4 lg:w-1/5 bg-slate-950 p-6 flex flex-col items-center border-r border-slate-800 relative flex-shrink-0 overflow-y-auto">
                     <button onClick={() => setSelectedActor(null)} className="absolute top-4 left-4 md:hidden text-slate-400">
                         <X size={24} />
                     </button>

                     <div className="relative mb-4 w-40 h-40">
                        <img 
                            src={selectedActor.imageUrl} 
                            alt={selectedActor.name} 
                            className={`w-full h-full rounded-full object-cover object-top border-4 shadow-xl ${selectedActor.status === ActorStatus.ACTIVE ? 'border-green-500' : 'border-slate-600 grayscale'}`}
                        />
                        {selectedActor.isFavorite && (
                            <div className="absolute top-0 right-0 bg-white rounded-full p-1.5 shadow-md">
                                <Heart size={20} className="text-red-500 fill-red-500" />
                            </div>
                        )}
                        <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-slate-950 ${selectedActor.status === ActorStatus.ACTIVE ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                     </div>

                     <h2 className="text-xl font-bold text-white mb-2 text-center">{selectedActor.name}</h2>
                     
                     <div className="flex flex-col gap-2 w-full mt-2">
                         <div className="flex justify-between items-center py-2 border-b border-slate-800">
                             <span className="text-slate-500 text-xs">状态</span>
                             <span className={`text-xs font-medium ${selectedActor.status === ActorStatus.ACTIVE ? 'text-green-400' : 'text-slate-500'}`}>
                                 {selectedActor.status === ActorStatus.ACTIVE ? '目前在籍' : '已引退'}
                             </span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-slate-800">
                             <span className="text-slate-500 text-xs">出生日期</span>
                             <span className="text-slate-300 text-xs font-mono">{selectedActor.birthDate || '-'}</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-slate-800">
                             <span className="text-slate-500 text-xs">收录作品</span>
                             <span className="text-indigo-400 text-xs font-bold">{movieTotalElements} 部</span>
                         </div>
                     </div>

                     {/* Profile Section */}
                     {selectedActor.profile && (
                         <div className="w-full mt-4 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                             <h4 className="text-xs font-bold text-slate-400 mb-2">简介</h4>
                             <p className="text-xs text-slate-300 leading-relaxed text-justify">
                                 {selectedActor.profile}
                             </p>
                         </div>
                     )}

                     <div className="mt-auto w-full pt-6">
                         {selectedActor.sourceUrl ? (
                            <a 
                                href={selectedActor.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 text-xs"
                            >
                                <ExternalLink size={14} /> Javbus 资料
                            </a>
                         ) : (
                             <button disabled className="w-full py-2 bg-slate-800/50 text-slate-600 rounded-lg border border-slate-800 cursor-not-allowed flex items-center justify-center gap-2 text-xs">
                                 <ExternalLink size={14} /> 无资料链接
                             </button>
                         )}
                     </div>
                 </div>

                 {/* Right Column: Movies */}
                 <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
                     {/* Internal Header & Filters */}
                     <div className="p-4 border-b border-slate-800 bg-slate-900 z-10 flex flex-col gap-4">
                         <div className="flex justify-between items-center">
                             <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                 <Film className="text-indigo-500" size={20} /> 参演作品
                             </h3>
                             <button onClick={() => setSelectedActor(null)} className="hidden md:block p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors">
                                 <X size={24} />
                             </button>
                         </div>
                         
                         {/* Rich Filters Grid (Matching Movies.tsx) */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                             {/* Search */}
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="搜索番号/标题..." 
                                    value={movieSearch}
                                    onChange={e => setMovieSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                             </div>
                             
                             {/* Tag Search */}
                             <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select value={movieSearchTag} onChange={(e) => setMovieSearchTag(e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer">
                                    <option value="">所有标签</option>
                                    {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                                </select>
                             </div>

                             {/* Status */}
                             <select
                                value={movieFilterStatus}
                                onChange={e => setMovieFilterStatus(e.target.value as any)}
                                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                             >
                                <option value="ALL">状态: 全部</option>
                                <option value={MovieStatus.IN_LIBRARY}>已入库</option>
                                <option value={MovieStatus.TO_DOWNLOAD}>待下载</option>
                                <option value={MovieStatus.PENDING}>待处理</option>
                                <option value={MovieStatus.EXCLUDED}>已排除</option>
                             </select>

                             {/* Censorship */}
                             <select
                                value={filterCensorship}
                                onChange={e => setFilterCensorship(e.target.value as any)}
                                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                             >
                                <option value="ALL">码类: 全部</option>
                                <option value={MovieCensorship.CENSORED}>有码</option>
                                <option value={MovieCensorship.UNCENSORED}>无码</option>
                             </select>

                             {/* Storage & Fav */}
                             <div className="flex gap-2">
                                 <select
                                    value={filter115}
                                    onChange={e => setFilter115(e.target.value as any)}
                                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                 >
                                    <option value="ALL">115</option>
                                    <option value="YES">已存</option>
                                    <option value="NO">未存</option>
                                 </select>
                                 <select
                                    value={filterNas}
                                    onChange={e => setFilterNas(e.target.value as any)}
                                    className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                 >
                                    <option value="ALL">NAS</option>
                                    <option value="YES">已存</option>
                                    <option value="NO">未存</option>
                                 </select>
                             </div>

                             {/* Sehuatang Filter */}
                             <select
                                value={filterHasSehuatang}
                                onChange={e => setFilterHasSehuatang(e.target.value as any)}
                                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                             >
                                <option value="ALL">色花堂: 全部</option>
                                <option value="YES">色花堂: 有</option>
                                <option value="NO">色花堂: 无</option>
                             </select>

                             {/* Date Range */}
                             <div className="relative">
                                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                />
                             </div>
                             <div className="relative">
                                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                />
                             </div>
                             
                             <div className="flex gap-2 lg:col-span-4 justify-end border-t border-slate-700/50 pt-2 mt-1">
                                <button onClick={handleActorMovieSearch} className="flex items-center justify-center gap-2 px-6 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-md transition-colors shadow-lg shadow-indigo-500/30 font-bold"><Search size={14} /> 立即查询</button>
                                <button onClick={resetInternalFilters} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors border border-slate-600"><RotateCcw size={14} /></button>
                             </div>
                         </div>
                     </div>

                     {/* Scrollable Movie Grid (Rich Cards) */}
                     <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900/50">
                        {actorMoviesLoading ? (
                            <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>
                        ) : actorMovies.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {actorMovies.map(movie => {
                              const badge = getStatusBadge(movie.status);
                              return (
                                <div key={movie.id} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-indigo-500/50 transition-all group flex flex-col shadow-lg relative">
                                    <div className="relative aspect-[3/2] w-full bg-slate-950 cursor-pointer" onClick={() => setSelectedMovie(movie)}>
                                        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                        
                                        {/* Badges */}
                                        <div className="absolute top-1 left-1 flex gap-1">
                                            <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold shadow-sm ${movie.censorship === MovieCensorship.CENSORED ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}`}>
                                                {movie.censorship === MovieCensorship.CENSORED ? '有码' : '无码'}
                                            </span>
                                            {movie.isMultiActor && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white shadow-md flex items-center gap-0.5">
                                                    <Users size={8} /> 共演
                                                </span>
                                            )}
                                        </div>

                                        {/* Storage Status */}
                                        <div className="absolute top-1 right-1 flex flex-col gap-1 items-end">
                                            <div className="flex gap-1">
                                                <div className={`p-1 rounded-full backdrop-blur-md transition-colors ${movie.in115 ? 'bg-blue-600 text-white' : 'bg-black/50 text-slate-500'}`} title={movie.in115 ? "115" : "未存"}>
                                                    <Cloud size={10} />
                                                </div>
                                                <div className={`p-1 rounded-full backdrop-blur-md transition-colors ${movie.inNas ? 'bg-emerald-600 text-white' : 'bg-black/50 text-slate-500'}`} title={movie.inNas ? "NAS" : "未存"}>
                                                    <HardDrive size={10} />
                                                </div>
                                            </div>
                                            <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 backdrop-blur-md mt-0.5 ${badge.color}`}>
                                                {badge.icon} {badge.label}
                                            </div>
                                        </div>
                                        
                                        {/* Hover Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {movie.status !== MovieStatus.TO_DOWNLOAD && movie.status !== MovieStatus.IN_LIBRARY && (
                                                <button onClick={(e) => { e.stopPropagation(); updateMovieStatus(movie.id, MovieStatus.TO_DOWNLOAD); }} className="p-2 rounded-full bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors" title="加入待下载"><Download size={16} /></button>
                                            )}
                                            {movie.status !== MovieStatus.EXCLUDED && movie.status !== MovieStatus.IN_LIBRARY && (
                                                <button onClick={(e) => { e.stopPropagation(); updateMovieStatus(movie.id, MovieStatus.EXCLUDED); }} className="p-2 rounded-full bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors" title="排除"><Ban size={16} /></button>
                                            )}
                                            {movie.status !== MovieStatus.PENDING && movie.status !== MovieStatus.IN_LIBRARY && (
                                                <button onClick={(e) => { e.stopPropagation(); updateMovieStatus(movie.id, MovieStatus.PENDING); }} className="p-2 rounded-full bg-slate-700 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors" title="重置"><RotateCcw size={16} /></button>
                                            )}
                                        </div>

                                        <button onClick={(e) => toggleMovieFavorite(e, movie.id)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100">
                                            <Heart size={24} className={`drop-shadow-md transition-colors ${movie.isFavorite ? 'text-red-500 fill-red-500' : 'text-white/30 hover:text-white/80'}`} />
                                        </button>
                                    </div>
                                    
                                    <div className="p-2 flex flex-col gap-1 flex-1">
                                        <h4 className="text-white font-bold text-xs truncate leading-tight" title={movie.transTitle || movie.title}>{movie.transTitle || movie.title}</h4>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
                                            <span className="font-mono">{movie.releaseDate}</span>
                                            <span className="truncate max-w-[60px]">{movie.studio}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-auto pt-1">
                                            {movie.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[9px] px-1 py-0.5 bg-slate-700 text-slate-400 rounded">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                              );
                          })}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                            <div className="p-4 bg-slate-800/50 rounded-full">
                                <Database size={32} className="opacity-50" />
                            </div>
                            <p>暂无符合条件的影片</p>
                          </div>
                        )}
                     </div>

                     {/* Movie Pagination */}
                     {!actorMoviesLoading && actorMovies.length > 0 && (
                        <div className="p-3 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleMoviePageChange(moviePage - 1)} disabled={moviePage === 1} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronLeft size={16} /></button>
                                <span className="text-slate-400 text-xs">第 <span className="text-white font-bold">{moviePage}</span> / {movieTotalPages} 页</span>
                                <button onClick={() => handleMoviePageChange(moviePage + 1)} disabled={moviePage === movieTotalPages} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronRight size={16} /></button>
                            </div>
                            <div className="flex items-center gap-2 border-l border-slate-800 pl-4 ml-2">
                                <input type="number" min="1" max={movieTotalPages} value={movieJumpPage} onChange={(e) => setMovieJumpPage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleMovieJumpToPage()} className="w-12 px-1 py-1 bg-slate-800 border border-slate-700 rounded text-center text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="页码"/>
                                <button onClick={handleMovieJumpToPage} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">GO</button>
                            </div>
                        </div>
                     )}
                 </div>
             </div>
          </div>
      )}

      {/* Nested Movie Detail Modal (Same as Movies.tsx) */}
      {selectedMovie && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMovie(null)}>
           <div className="bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700" onClick={e => e.stopPropagation()}>
              
              {/* Left Column */}
              <div className="w-full md:w-5/12 bg-black relative flex items-center justify-center bg-slate-950">
                  <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="w-full h-full object-contain opacity-90" />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <span className={`px-3 py-1 rounded-md text-sm font-bold shadow-lg ${selectedMovie.censorship === MovieCensorship.CENSORED ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}`}>{selectedMovie.censorship === MovieCensorship.CENSORED ? '有码' : '无码'}</span>
                     {selectedMovie.isMultiActor && <span className="px-3 py-1 rounded-md text-sm font-bold bg-orange-600 text-white shadow-lg flex items-center gap-1"><Users size={14} /> 多人共演</span>}
                  </div>
                  <button onClick={(e) => toggleMovieFavorite(e, selectedMovie.id)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/20 transition-colors group/fav"><Heart size={32} className={`drop-shadow-xl transition-all ${selectedMovie.isFavorite ? 'text-red-500 fill-red-500 scale-110' : 'text-white/50 group-hover/fav:text-white/80'}`} /></button>
              </div>
              <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-900 flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <h2 className="text-3xl font-bold text-white mb-1">{selectedMovie.transTitle || selectedMovie.title}</h2>
                          {selectedMovie.transTitle ? <h3 className="text-lg text-indigo-400 font-mono font-semibold mb-2">{selectedMovie.title}</h3> : <p className="text-indigo-400 font-mono font-semibold mb-2">{selectedMovie.sourceCode}</p>}
                          <p className="text-slate-400 text-sm leading-relaxed">{selectedMovie.transDescription || selectedMovie.description}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                          {selectedMovie.sourceUrl && <a href={selectedMovie.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700" title="打开 Javbus 页面"><ExternalLink size={20} /></a>}
                          <button onClick={() => setSelectedMovie(null)} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"><X size={24} /></button>
                      </div>
                  </div>
                  
                  {/* Status Buttons */}
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                          <h3 className="text-sm font-semibold text-slate-300">状态管理</h3>
                          <div className="flex gap-3">
                              <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${selectedMovie.in115 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-700/50 border-slate-600 text-slate-500'}`}><Cloud size={12} /> 115网盘</div>
                              <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${selectedMovie.inNas ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-700/50 border-slate-600 text-slate-500'}`}><HardDrive size={12} /> 本地NAS</div>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button disabled={true} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all cursor-not-allowed opacity-80 ${selectedMovie.status === MovieStatus.IN_LIBRARY ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-700 text-slate-500 border-slate-600'}`}><CheckCircle size={18} /> <span className="text-xs">已入库</span></button>
                          <button disabled={isStatusLocked} onClick={() => updateMovieStatus(selectedMovie.id, MovieStatus.TO_DOWNLOAD)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${selectedMovie.status === MovieStatus.TO_DOWNLOAD ? 'bg-blue-600 text-white border-blue-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-blue-600/20'}`}><Download size={18} /> <span className="text-xs">待下载</span></button>
                          <button disabled={isStatusLocked} onClick={() => updateMovieStatus(selectedMovie.id, MovieStatus.PENDING)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${selectedMovie.status === MovieStatus.PENDING ? 'bg-amber-600 text-white border-amber-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-amber-600/20'}`}><List size={18} /> <span className="text-xs">待处理</span></button>
                          <button disabled={isStatusLocked} onClick={() => updateMovieStatus(selectedMovie.id, MovieStatus.EXCLUDED)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${selectedMovie.status === MovieStatus.EXCLUDED ? 'bg-slate-600 text-white border-slate-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600/40'}`}><Ban size={18} /> <span className="text-xs">排除</span></button>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                      <div className="flex flex-col gap-1"><span className="text-slate-500">发行日期</span><span className="text-slate-200 font-medium">{selectedMovie.releaseDate}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">影片时长</span><span className="text-slate-200 font-medium">{selectedMovie.length} 分钟</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">制作商</span><span className="text-indigo-400 font-medium cursor-pointer hover:underline">{selectedMovie.studio}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">发行商</span><span className="text-indigo-400 font-medium cursor-pointer hover:underline">{selectedMovie.label || '-'}</span></div>
                      <div className="flex flex-col gap-1 col-span-2"><span className="text-slate-500">系列</span><span className="text-indigo-400 font-medium cursor-pointer hover:underline">{selectedMovie.series || '-'}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">原始番号</span><span className="text-slate-200 font-mono">{selectedMovie.sourceCode || selectedMovie.title}</span></div>
                  </div>

                  <div>
                      <h3 className="text-sm text-slate-500 mb-3">类别标签</h3>
                      <div className="flex flex-wrap gap-2">{selectedMovie.tags.map(tag => <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">{tag}</span>)}</div>
                  </div>

                  <div className="border-t border-slate-800 pt-6">
                      <h3 className="text-sm text-slate-500 mb-4 flex items-center gap-2 font-bold uppercase"><Link size={16} /> 色花堂资源 ({selectedMovie.sehuatangData?.length || 0})</h3>
                      <div className="space-y-4">
                      {selectedMovie.sehuatangData && selectedMovie.sehuatangData.length > 0 ? (
                        selectedMovie.sehuatangData.map((ext) => {
                            const ignoreInfo = getIgnoreStatusInfo(ext.ignoreStatus);
                            return (
                                <div key={ext.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col md:flex-row group hover:border-slate-500 transition-colors">
                                    <div className="w-full md:w-48 aspect-[3/2] bg-black relative flex-shrink-0">
                                        <img src={ext.coverUrl || 'https://via.placeholder.com/800x533?text=No+Cover'} alt={ext.title} className="w-full h-full object-contain"/>
                                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                                            {ext.hasSubtitles && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-600/90 text-white shadow border border-green-500/50">中字</span>}
                                            {ext.isVr && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-600/90 text-white shadow border border-purple-500/50">VR</span>}
                                            {!ext.hasMosaic && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-pink-600/90 text-white shadow border border-pink-500/50">无码</span>}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                                        <div>
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-indigo-400 font-bold tracking-tight">{ext.code}</span>
                                                    {ext.category && <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded border border-slate-600">{ext.category}</span>}
                                                    {ext.subCategory && <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded border border-slate-600">{ext.subCategory}</span>}
                                                </div>
                                                <span className="text-xs text-slate-500 font-mono">{ext.releaseDate} | {ext.size}</span>
                                            </div>
                                            <h4 className="text-sm text-slate-200 font-medium line-clamp-2 leading-snug" title={ext.title}>{ext.title}</h4>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-3 border-t border-slate-700/50">
                                            <div className="flex flex-wrap items-center gap-4">
                                                {ignoreInfo ? <span className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${ignoreInfo.color} text-white`}><AlertCircle size={10} /> {ignoreInfo.label}</span> : <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700 text-slate-500 flex items-center gap-1"><Check size={10} /> 状态正常</span>}
                                                <div className="flex items-center gap-2">
                                                    {ext.in115 ? <span className="flex items-center gap-1 text-[10px] text-blue-400"><Cloud size={12}/> 115</span> : <span className="flex items-center gap-1 text-[10px] text-slate-600"><Cloud size={12}/> 未存</span>}
                                                    {ext.inNas ? <span className="flex items-center gap-1 text-[10px] text-emerald-400"><HardDrive size={12}/> NAS</span> : <span className="flex items-center gap-1 text-[10px] text-slate-600"><HardDrive size={12}/> 未存</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {ext.magnetLink && <button onClick={() => copyToClipboard(ext.magnetLink!, 'copy-ext')} className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${copiedLink === 'copy-ext' ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>{copiedLink === 'copy-ext' ? <Check size={14} /> : <Copy size={14} />} {copiedLink === 'copy-ext' ? '已复制' : '磁力'}</button>}
                                                {ext.sourceUrl && <a href={ext.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"><ExternalLink size={14} /> 原帖</a>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                      ) : <div className="text-sm text-slate-500 italic p-6 border border-dashed border-slate-700 rounded-xl text-center bg-slate-800/30 flex flex-col items-center gap-2"><Database size={24} className="opacity-50" /> 暂无收录的色花堂资源</div>}
                      </div>
                  </div>

                  <div className="mt-4 pt-6 border-t border-slate-800">
                      <h3 className="text-sm text-slate-500 mb-3 flex items-center gap-2 font-bold uppercase"><Magnet size={16} /> 本地磁力链接 ({selectedMovie.magnets?.length || 0})</h3>
                      <div className="space-y-2">
                          {selectedMovie.magnets && selectedMovie.magnets.length > 0 ? (
                              selectedMovie.magnets.map((magnet, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 group hover:border-indigo-500/50 transition-colors">
                                      <div className="flex flex-col min-w-0 pr-4">
                                          <div className="flex items-center gap-2 mb-1">
                                              {magnet.isHD && <span className="px-1.5 py-0.5 bg-indigo-900 text-indigo-300 text-[10px] rounded font-bold">HD</span>}
                                              <span className="text-slate-300 text-sm font-medium truncate" title={magnet.title}>{magnet.title}</span>
                                          </div>
                                          <div className="text-xs text-slate-500 flex gap-3"><span>{magnet.size}</span><span>{magnet.date}</span></div>
                                      </div>
                                      <button onClick={() => copyToClipboard(magnet.link)} className={`p-2 rounded transition-colors flex-shrink-0 ${copiedLink === magnet.link ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`} title="复制磁力">{copiedLink === magnet.link ? <Check size={16} /> : <Copy size={16} />}</button>
                                  </div>
                              ))
                          ) : <div className="text-center py-4 bg-slate-800/50 rounded-lg text-slate-500 text-sm border border-slate-800 border-dashed">暂无本地磁力链接</div>}
                      </div>
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};