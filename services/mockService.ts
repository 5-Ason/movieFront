import { Movie, Actor, MovieStatus, SehuatangData, ApiResponse, PageResult, DashboardStats, ActorStatus, MovieCensorship, Tag } from '../types';
import { MOCK_MOVIES, MOCK_ACTORS, MOCK_SEHUATANG_DATA } from './mockData';

/**
 * 核心配置说明：
 * 1. 本地开发运行 npm run dev 时，Vite 会通过 proxy 将 /api 转发到后端 8080 端口。
 * 2. 部署到 Spring Boot 后，前端文件在 static 目录下，/api 请求会直接发给同源后端。
 */
const API_BASE_URL = '/api';

// 调试开关：
// true  -> 始终使用 Mock 数据（适用于前端独立开发）
// false -> 尝试请求后端接口，失败后再回退到 Mock（适用于联合调试）
const FORCE_MOCK = false; 

interface MovieFilterParams {
    searchTerm?: string;
    searchActor?: string;
    actorId?: string; 
    searchTag?: string;
    status?: string;
    censorship?: string;
    hasSehuatang?: string;
    isFavorite?: string;
    in115?: string;
    inNas?: string;
    startDate?: string;
    endDate?: string;
}

interface SehuatangFilterParams {
    searchText?: string;
    searchActor?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
    subCategory?: string;
    isSubtitle?: string;
    isVr?: string;
    isMosaic?: string;
    is115?: string;
    isNas?: string;
    isIgnored?: string;
    isMultiActor?: string;
    isFavoriteActor?: string;
}

interface ActorFilterParams {
    searchTerm?: string;
    status?: string;
    isFavorite?: string;
    startBirthDate?: string;
    endBirthDate?: string;
}

const buildQueryString = (params: any) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'ALL') {
            query.append(key, params[key]);
        }
    });
    return query.toString();
};

const success = <T>(data: T): ApiResponse<T> => ({
    code: 200,
    msg: '操作成功',
    data
});

/**
 * 核心请求封装：尝试请求后端，失败则静默回退到指定的 Mock 逻辑
 */
async function tryFetch<T>(url: string, mockFallback: () => T, options?: RequestInit): Promise<ApiResponse<T>> {
    if (FORCE_MOCK) return success(mockFallback());
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            // 如果 3 秒没响应，可能是后端没开，快速切换到 Mock
            signal: AbortSignal.timeout(3000) 
        });
        if (response.ok) {
            const result = await response.json();
            // 简单校验下后端返回格式，如果是 200 才认为是有效的业务数据
            if (result.code === 200) return result;
        }
    } catch (e) {
        console.warn(`[API] 接口连接失败，已回退到模拟数据: ${url}`);
    }
    return success(mockFallback());
}

