
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Film, Users, Menu, X, Database, Globe } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: '概览', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: '演职员', path: '/actors', icon: <Users size={20} /> },
    { name: '影片库', path: '/movies', icon: <Film size={20} /> },
    { name: '色花堂库', path: '/sehuatang', icon: <Globe size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* 移动端侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside 
        className={`
          fixed md:relative z-30 flex flex-col w-64 h-full bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-500">
            <Database size={24} />
            <span>影视库管理</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
          <p>MovieVault v1.1</p>
          <p>本地媒体管理系统</p>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 移动端头部 */}
        <header className="flex items-center p-4 bg-slate-900 md:hidden border-b border-slate-800">
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-white mr-4">
            <Menu size={24} />
          </button>
          <span className="font-semibold">
             {navItems.find(i => i.path === location.pathname)?.name || '影视库'}
          </span>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
