import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockService } from '../services/mockService';
import { Movie, DashboardStats, MovieStatus } from '../types';
import { HardDrive, Cloud, Lock, Unlock, List, Download, Ban, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ 
    totalMovies: 0, 
    statusPending: 0,
    statusToDownload: 0,
    statusExcluded: 0,
    statusInLibrary: 0,
    storage115: 0,
    storageNas: 0,
    totalActors: 0,
    activeActors: 0,
    retiredActors: 0,
    censoredMovies: 0,
    uncensoredMovies: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Aggregated Stats (wrapped in ApiResponse)
      const dashboardStatsRes = await mockService.getDashboardStats();
      setStats(dashboardStatsRes.data);

      // 2. Fetch Recent Movies (wrapped in ApiResponse<PageResult>)
      const moviesResponse = await mockService.getMovies(1, 5); 
      setRecentMovies(moviesResponse.data.records);
    };
    fetchData();
  }, []);

  const statusPieData = [
    { name: '已入库', value: stats.statusInLibrary, color: '#10b981' },    // Emerald
    { name: '待下载', value: stats.statusToDownload, color: '#3b82f6' },   // Blue
    { name: '不处理', value: stats.statusPending, color: '#f59e0b' },      // Amber
    { name: '已排除', value: stats.statusExcluded, color: '#64748b' },     // Slate
  ];

  const censorshipPieData = [
    { name: '有码', value: stats.censoredMovies, color: '#6366f1' }, // Indigo 500
    { name: '无码', value: stats.uncensoredMovies, color: '#ec4899' }, // Pink 500
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">数据概览</h1>
        <p className="text-slate-400">您的媒体收藏库统计</p>
      </div>

      {/* Row 1: Status Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400">已入库</p>
              <p className="text-xl font-bold text-white">{stats.statusInLibrary}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Download size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400">待下载</p>
              <p className="text-xl font-bold text-white">{stats.statusToDownload}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <List size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400">待处理</p>
              <p className="text-xl font-bold text-white">{stats.statusPending}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500/20 text-slate-400 rounded-lg">
              <Ban size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400">已排除</p>
              <p className="text-xl font-bold text-white">{stats.statusExcluded}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Storage & Content */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Storage Stats */}
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
              <p className="text-sm text-slate-400 mb-1">115网盘</p>
              <p className="text-2xl font-bold text-white">{stats.storage115}</p>
          </div>
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
             <Cloud size={24} />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
              <p className="text-sm text-slate-400 mb-1">本地NAS</p>
              <p className="text-2xl font-bold text-white">{stats.storageNas}</p>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
             <HardDrive size={24} />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
              <p className="text-sm text-slate-400 mb-1">有码影片</p>
              <p className="text-2xl font-bold text-white">{stats.censoredMovies}</p>
          </div>
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg">
             <Lock size={24} />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
              <p className="text-sm text-slate-400 mb-1">无码影片</p>
              <p className="text-2xl font-bold text-white">{stats.uncensoredMovies}</p>
          </div>
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-lg">
             <Unlock size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-6">库藏状态分布</h2>
          <div className="h-[300px] w-full flex">
             <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex-1 border-l border-slate-700 pl-4">
                <h3 className="text-sm text-slate-400 mb-2 text-center">码类分布</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={censorshipPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={60}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {censorshipPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Recent Additions */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">最新录入</h2>
          <div className="space-y-4 overflow-y-auto flex-1 max-h-[300px] pr-2 custom-scrollbar">
            {recentMovies.map((movie) => (
              <div key={movie.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                 <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-12 h-16 object-cover rounded shadow-sm bg-slate-600"
                 />
                 <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate" title={movie.transTitle || movie.title}>{movie.transTitle || movie.title}</h3>
                    <p className="text-sm text-slate-400">{movie.director || '未知导演'} • {movie.releaseDate}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    {/* Display Storage Icons */}
                    {movie.in115 && <Cloud size={14} className="text-blue-400" />}
                    {movie.inNas && <HardDrive size={14} className="text-emerald-400" />}
                    
                    {/* Display Status Badge */}
                    {movie.status === MovieStatus.PENDING && <span className="w-2 h-2 rounded-full bg-amber-500" title="待处理"></span>}
                    {movie.status === MovieStatus.TO_DOWNLOAD && <span title="待下载"><Download size={14} className="text-blue-400" /></span>}
                 </div>
              </div>
            ))}
            {recentMovies.length === 0 && <p className="text-slate-500 text-center py-4">暂无数据</p>}
          </div>
        </div>
      </div>
    </div>
  );
};