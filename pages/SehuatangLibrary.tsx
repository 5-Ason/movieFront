import React, { useEffect, useState, useMemo } from 'react';
import { mockService } from '../services/mockService';
import { SehuatangData } from '../types';
import { Search, ExternalLink, Magnet, Cloud, HardDrive, Filter, RotateCcw, User, Calendar, Copy, Check, AlertCircle, X, FileVideo, Globe, Hash, MonitorPlay, Users, Database, ShieldAlert, FileText, Info, Heart, Ban, ChevronLeft, ChevronRight } from 'lucide-react';

const getIgnoreStatusInfo = (status: number) => {
    switch (status) {
        case 1: return { label: '存在无码资源', color: 'bg-yellow-600 border-yellow-500' };
        case 2: return { label: '存在字幕资源', color: 'bg-green-600 border-green-500' };
        default: return null;
    }
};

export const SehuatangLibrary: React.FC = () => {
  const [data, setData] = useState<SehuatangData[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SehuatangData | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jumpPage, setJumpPage] = useState('');

  // Filter State (Inputs)
  const [searchText, setSearchText] = useState('');
  const [searchActor, setSearchActor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubCategory, setFilterSubCategory] = useState('');
  
  const [filterSubtitle, setFilterSubtitle] = useState('ALL');
  const [filterVr, setFilterVr] = useState('ALL');
  const [filterMosaic, setFilterMosaic] = useState('ALL');
  const [filter115, setFilter115] = useState('ALL');
  const [filterNas, setFilterNas] = useState('ALL');
  
  const [filterIsIgnored, setFilterIsIgnored] = useState('ALL');
  const [filterMultiActor, setFilterMultiActor] = useState('ALL');
  const [filterFavoriteActor, setFilterFavoriteActor] = useState('ALL');

  // Dropdown options
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);

  useEffect(() => {
    mockService.getSehuatangCategories().then(setCategories);
    fetchData(1);
  }, []);

  useEffect(() => {
    if (filterCategory) {
        mockService.getSehuatangSubCategories(filterCategory).then(setSubCategories);
    } else {
        setSubCategories([]);
    }
  }, [filterCategory]);

  const fetchData = async (pageToFetch: number) => {
      setLoading(true);
      const filters = {
          searchText,
          searchActor,
          startDate,
          endDate,
          category: filterCategory,
          subCategory: filterSubCategory,
          isSubtitle: filterSubtitle,
          isVr: filterVr,
          isMosaic: filterMosaic,
          is115: filter115,
          isNas: filterNas,
          isIgnored: filterIsIgnored,
          isMultiActor: filterMultiActor,
          isFavoriteActor: filterFavoriteActor
      };
      
      const result = await mockService.getSehuatangData(pageToFetch, pageSize, filters);
      setData(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setPage(result.number);
      setLoading(false);
  };

  const handleSearch = () => {
      fetchData(1);
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchData(newPage);
          setJumpPage('');
      }
  };

  const handleJumpToPage = () => {
      const p = parseInt(jumpPage, 10);
      if (!isNaN(p)) {
          handlePageChange(p);
      }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterCategory(e.target.value);
      setFilterSubCategory('');
  };

  // NEW: Toggle Ignore Handler
  const toggleIgnore = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const item = data.find(d => d.id === id);
      if (!item) return;

      const newIgnoreState = !item.isIgnoredMovie;
      
      // Optimistic update
      setData(prev => prev.map(d => d.id === id ? { ...d, isIgnoredMovie: newIgnoreState } : d));
      if (selectedItem && selectedItem.id === id) {
          setSelectedItem(prev => prev ? { ...prev, isIgnoredMovie: newIgnoreState } : null);
      }

      await mockService.toggleSehuatangIgnore(id);
  };

  const resetFilters = () => {
      setSearchText(''); setSearchActor(''); setStartDate(''); setEndDate('');
      setFilterCategory(''); setFilterSubCategory('');
      setFilterSubtitle('ALL'); setFilterVr('ALL'); setFilterMosaic('ALL');
      setFilter115('ALL'); setFilterNas('ALL');
      setFilterIsIgnored('ALL'); setFilterMultiActor('ALL'); setFilterFavoriteActor('ALL');
      setTimeout(() => fetchData(1), 0);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">色花堂库</h1>
          <p className="text-slate-400">浏览所有从色花堂抓取的清洗数据 ({totalElements} 条)</p>
        </div>

        {/* Filter Panel */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-4">
             {/* Row 1: Search & Dates */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="搜索标题、番号..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                 </div>
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="搜索演员..." value={searchActor} onChange={(e) => setSearchActor(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                 </div>
                 <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" /></div>
                 <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" /></div>
             </div>

             {/* Row 2: Categories */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <select value={filterCategory} onChange={handleCategoryChange} className={`w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${!filterCategory ? 'md:col-span-2' : ''}`}>
                    <option value="">所有大类别</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 {filterCategory && (
                    <select value={filterSubCategory} onChange={(e) => setFilterSubCategory(e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option value="">所有子类别</option>{subCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 )}
             </div>

             {/* Row 3: Attributes */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                 <select value={filterSubtitle} onChange={(e) => setFilterSubtitle(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">中字: 全部</option> <option value="YES">中字: 是</option> <option value="NO">中字: 否</option></select>
                 <select value={filterVr} onChange={(e) => setFilterVr(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">VR: 全部</option> <option value="YES">VR: 是</option> <option value="NO">VR: 否</option></select>
                 <select value={filterMosaic} onChange={(e) => setFilterMosaic(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">有码: 全部</option> <option value="YES">有码: 是</option> <option value="NO">有码: 否</option></select>
                 <select value={filterIsIgnored} onChange={(e) => setFilterIsIgnored(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">忽略影片: 全部</option> <option value="YES">忽略影片: 是</option> <option value="NO">忽略影片: 否</option></select>
                 <select value={filterMultiActor} onChange={(e) => setFilterMultiActor(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">多人共演: 全部</option> <option value="YES">多人共演: 是</option> <option value="NO">多人共演: 否</option></select>
                 <select value={filterFavoriteActor} onChange={(e) => setFilterFavoriteActor(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">已收藏女优: 全部</option> <option value="YES">已收藏女优: 是</option> <option value="NO">已收藏女优: 否</option></select>
                 <select value={filter115} onChange={(e) => setFilter115(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">115: 全部</option> <option value="YES">115: 已下</option> <option value="NO">115: 未下</option></select>
                 <select value={filterNas} onChange={(e) => setFilterNas(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"><option value="ALL">NAS: 全部</option> <option value="YES">NAS: 已下</option> <option value="NO">NAS: 未下</option></select>
                 <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors border border-slate-600"><RotateCcw size={14} /> 重置</button>
             </div>
             
             {/* Search Button */}
             <div className="flex justify-end pt-2 border-t border-slate-700">
                  <button onClick={handleSearch} className="w-full md:w-auto px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"><Search size={20} /> 立即查询</button>
             </div>
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => {
            const ignoreInfo = getIgnoreStatusInfo(item.ignoreStatus);
            return (
            <div key={item.id} onClick={() => setSelectedItem(item)} className={`bg-slate-800 rounded-xl overflow-hidden border group hover:border-slate-500 transition-all flex flex-col relative cursor-pointer ${item.isIgnoredMovie ? 'border-slate-600 opacity-75' : 'border-slate-700'}`}>
                {/* Cover Image */}
                <div className="relative aspect-[3/2] overflow-hidden bg-slate-900">
                    <img src={item.coverUrl || 'https://via.placeholder.com/800x533?text=No+Cover'} alt={item.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${item.isIgnoredMovie ? 'grayscale opacity-50' : ''}`} />
                    
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                        {item.isVr && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white shadow-md border border-purple-500">VR</span>}
                        {!item.hasMosaic && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-600 text-white shadow-md border border-pink-500">无码</span>}
                        {item.hasMosaic && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white shadow-md border border-indigo-500">有码</span>}
                    </div>

                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        {item.in115 && <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold shadow-md backdrop-blur-sm border border-blue-400"><Cloud size={10} /> 115</div>}
                        {item.inNas && <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold shadow-md backdrop-blur-sm border border-emerald-400"><HardDrive size={10} /> NAS</div>}
                    </div>
                    
                    {item.isIgnoredMovie ? (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-600/90 text-slate-200 shadow-lg backdrop-blur-md border border-slate-500"><Ban size={12} /> 已排除</span></div>
                    ) : ignoreInfo ? (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2 text-center"><span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md ${ignoreInfo.color} text-white`}><AlertCircle size={12} /> {ignoreInfo.label}</span></div>
                    ) : null}
                    
                    {/* Toggle Ignore Button (Hover) */}
                    <button onClick={(e) => toggleIgnore(e, item.id)} className={`absolute bottom-2 left-2 p-1.5 rounded-full transition-colors shadow-lg z-10 opacity-0 group-hover:opacity-100 ${item.isIgnoredMovie ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-slate-700 text-slate-300 hover:bg-red-600 hover:text-white'}`} title={item.isIgnoredMovie ? "取消排除" : "排除此片"}>
                        {item.isIgnoredMovie ? <RotateCcw size={14} /> : <Ban size={14} />}
                    </button>

                    {item.size && <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-slate-200 text-[10px] rounded font-mono border border-white/10">{item.size}</div>}
                </div>

                <div className="p-3 flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <span className={`font-mono font-bold text-lg tracking-tight ${item.isIgnoredMovie ? 'text-slate-500 line-through' : 'text-indigo-400'}`}>{item.code}</span>
                        <span className="text-xs text-slate-500 pt-1 font-mono">{item.releaseDate}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {item.category && <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-indigo-300 rounded border border-slate-600/50">{item.category}</span>}
                        {item.subCategory && <span className="text-[10px] px-1.5 py-0.5 bg-slate-700/50 text-slate-300 rounded border border-slate-600/50">{item.subCategory}</span>}
                    </div>
                    
                    <h3 className={`text-sm font-medium line-clamp-2 leading-snug mt-1 min-h-[2.5em] ${item.isIgnoredMovie ? 'text-slate-500' : 'text-slate-200'}`} title={item.title}>{item.title}</h3>

                    {item.actresses && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-auto">
                            <User size={12} className="text-slate-600" />
                            <span className="line-clamp-1">{item.actresses}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-700/50">
                        {item.magnetLink ? (
                            <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.magnetLink!, item.id); }} className={`flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-colors ${copiedId === item.id ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white'}`}>
                                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === item.id ? '已复制' : '复制磁力'}
                            </button>
                        ) : (
                            <button disabled className="flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"><Magnet size={14} /> 无磁力</button>
                        )}

                        {item.sourceUrl ? (
                            <a href={item.sourceUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"><ExternalLink size={14} /> 原帖</a>
                        ) : (
                            <button disabled className="flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"><ExternalLink size={14} /> 无链接</button>
                        )}
                    </div>
                </div>
            </div>
            );
        })}
      </div>
      )}
      
      {!loading && data.length === 0 && (
          <div className="text-center py-20 text-slate-500">
             <p>没有找到符合条件的数据</p>
          </div>
      )}

      {/* Pagination Controls */}
      {!loading && data.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronLeft size={20} /></button>
                  <span className="text-slate-400 text-sm">第 <span className="text-white font-bold">{page}</span> 页，共 {totalPages} 页</span>
                  <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"><ChevronRight size={20} /></button>
              </div>
              <div className="flex items-center gap-2 border-l border-slate-700 pl-4 ml-2"><span className="text-slate-500 text-sm">跳转到</span><input type="number" min="1" max={totalPages} value={jumpPage} onChange={(e) => setJumpPage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()} className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" /><span className="text-slate-500 text-sm">页</span><button onClick={handleJumpToPage} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">GO</button></div>
          </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
              <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700" onClick={e => e.stopPropagation()}>
                  <div className="w-full md:w-5/12 bg-black relative flex items-center justify-center bg-slate-950">
                      <img src={selectedItem.coverUrl || 'https://via.placeholder.com/800x533?text=No+Cover'} alt={selectedItem.title} className={`w-full h-full object-contain opacity-90 ${selectedItem.isIgnoredMovie ? 'grayscale' : ''}`} />
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                           {selectedItem.hasSubtitles && <span className="px-2 py-1 rounded bg-green-600/90 text-white text-xs font-bold shadow">中字</span>}
                           {selectedItem.isVr && <span className="px-2 py-1 rounded bg-purple-600/90 text-white text-xs font-bold shadow">VR</span>}
                           {!selectedItem.hasMosaic && <span className="px-2 py-1 rounded bg-pink-600/90 text-white text-xs font-bold shadow">无码</span>}
                      </div>
                      <button onClick={(e) => toggleIgnore(e, selectedItem.id)} className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg border flex items-center gap-1 transition-colors ${selectedItem.isIgnoredMovie ? 'bg-slate-600 text-white border-slate-500 hover:bg-green-600 hover:border-green-500' : 'bg-red-600/80 text-white border-red-500 hover:bg-red-600'}`}>
                          {selectedItem.isIgnoredMovie ? <><RotateCcw size={14} /> 恢复</> : <><Ban size={14} /> 排除</>}
                      </button>
                  </div>

                  <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                      <div className="flex justify-between items-start gap-4 border-b border-slate-800 pb-4">
                          <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-2"><h2 className={`text-3xl font-bold font-mono tracking-tight ${selectedItem.isIgnoredMovie ? 'text-slate-500 line-through' : 'text-indigo-400'}`}>{selectedItem.code}</h2>{selectedItem.movieCode && selectedItem.movieCode !== selectedItem.code && <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-slate-700 font-mono">关联本地: {selectedItem.movieCode}</span>}</div>
                              <h3 className="text-white text-lg font-medium leading-snug">{selectedItem.title}</h3>
                              {selectedItem.originalTitle && selectedItem.originalTitle !== selectedItem.title && <p className="text-slate-500 text-sm mt-1">原标题: {selectedItem.originalTitle}</p>}
                          </div>
                          <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors flex-shrink-0"><X size={24} /></button>
                      </div>

                      <div className="space-y-6">
                          <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1"><FileText size={12}/> 基本信息</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                  <div className="flex flex-col gap-1"><span className="text-[10px] text-slate-500">发布日期</span><span className="text-sm text-slate-200 font-medium font-mono">{selectedItem.releaseDate}</span></div>
                                  <div className="flex flex-col gap-1"><span className="text-[10px] text-slate-500">资源大小</span><span className="text-sm text-slate-200 font-medium font-mono">{selectedItem.size || '-'}</span></div>
                                  <div className="flex flex-col gap-1"><span className="text-[10px] text-slate-500">原始番号</span><span className="text-sm text-slate-200 font-medium font-mono">{selectedItem.originalCode || '-'}</span></div>
                                  <div className="flex flex-col gap-1"><span className="text-[10px] text-slate-500">清洗番号</span><span className="text-sm text-slate-200 font-medium font-mono">{selectedItem.code}</span></div>
                              </div>
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1"><MonitorPlay size={12}/> 规格属性</h4>
                              <div className="flex flex-wrap gap-2">
                                   <span className={`px-3 py-1.5 rounded border text-xs font-medium flex items-center gap-1 ${selectedItem.hasSubtitles ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{selectedItem.hasSubtitles ? <Check size={12}/> : <X size={12}/>} 中文字幕</span>
                                   <span className={`px-3 py-1.5 rounded border text-xs font-medium flex items-center gap-1 ${selectedItem.isVr ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>{selectedItem.isVr ? <Check size={12}/> : <X size={12}/>} VR全景</span>
                                   <span className={`px-3 py-1.5 rounded border text-xs font-medium flex items-center gap-1 ${!selectedItem.hasMosaic ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'}`}><ShieldAlert size={12}/> {selectedItem.hasMosaic ? '有码' : '无码'}</span>
                                   {selectedItem.isMultiActor && <span className="px-3 py-1.5 rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-medium flex items-center gap-1"><Users size={12}/> 多人共演</span>}
                              </div>
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1"><Users size={12}/> 阵容与分类</h4>
                              <div className="flex flex-col gap-3">
                                  <div className="flex items-start gap-2"><span className="text-xs text-slate-500 mt-1 min-w-[60px]">出演优优:</span><div className="flex flex-wrap gap-2">{selectedItem.actresses ? selectedItem.actresses.split(',').map((act, idx) => (<span key={idx} className={`px-2 py-1 rounded text-xs border ${selectedItem.isActorFavorite ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>{act.trim()}{selectedItem.isActorFavorite && idx === 0 && <span className="ml-1 text-[10px] text-red-400 opacity-90 inline-flex items-center gap-0.5"><Heart size={8} fill="currentColor" />(收藏)</span>}</span>)) : <span className="text-slate-500 text-sm">-</span>}</div></div>
                                  <div className="flex items-center gap-2"><span className="text-xs text-slate-500 min-w-[60px]">所属类别:</span><div className="flex gap-2">{selectedItem.category && <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">{selectedItem.category}</span>}{selectedItem.subCategory && <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">{selectedItem.subCategory}</span>}</div></div>
                              </div>
                          </div>

                          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-800">
                               <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1"><Database size={12}/> 清洗与库存</h4>
                               <div className="flex flex-wrap gap-4 items-center">
                                    <div className="flex gap-2">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${selectedItem.in115 ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}><Cloud size={14} /><span className="text-xs font-medium">115网盘</span></div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${selectedItem.inNas ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}><HardDrive size={14} /><span className="text-xs font-medium">本地NAS</span></div>
                                    </div>
                                    <div className="w-px h-8 bg-slate-700"></div>
                                    {getIgnoreStatusInfo(selectedItem.ignoreStatus) ? <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${getIgnoreStatusInfo(selectedItem.ignoreStatus)?.color.replace('bg-', 'bg-opacity-20 bg-').replace('border-', 'border-opacity-50 border-')} text-slate-200`}><AlertCircle size={14} /><span className="text-xs font-medium">{getIgnoreStatusInfo(selectedItem.ignoreStatus)?.label}</span></div> : <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-700 text-slate-500"><Check size={14} /><span className="text-xs">无需清洗</span></div>}
                               </div>
                          </div>
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-800">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1"><Magnet size={12}/> 资源链接</h4>
                          <div className="flex flex-col sm:flex-row gap-3">
                              <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 flex items-center justify-between gap-4 group hover:border-indigo-500/30 transition-colors">
                                  <div className="min-w-0"><p className="text-xs text-slate-500 mb-1 font-mono">MAGNET LINK</p><p className="font-mono text-xs text-slate-300 truncate">{selectedItem.magnetLink || '无磁力链接'}</p></div>
                                  {selectedItem.magnetLink && <button onClick={() => copyToClipboard(selectedItem.magnetLink!, 'modal-copy')} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${copiedId === 'modal-copy' ? 'bg-green-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>{copiedId === 'modal-copy' ? <Check size={14} /> : <Copy size={14} />} {copiedId === 'modal-copy' ? '已复制' : '复制'}</button>}
                              </div>
                              {selectedItem.sourceUrl && <a href={selectedItem.sourceUrl} target="_blank" rel="noopener noreferrer" className="sm:w-32 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 font-medium transition-colors flex items-center justify-center gap-2"><ExternalLink size={16} /> <span className="text-sm">前往原帖</span></a>}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};