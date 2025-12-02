import React, { useEffect, useState } from 'react';
import { mockService } from '../services/mockService';
import { Movie, Actor, MovieCensorship, MovieStatus } from '../types';
import { Search, Filter, ChevronDown, RotateCcw, Magnet, HardDrive, Download, ExternalLink, Cloud, X as XIcon, Ban, List, CheckCircle, Link, Tag, Copy, Check, MonitorPlay, ShieldAlert, AlertCircle, Database, Users, Heart, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jumpPage, setJumpPage] = useState('');

  // Filter State (Input values)
  const [filterStatus, setFilterStatus] = useState<MovieStatus | 'ALL'>('ALL');
  const [filterCensorship, setFilterCensorship] = useState<MovieCensorship | 'ALL'>('ALL');
  const [filterHasSehuatang, setFilterHasSehuatang] = useState<'ALL' | 'YES' | 'NO'>('ALL'); 
  const [filterFavorite, setFilterFavorite] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filter115, setFilter115] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterNas, setFilterNas] = useState<'ALL' | 'YES' | 'NO'>('ALL');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchActor, setSearchActor] = useState('');
  const [searchTag, setSearchTag] = useState('');
  
  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selection
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieActors, setMovieActors] = useState<Actor[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Available Tags
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Load tags and initial movies on mount
  useEffect(() => {
    mockService.getTags().then(setAvailableTags);
    fetchMovies(1); // Initial load
  }, []);

  useEffect(() => {
    if (selectedMovie) {
        mockService.getActorsByMovie(selectedMovie.actorIds).then(setMovieActors);
    }
  }, [selectedMovie]);

  const fetchMovies = async (pageToFetch: number, overrideFilters?: any) => {
      setLoading(true);
      const filters = overrideFilters || {
          searchTerm,
          searchActor,
          searchTag,
          status: filterStatus,
          censorship: filterCensorship,
          hasSehuatang: filterHasSehuatang,
          isFavorite: filterFavorite,
          in115: filter115,
          inNas: filterNas,
          startDate,
          endDate
      };

      const result = await mockService.getMovies(pageToFetch, pageSize, filters);
      setMovies(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setPage(result.number);
      setLoading(false);
  };

  const handleSearch = () => {
      fetchMovies(1); // Reset to page 1 on search
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchMovies(newPage);
          setJumpPage(''); // Clear jump input on nav
      }
  };

  const handleJumpToPage = () => {
      const p = parseInt(jumpPage, 10);
      if (!isNaN(p)) {
          handlePageChange(p);
      }
  };

  const updateStatus = async (id: string, newStatus: MovieStatus) => {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    // Optimistic update
    setMovies(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    
    if (selectedMovie && selectedMovie.id === id) {
        setSelectedMovie(prev => prev ? { ...prev, status: newStatus } : null);
    }

    await mockService.updateMovieStatus(id, newStatus);
  };

  const toggleFavorite = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const movie = movies.find(m => m.id === id);
      if (!movie) return;

      const newFavoriteStatus = !movie.isFavorite;
      
      setMovies(prev => prev.map(m => m.id === id ? { ...m, isFavorite: newFavoriteStatus } : m));
      if (selectedMovie && selectedMovie.id === id) {
          setSelectedMovie(prev => prev ? { ...prev, isFavorite: newFavoriteStatus } : null);
      }

      await mockService.toggleMovieFavorite(id);
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
          setCopiedLink(text);
          setTimeout(() => setCopiedLink(null), 2000);
      });
  };

  const closeModal = () => {
      setSelectedMovie(null);
      setMovieActors([]);
  };

  const resetFilters = () => {
      setSearchTerm('');
      setSearchActor('');
      setSearchTag('');
      setFilterStatus('ALL');
      setFilterCensorship('ALL');
      setFilterHasSehuatang('ALL');
      setFilterFavorite('ALL');
      setFilter115('ALL');
      setFilterNas('ALL');
      setStartDate('');
      setEndDate('');
      
      // Fetch with default values immediately using override
      fetchMovies(1, {
          searchTerm: '',
          searchActor: '',
          searchTag: '',
          status: 'ALL',
          censorship: 'ALL',
          hasSehuatang: 'ALL',
          isFavorite: 'ALL',
          in115: 'ALL',
          inNas: 'ALL',
          startDate: '',
          endDate: ''
      });
  };

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
    <div className="space-y-6 relative pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">影片库</h1>
          <p className="text-slate-400">管理您的所有影视收藏 ({totalElements} 部)</p>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-4">
          {/* Row 1: Search Inputs + Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Search Title */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                type="text"
                placeholder="搜索番号、标题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
             
             {/* Search Actor */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                type="text"
                placeholder="搜索演员..."
                value={searchActor}
                onChange={(e) => setSearchActor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>

             {/* Start Date */}
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                />
             </div>

             {/* End Date */}
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                />
             </div>
          </div>

          {/* Row 2: Attribute Filters & Tags */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
             {/* Search Tag - moved to row 2 */}
             <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                <option value="">所有标签</option>
                {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
             </div>

             <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
             >
                <option value="ALL">状态: 全部</option>
                <option value={MovieStatus.IN_LIBRARY}>状态: 已入库</option>
                <option value={MovieStatus.TO_DOWNLOAD}>状态: 待下载</option>
                <option value={MovieStatus.PENDING}>状态: 待处理</option>
                <option value={MovieStatus.EXCLUDED}>状态: 已排除</option>
             </select>

             <select
                value={filterCensorship}
                onChange={(e) => setFilterCensorship(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
             >
                <option value="ALL">码类: 全部</option>
                <option value={MovieCensorship.CENSORED}>码类: 有码</option>
                <option value={MovieCensorship.UNCENSORED}>码类: 无码</option>
             </select>

             <select
                value={filterFavorite}
                onChange={(e) => setFilterFavorite(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
             >
                <option value="ALL">收藏: 全部</option>
                <option value="YES">收藏: 是</option>
                <option value="NO">收藏: 否</option>
             </select>

             <select
                value={filterHasSehuatang}
                onChange={(e) => setFilterHasSehuatang(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
             >
                <option value="ALL">色花堂: 全部</option>
                <option value="YES">色花堂: 有</option>
                <option value="NO">色花堂: 无</option>
             </select>

             <select
                value={filter115}
                onChange={(e) => setFilter115(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
             >
                <option value="ALL">115: 全部</option>
                <option value="YES">115: 已存</option>
                <option value="NO">115: 未存</option>
             </select>

             <select
                value={filterNas}
                onChange={(e) => setFilterNas(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
             >
                <option value="ALL">NAS: 全部</option>
                <option value="YES">NAS: 已存</option>
                <option value="NO">NAS: 未存</option>
             </select>

             <button 
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors border border-slate-600"
             >
                 <RotateCcw size={14} /> 重置
             </button>
          </div>

          {/* Row 3: Search Button */}
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

      {/* Loading State */}
      {loading ? (
          <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
      ) : (
          /* Movie Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => {
                const badge = getStatusBadge(movie.status);
                return (
                <div key={movie.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 group hover:border-slate-500 transition-all flex flex-col relative">
                    <div className="relative aspect-[3/2] overflow-hidden cursor-pointer" onClick={() => setSelectedMovie(movie)}>
                    <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button 
                        onClick={(e) => toggleFavorite(e, movie.id)}
                        className="absolute top-2 left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full hover:bg-black/20 transition-colors group/fav"
                    >
                        <Heart size={20} className={`drop-shadow-md transition-colors ${movie.isFavorite ? 'text-red-500 fill-red-500' : 'text-white/30 group-hover/fav:text-white/80'}`} />
                    </button>

                    <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            movie.censorship === MovieCensorship.CENSORED 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-pink-600 text-white'
                        }`}>
                            {movie.censorship === MovieCensorship.CENSORED ? '有码' : '无码'}
                        </span>
                        {movie.isMultiActor && (
                            <span className="px-2 py-1 rounded text-xs font-bold bg-orange-600 text-white shadow-md flex items-center gap-1">
                                <Users size={10} /> 共演
                            </span>
                        )}
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        <div className="flex gap-1">
                            <div 
                                className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-default ${
                                    movie.in115 ? 'bg-blue-600 text-white' : 'bg-black/50 text-slate-500'
                                }`}
                                title={movie.in115 ? "已存入115" : "115未收录"}
                            >
                                <Cloud size={14} />
                            </div>
                            <div 
                                className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-default ${
                                    movie.inNas ? 'bg-emerald-600 text-white' : 'bg-black/50 text-slate-500'
                                }`}
                                title={movie.inNas ? "已存入NAS" : "NAS未收录"}
                            >
                                <HardDrive size={14} />
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 backdrop-blur-md mt-1 ${badge.color}`}>
                            {badge.icon} {badge.label}
                        </div>
                    </div>
                    
                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        {movie.status !== MovieStatus.TO_DOWNLOAD && movie.status !== MovieStatus.IN_LIBRARY && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); updateStatus(movie.id, MovieStatus.TO_DOWNLOAD); }}
                                className="p-3 rounded-full bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                                title="加入待下载"
                            >
                                <Download size={20} />
                            </button>
                        )}
                        {movie.status !== MovieStatus.EXCLUDED && movie.status !== MovieStatus.IN_LIBRARY && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); updateStatus(movie.id, MovieStatus.EXCLUDED); }}
                                className="p-3 rounded-full bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                                title="排除此片"
                            >
                                <Ban size={20} />
                            </button>
                        )}
                        {movie.status !== MovieStatus.PENDING && movie.status !== MovieStatus.IN_LIBRARY && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); updateStatus(movie.id, MovieStatus.PENDING); }}
                                className="p-3 rounded-full bg-slate-700 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors"
                                title="重置为待处理"
                            >
                                <RotateCcw size={20} />
                            </button>
                        )}
                    </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-white truncate" title={movie.transTitle || movie.title}>
                                {movie.transTitle || movie.title}
                            </h3>
                            <span className="text-xs text-slate-400 pt-1 font-mono">{movie.releaseDate}</span>
                        </div>
                        {movie.transTitle && movie.transTitle !== movie.title && (
                            <p className="text-xs text-slate-500 font-mono truncate">{movie.title}</p>
                        )}
                        <p className="text-sm text-slate-400 line-clamp-2 mt-1" title={movie.transDescription || movie.description}>
                            {movie.transDescription || movie.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mt-auto pt-2 pb-2">
                            {movie.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Footer Action */}
                        <div className="mt-1 pt-2 border-t border-slate-700/50">
                            {movie.sourceUrl ? (
                                <a
                                    href={movie.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors w-full"
                                >
                                    <ExternalLink size={14} /> 前往原帖
                                </a>
                            ) : (
                                <button disabled className="flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700 w-full">
                                    <ExternalLink size={14} /> 无链接
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                );
            })}
          </div>
      )}
      
      {!loading && movies.length === 0 && (
          <div className="text-center py-20 text-slate-500">
             <p>未找到相关影片，请调整筛选条件后重试。</p>
          </div>
      )}

      {/* Pagination Controls */}
      {!loading && movies.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
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

      {/* Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
           {/* ... (Modal content is reused, kept same) ... */}
           <div className="bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700" onClick={e => e.stopPropagation()}>
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
                          <button onClick={closeModal} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"><XIcon size={24} /></button>
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
                          <button disabled={isStatusLocked} onClick={() => updateStatus(selectedMovie.id, MovieStatus.TO_DOWNLOAD)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${selectedMovie.status === MovieStatus.TO_DOWNLOAD ? 'bg-blue-600 text-white border-blue-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-blue-600/20'}`}><Download size={18} /> <span className="text-xs">待下载</span></button>
                          <button disabled={isStatusLocked} onClick={() => updateStatus(selectedMovie.id, MovieStatus.PENDING)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${selectedMovie.status === MovieStatus.PENDING ? 'bg-amber-600 text-white border-amber-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-amber-600/20'}`}><List size={18} /> <span className="text-xs">待处理</span></button>
                          <button disabled={isStatusLocked} onClick={() => updateStatus(selectedMovie.id, MovieStatus.EXCLUDED)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${selectedMovie.status === MovieStatus.EXCLUDED ? 'bg-slate-600 text-white border-slate-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600/40'}`}><Ban size={18} /> <span className="text-xs">排除</span></button>
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