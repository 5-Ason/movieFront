import React, { useEffect, useState } from 'react';
import { mockService } from '../services/mockService';
import { Movie, MovieCensorship, MovieStatus } from '../types';
import { Search, RotateCcw, Tag, ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { MovieDetailModal } from '../components/MovieDetailModal';

export const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jumpPage, setJumpPage] = useState('');

  // Filter State
  const [filterStatus, setFilterStatus] = useState<MovieStatus | 'ALL'>('ALL');
  const [filterCensorship, setFilterCensorship] = useState<MovieCensorship | 'ALL'>('ALL');
  const [filterHasSehuatang, setFilterHasSehuatang] = useState<'ALL' | 'YES' | 'NO'>('ALL'); 
  const [filterFavorite, setFilterFavorite] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filter115, setFilter115] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [filterNas, setFilterNas] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchActor, setSearchActor] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    mockService.getTags().then(setAvailableTags);
    fetchMovies(1); 
  }, []);

  const fetchMovies = async (pageToFetch: number, overrideFilters?: any) => {
      setLoading(true);
      const filters = overrideFilters || {
          searchTerm, searchActor, searchTag,
          status: filterStatus, censorship: filterCensorship,
          hasSehuatang: filterHasSehuatang, isFavorite: filterFavorite,
          in115: filter115, inNas: filterNas,
          startDate, endDate
      };

      const result = await mockService.getMovies(pageToFetch, pageSize, filters);
      setMovies(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setPage(result.number);
      setLoading(false);
  };

  const handleSearch = () => fetchMovies(1);
  
  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchMovies(newPage);
          setJumpPage('');
      }
  };

  const handleJumpToPage = () => {
      const p = parseInt(jumpPage, 10);
      if (!isNaN(p)) handlePageChange(p);
  };

  const updateStatus = async (id: string, newStatus: MovieStatus) => {
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
      const newFav = !movie.isFavorite;
      setMovies(prev => prev.map(m => m.id === id ? { ...m, isFavorite: newFav } : m));
      if (selectedMovie && selectedMovie.id === id) {
          setSelectedMovie(prev => prev ? { ...prev, isFavorite: newFav } : null);
      }
      await mockService.toggleMovieFavorite(id);
  };

  const resetFilters = () => {
      setSearchTerm(''); setSearchActor(''); setSearchTag('');
      setFilterStatus('ALL'); setFilterCensorship('ALL');
      setFilterHasSehuatang('ALL'); setFilterFavorite('ALL');
      setFilter115('ALL'); setFilterNas('ALL');
      setStartDate(''); setEndDate('');
      fetchMovies(1, {
          searchTerm: '', searchActor: '', searchTag: '',
          status: 'ALL', censorship: 'ALL',
          hasSehuatang: 'ALL', isFavorite: 'ALL',
          in115: 'ALL', inNas: 'ALL',
          startDate: '', endDate: ''
      });
  };

  return (
    <div className="space-y-6 relative pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">影片库</h1>
          <p className="text-slate-400">管理您的所有影视收藏 ({totalElements} 部)</p>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="搜索番号、标题..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
             <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="搜索演员..." value={searchActor} onChange={(e) => setSearchActor(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
             <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" /></div>
             <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" /></div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
             <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select value={searchTag} onChange={(e) => setSearchTag(e.target.value)} className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer">
                <option value="">所有标签</option>{availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
             </div>
             <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">状态: 全部</option><option value={MovieStatus.IN_LIBRARY}>状态: 已入库</option><option value={MovieStatus.TO_DOWNLOAD}>状态: 待下载</option><option value={MovieStatus.PENDING}>状态: 待处理</option><option value={MovieStatus.EXCLUDED}>状态: 已排除</option></select>
             <select value={filterCensorship} onChange={(e) => setFilterCensorship(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">码类: 全部</option><option value={MovieCensorship.CENSORED}>码类: 有码</option><option value={MovieCensorship.UNCENSORED}>码类: 无码</option></select>
             <select value={filterFavorite} onChange={(e) => setFilterFavorite(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">收藏: 全部</option><option value="YES">收藏: 是</option><option value="NO">收藏: 否</option></select>
             <select value={filterHasSehuatang} onChange={(e) => setFilterHasSehuatang(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">色花堂: 全部</option><option value="YES">色花堂: 有</option><option value="NO">色花堂: 无</option></select>
             <select value={filter115} onChange={(e) => setFilter115(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">115: 全部</option><option value="YES">115: 已存</option><option value="NO">115: 未存</option></select>
             <select value={filterNas} onChange={(e) => setFilterNas(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">NAS: 全部</option><option value="YES">NAS: 已存</option><option value="NO">NAS: 未存</option></select>
             <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors border border-slate-600"><RotateCcw size={14} /> 重置</button>
          </div>

          {/* Row 3 */}
          <div className="flex justify-end pt-2 border-t border-slate-700">
              <button onClick={handleSearch} className="w-full md:w-auto px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"><Search size={20} /> 立即查询</button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
                <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={setSelectedMovie} 
                    onToggleFavorite={toggleFavorite}
                    onUpdateStatus={updateStatus}
                />
            ))}
          </div>
      )}
      
      {!loading && movies.length === 0 && <div className="text-center py-20 text-slate-500"><p>未找到相关影片，请调整筛选条件后重试。</p></div>}

      {/* Pagination */}
      {!loading && movies.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronLeft size={20} /></button>
                <span className="text-slate-400 text-sm">第 <span className="text-white font-bold">{page}</span> 页，共 {totalPages} 页</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronRight size={20} /></button>
              </div>
              <div className="flex items-center gap-2 border-l border-slate-700 pl-4 ml-2">
                   <span className="text-slate-500 text-sm">跳转到</span>
                   <input type="number" min="1" max={totalPages} value={jumpPage} onChange={(e) => setJumpPage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()} className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                   <span className="text-slate-500 text-sm">页</span>
                   <button onClick={handleJumpToPage} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">GO</button>
              </div>
          </div>
      )}

      {/* Modal */}
      {selectedMovie && (
          <MovieDetailModal 
              movie={selectedMovie} 
              onClose={() => setSelectedMovie(null)}
              onToggleFavorite={toggleFavorite}
              onUpdateStatus={updateStatus}
          />
      )}
    </div>
  );
};