import React, { useEffect, useState } from 'react';
import { Movie, Actor, MovieCensorship, MovieStatus } from '../types';
import { mockService } from '../services/mockService';
import { getStatusBadge, getIgnoreStatusInfo } from '../utils/formatters';
import { X, Heart, Users, ExternalLink, Cloud, HardDrive, CheckCircle, Download, List, Ban, Link, AlertCircle, Check, Magnet, Copy, Database } from 'lucide-react';

interface MovieDetailModalProps {
    movie: Movie;
    onClose: () => void;
    onToggleFavorite: (e: React.MouseEvent, id: string) => void;
    onUpdateStatus: (id: string, status: MovieStatus) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose, onToggleFavorite, onUpdateStatus }) => {
    const [movieActors, setMovieActors] = useState<Actor[]>([]);
    const [copiedLink, setCopiedLink] = useState<string | null>(null);

    useEffect(() => {
        mockService.getActorsByMovie(movie.actorIds).then(res => setMovieActors(res.data));
    }, [movie]);

    const copyToClipboard = (text: string, id?: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedLink(id || text);
            setTimeout(() => setCopiedLink(null), 2000);
        });
    };

    const isStatusLocked = movie.status === MovieStatus.IN_LIBRARY;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
           <div className="bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700" onClick={e => e.stopPropagation()}>
              
              {/* Left Column: Cover */}
              <div className="w-full md:w-5/12 bg-black relative flex items-center justify-center bg-slate-950">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-contain opacity-90" />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <span className={`px-3 py-1 rounded-md text-sm font-bold shadow-lg ${movie.censorship === MovieCensorship.CENSORED ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}`}>
                         {movie.censorship === MovieCensorship.CENSORED ? '有码' : '无码'}
                     </span>
                     {movie.isMultiActor && (
                        <span className="px-3 py-1 rounded-md text-sm font-bold bg-orange-600 text-white shadow-lg flex items-center gap-1">
                            <Users size={14} /> 多人共演
                        </span>
                     )}
                  </div>
                  <button 
                      onClick={(e) => onToggleFavorite(e, movie.id)} 
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/20 transition-colors group/fav"
                  >
                      <Heart size={32} className={`drop-shadow-xl transition-all ${movie.isFavorite ? 'text-red-500 fill-red-500 scale-110' : 'text-white/50 group-hover/fav:text-white/80'}`} />
                  </button>
              </div>

              {/* Right Column: Info */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-900 flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                      <div>
                          <h2 className="text-3xl font-bold text-white mb-1">{movie.transTitle || movie.title}</h2>
                          {movie.transTitle ? <h3 className="text-lg text-indigo-400 font-mono font-semibold mb-2">{movie.title}</h3> : <p className="text-indigo-400 font-mono font-semibold mb-2">{movie.sourceCode}</p>}
                          <p className="text-slate-400 text-sm leading-relaxed">{movie.transDescription || movie.description}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                          {movie.sourceUrl && (
                             <a href={movie.sourceUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700" title="打开 Javbus 页面">
                                <ExternalLink size={20} />
                             </a>
                          )}
                          <button onClick={onClose} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                              <X size={24} />
                          </button>
                      </div>
                  </div>
                  
                  {/* Status Buttons */}
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                          <h3 className="text-sm font-semibold text-slate-300">状态管理</h3>
                          <div className="flex gap-3">
                              <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${movie.in115 ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-700/50 border-slate-600 text-slate-500'}`}><Cloud size={12} /> 115网盘</div>
                              <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${movie.inNas ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-700/50 border-slate-600 text-slate-500'}`}><HardDrive size={12} /> 本地NAS</div>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button disabled={true} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all cursor-not-allowed opacity-80 ${movie.status === MovieStatus.IN_LIBRARY ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-700 text-slate-500 border-slate-600'}`}><CheckCircle size={18} /> <span className="text-xs">已入库</span></button>
                          <button disabled={isStatusLocked} onClick={() => onUpdateStatus(movie.id, MovieStatus.TO_DOWNLOAD)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${movie.status === MovieStatus.TO_DOWNLOAD ? 'bg-blue-600 text-white border-blue-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-blue-600/20'}`}><Download size={18} /> <span className="text-xs">待下载</span></button>
                          <button disabled={isStatusLocked} onClick={() => onUpdateStatus(movie.id, MovieStatus.PENDING)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${movie.status === MovieStatus.PENDING ? 'bg-amber-600 text-white border-amber-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-amber-600/20'}`}><List size={18} /> <span className="text-xs">待处理</span></button>
                          <button disabled={isStatusLocked} onClick={() => onUpdateStatus(movie.id, MovieStatus.EXCLUDED)} className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg border transition-all ${movie.status === MovieStatus.EXCLUDED ? 'bg-slate-600 text-white border-slate-500' : isStatusLocked ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed opacity-50' : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600/40'}`}><Ban size={18} /> <span className="text-xs">排除</span></button>
                      </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                      <div className="flex flex-col gap-1"><span className="text-slate-500">发行日期</span><span className="text-slate-200 font-medium">{movie.releaseDate}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">影片时长</span><span className="text-slate-200 font-medium">{movie.length} 分钟</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">制作商</span><span className="text-indigo-400 font-medium cursor-pointer hover:underline">{movie.studio}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">发行商</span><span className="text-indigo-400 font-medium cursor-pointer hover:underline">{movie.label || '-'}</span></div>
                      <div className="flex flex-col gap-1 col-span-2"><span className="text-slate-500">系列</span><span className="text-indigo-400 font-medium cursor-pointer hover:underline">{movie.series || '-'}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-slate-500">原始番号</span><span className="text-slate-200 font-mono">{movie.sourceCode || movie.title}</span></div>
                  </div>

                  {/* Tags */}
                  <div>
                      <h3 className="text-sm text-slate-500 mb-3">类别标签</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.tags.map(tag => (
                          <span key={tag.id} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                  </div>

                  {/* Cast */}
                  <div>
                      <h3 className="text-sm text-slate-500 mb-3">出演优优</h3>
                      <div className="flex flex-wrap gap-4">
                          {movieActors.map(actor => (
                              <div key={actor.id} className="flex items-center gap-3 bg-slate-800 pr-4 rounded-full border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
                                  <img src={actor.imageUrl} alt={actor.name} className="w-10 h-10 rounded-full object-cover" />
                                  <span className="text-slate-200 text-sm font-medium">{actor.name}</span>
                              </div>
                          ))}
                          {movieActors.length === 0 && <span className="text-slate-500 text-sm">暂无演员信息</span>}
                      </div>
                  </div>

                  {/* Sehuatang Resources */}
                  <div className="border-t border-slate-800 pt-6">
                      <h3 className="text-sm text-slate-500 mb-4 flex items-center gap-2 font-bold uppercase"><Link size={16} /> 色花堂资源 ({movie.sehuatangData?.length || 0})</h3>
                      <div className="space-y-4">
                      {movie.sehuatangData && movie.sehuatangData.length > 0 ? (
                        movie.sehuatangData.map((ext) => {
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
                      <h3 className="text-sm text-slate-500 mb-3 flex items-center gap-2 font-bold uppercase"><Magnet size={16} /> 本地磁力链接 ({movie.magnets?.length || 0})</h3>
                      <div className="space-y-2">
                          {movie.magnets && movie.magnets.length > 0 ? (
                              movie.magnets.map((magnet) => (
                                  <div key={magnet.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 group hover:border-indigo-500/50 transition-colors">
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
    );
};