export const mockService = {

  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
      return tryFetch('/dashboard/stats', () => {
          const movies = MOCK_MOVIES;
          const actors = MOCK_ACTORS;
          return {
              totalMovies: movies.length,
              statusPending: movies.filter(m => m.status === MovieStatus.PENDING).length,
              statusToDownload: movies.filter(m => m.status === MovieStatus.TO_DOWNLOAD).length,
              statusExcluded: movies.filter(m => m.status === MovieStatus.EXCLUDED).length,
              statusInLibrary: movies.filter(m => m.status === MovieStatus.IN_LIBRARY).length,
              storage115: movies.filter(m => m.in115).length,
              storageNas: movies.filter(m => m.inNas).length,
              totalActors: actors.length,
              activeActors: actors.filter(a => a.status === ActorStatus.ACTIVE).length,
              retiredActors: actors.filter(a => a.status === ActorStatus.RETIRED).length,
              censoredMovies: movies.filter(m => m.censorship === MovieCensorship.CENSORED).length,
              uncensoredMovies: movies.filter(m => m.censorship === MovieCensorship.UNCENSORED).length
          };
      });
  },

  getMovies: async (page: number = 1, size: number = 12, filters: MovieFilterParams = {}): Promise<ApiResponse<PageResult<Movie>>> => {
    const query = buildQueryString({ current: page, size, ...filters });
    return tryFetch(`/movies?${query}`, () => {
        let filtered = [...MOCK_MOVIES];
        if (filters.startDate) filtered = filtered.filter(m => m.releaseDate >= filters.startDate!);
        if (filters.endDate) filtered = filtered.filter(m => m.releaseDate <= filters.endDate!);
        if (filters.status && filters.status !== 'ALL') filtered = filtered.filter(m => m.status === filters.status);
        if (filters.censorship && filters.censorship !== 'ALL') filtered = filtered.filter(m => m.censorship === filters.censorship);
        if (filters.isFavorite && filters.isFavorite !== 'ALL') filtered = filtered.filter(m => filters.isFavorite === 'YES' ? m.isFavorite : !m.isFavorite);
        if (filters.hasSehuatang && filters.hasSehuatang !== 'ALL') filtered = filtered.filter(m => filters.hasSehuatang === 'YES' ? (m.sehuatangData && m.sehuatangData.length > 0) : (!m.sehuatangData || m.sehuatangData.length === 0));
        
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(m => m.title.toLowerCase().includes(term) || m.description.toLowerCase().includes(term));
        }
        
        const total = filtered.length;
        const records = filtered.slice((page - 1) * size, page * size);
        return { records, total, pages: Math.ceil(total / size), current: page, size };
    });
  },

  getSehuatangData: async (page: number = 1, size: number = 12, filters: SehuatangFilterParams = {}): Promise<ApiResponse<PageResult<SehuatangData>>> => {
      const query = buildQueryString({ page, size, ...filters });
      return tryFetch(`/sehuatang?${query}`, () => {
          let filtered = [...MOCK_SEHUATANG_DATA];
          if (filters.searchText) {
              const term = filters.searchText.toLowerCase();
              filtered = filtered.filter(item => (item.title || '').toLowerCase().includes(term) || (item.code || '').toLowerCase().includes(term));
          }
          const total = filtered.length;
          const records = filtered.slice((page - 1) * size, page * size);
          return { records, total, pages: Math.ceil(total / size), current: page, size };
      });
  },

  getActors: async (page: number = 1, size: number = 12, filters: ActorFilterParams = {}): Promise<ApiResponse<PageResult<Actor>>> => {
      const query = buildQueryString({ page, size, ...filters });
      return tryFetch(`/actors?${query}`, () => {
          let filtered = [...MOCK_ACTORS];
          if (filters.searchTerm) {
              const term = filters.searchTerm.toLowerCase();
              filtered = filtered.filter(a => a.name.toLowerCase().includes(term));
          }
          if (filters.status && filters.status !== 'ALL') filtered = filtered.filter(a => a.status === filters.status);
          const total = filtered.length;
          const records = filtered.slice((page - 1) * size, page * size);
          return { records, total, pages: Math.ceil(total / size), current: page, size };
      });
  },
  
  getMovieById: async (id: string): Promise<ApiResponse<Movie | undefined>> => {
    return tryFetch(`/movies/${id}`, () => MOCK_MOVIES.find(m => m.id === id));
  },

  getActorsByMovie: async (movieActorIds: string[]): Promise<ApiResponse<Actor[]>> => {
     return tryFetch(`/actors/batch?ids=${movieActorIds.join(',')}`, () => MOCK_ACTORS.filter(a => movieActorIds.includes(a.id)));
  },

  getMoviesByActor: async (actorId: string): Promise<ApiResponse<Movie[]>> => {
      return tryFetch(`/actors/${actorId}/movies`, () => MOCK_MOVIES.filter(m => m.actorIds.includes(actorId)));
  },

  updateMovieStatus: async (id: string, newStatus: MovieStatus): Promise<ApiResponse<void>> => {
      const movie = MOCK_MOVIES.find(m => m.id === id);
      if (movie) movie.status = newStatus;
      return tryFetch(`/movies/${id}/status`, () => undefined, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ status: newStatus })
      });
  },

  toggleMovieFavorite: async (id: string): Promise<ApiResponse<void>> => {
      const movie = MOCK_MOVIES.find(m => m.id === id);
      if (movie) movie.isFavorite = !movie.isFavorite;
      return tryFetch(`/movies/${id}/favorite`, () => undefined, { method: 'POST' });
  },

  toggleActorFavorite: async (id: string): Promise<ApiResponse<void>> => {
      const actor = MOCK_ACTORS.find(a => a.id === id);
      if (actor) actor.isFavorite = !actor.isFavorite;
      return tryFetch(`/actors/${id}/favorite`, () => undefined, { method: 'POST' });
  },

  updateActor: async (id: string, updates: Partial<Actor>): Promise<ApiResponse<void>> => {
      const actor = MOCK_ACTORS.find(a => a.id === id);
      if (actor) Object.assign(actor, updates);
      return tryFetch(`/actors/${id}`, () => undefined, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
      });
  },

  toggleSehuatangIgnore: async (id: string): Promise<ApiResponse<void>> => {
      const item = MOCK_SEHUATANG_DATA.find(d => d.id === id);
      if (item) item.isIgnoredMovie = !item.isIgnoredMovie;
      return tryFetch(`/sehuatang/${id}/ignore`, () => undefined, { method: 'POST' });
  },

  getSehuatangCategories: async (): Promise<ApiResponse<string[]>> => {
      return tryFetch('/sehuatang/categories', () => Array.from(new Set(MOCK_SEHUATANG_DATA.map(d => d.category).filter((c): c is string => !!c))));
  },

  getSehuatangSubCategories: async (category: string): Promise<ApiResponse<string[]>> => {
      return tryFetch(`/sehuatang/subcategories?category=${category}`, () => Array.from(new Set(MOCK_SEHUATANG_DATA.filter(d => d.category === category).map(d => d.subCategory).filter((c): c is string => !!c))));
  },

  getTags: async (actorId?: string): Promise<ApiResponse<string[]>> => {
      return tryFetch(`/movies/tags${actorId ? `?actorId=${actorId}` : ''}`, () => {
          let targetMovies = MOCK_MOVIES;
          if (actorId) targetMovies = targetMovies.filter(m => m.actorIds.includes(actorId));
          return Array.from(new Set(targetMovies.flatMap(m => m.tags.map(t => t.name))));
      });
  }
};