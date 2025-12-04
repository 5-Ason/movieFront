import React from 'react';
import { Movie, MovieCensorship, MovieStatus } from '../types';
import { Heart, Cloud, HardDrive, Download, Ban, RotateCcw, ExternalLink, Users } from 'lucide-react';
import { getStatusBadge } from '../utils/formatters';

interface MovieCardProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
    onToggleFavorite: (e: React.MouseEvent, id: string) => void;
    onUpdateStatus: (id: string, status: MovieStatus) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onToggleFavorite, onUpdateStatus }) => {
    const badge = getStatusBadge(movie.status);

    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 group hover:border-slate-500 transition-all flex flex-col relative shadow-lg">
            <div className="relative aspect-[3/2] overflow-hidden cursor-pointer bg-slate-950" onClick={() => onClick(movie)}>
                <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                
                {/* Favorite Button */}
                <button 
                    onClick={(e) => onToggleFavorite(e, movie.id)}
                    className="absolute top-2 left-1/2 -translate-x-1/2 z-10 p-1.5 rounded-full hover:bg-black/20 transition-colors group/fav"
                >
                    <Heart size={20} className={`drop-shadow-md transition-colors ${movie.isFavorite ? 'text-red-500 fill-red-500' : 'text-white/30 group-hover/fav:text-white/80'}`} />
                </button>

                {/* Top Left Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${
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

                {/* Top Right Status */}
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
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(movie.id, MovieStatus.TO_DOWNLOAD); }}
                            className="p-3 rounded-full bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors shadow-lg"
                            title="加入待下载"
                        >
                            <Download size={20} />
                        </button>
                    )}
                    {movie.status !== MovieStatus.EXCLUDED && movie.status !== MovieStatus.IN_LIBRARY && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(movie.id, MovieStatus.EXCLUDED); }}
                            className="p-3 rounded-full bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors shadow-lg"
                            title="排除此片"
                        >
                            <Ban size={20} />
                        </button>
                    )}
                    {movie.status !== MovieStatus.PENDING && movie.status !== MovieStatus.IN_LIBRARY && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(movie.id, MovieStatus.PENDING); }}
                            className="p-3 rounded-full bg-slate-700 hover:bg-amber-600 text-slate-300 hover:text-white transition-colors shadow-lg"
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
                    <span className="text-xs text-slate-400 pt-1 font-mono flex-shrink-0">{movie.releaseDate}</span>
                </div>
                {movie.transTitle && movie.transTitle !== movie.title && (
                    <p className="text-xs text-slate-500 font-mono truncate">{movie.title}</p>
                )}
                <p className="text-sm text-slate-400 line-clamp-2 mt-1" title={movie.transDescription || movie.description}>
                    {movie.transDescription || movie.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mt-auto pt-2 pb-2">
                    {movie.tags?.slice(0, 3).map(tag => (
                        <span key={tag.id} className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded">
                            {tag.name}
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
};