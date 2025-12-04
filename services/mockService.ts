import { Movie, Actor, MovieStatus, SehuatangData, ApiResponse, PageResult, DashboardStats, ActorStatus, MovieCensorship, Tag } from '../types';
import { MOCK_MOVIES, MOCK_ACTORS, MOCK_SEHUATANG_DATA } from './mockData';

// 配置后端 API 地址
//const API_BASE_URL = 'http://localhost:3334/api';
const API_BASE_URL = 'https://4a36c8d5.r11.cpolar.top/api';
// ... (Filter Interfaces unchanged)
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

// 辅助函数：构建查询字符串，过滤空值
const buildQueryString = (params: any) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key] !== 'ALL') {
            query.append(key, params[key]);
        }
    });
    return query.toString();
};

// 辅助函数：检查布尔筛选条件 (Mock逻辑用)
const checkBool = (filter: string | undefined, value: boolean) => {
    if (!filter || filter === 'ALL') return true;
    if (filter === 'YES') return value === true;
    if (filter === 'NO') return value === false;
    return true;
};

// 辅助函数：封装统一的 API 成功响应结构 (Mock逻辑用)
const success = <T>(data: T): ApiResponse<T> => {
    return {
        code: 200,
        msg: '操作成功',
        data
    };
};

export const mockService = {

  /**
   * 获取仪表盘统计数据
   * 对应后端 API: GET /api/dashboard/stats
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        throw error; 
      }
      */

      // --- MOCK DATA LOGIC ---
      return new Promise((resolve) => {
          const movies = MOCK_MOVIES;
          const actors = MOCK_ACTORS;
          
          const stats: DashboardStats = {
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
          setTimeout(() => resolve(success(stats)), 400);
      });
  },

  /**
   * 获取影片列表 (支持分页和多条件筛选)
   * 对应后端 API: GET /api/movies
   */
  getMovies: async (page: number = 1, size: number = 12, filters: MovieFilterParams = {}): Promise<ApiResponse<PageResult<Movie>>> => {
    // --- REAL BACKEND CALL ---
    try {
        // Map 'page' to 'current' for backend
        const queryParams = buildQueryString({ 
            current: page, 
            size, 
            ...filters 
        });
        
        const response = await fetch(`${API_BASE_URL}/movies?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch movies from backend, falling back to mock data:", error);
        // return Promise.reject(error); // Uncomment to fail hard, or keep below for fallback
        
        // --- MOCK DATA LOGIC FALLBACK ---
        return new Promise((resolve) => {
            let filtered = [...MOCK_MOVIES];

            if (filters.startDate) filtered = filtered.filter(m => m.releaseDate >= filters.startDate!);
            if (filters.endDate) filtered = filtered.filter(m => m.releaseDate <= filters.endDate!);

            if (filters.status && filters.status !== 'ALL') filtered = filtered.filter(m => m.status === filters.status);
            if (filters.censorship && filters.censorship !== 'ALL') filtered = filtered.filter(m => m.censorship === filters.censorship);
            
            if (filters.isFavorite && filters.isFavorite !== 'ALL') {
                if (filters.isFavorite === 'YES') filtered = filtered.filter(m => m.isFavorite);
                if (filters.isFavorite === 'NO') filtered = filtered.filter(m => !m.isFavorite);
            }
            
            if (filters.hasSehuatang && filters.hasSehuatang !== 'ALL') {
                if (filters.hasSehuatang === 'YES') filtered = filtered.filter(m => m.sehuatangData && m.sehuatangData.length > 0);
                else filtered = filtered.filter(m => !m.sehuatangData || m.sehuatangData.length === 0);
            }

            if (filters.in115 && filters.in115 !== 'ALL') {
                 if (filters.in115 === 'YES') filtered = filtered.filter(m => m.in115);
                 if (filters.in115 === 'NO') filtered = filtered.filter(m => !m.in115);
            }

            if (filters.inNas && filters.inNas !== 'ALL') {
                 if (filters.inNas === 'YES') filtered = filtered.filter(m => m.inNas);
                 if (filters.inNas === 'NO') filtered = filtered.filter(m => !m.inNas);
            }

            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                filtered = filtered.filter(m => 
                    m.title.toLowerCase().includes(term) || 
                    m.description.toLowerCase().includes(term) ||
                    (m.transTitle && m.transTitle.toLowerCase().includes(term)) ||
                    m.director.toLowerCase().includes(term) ||
                    m.studio.toLowerCase().includes(term) ||
                    (m.series && m.series.toLowerCase().includes(term))
                );
            }

            if (filters.searchTag) {
                 const tag = filters.searchTag.toLowerCase();
                 filtered = filtered.filter(m => m.tags.some(t => t.name.toLowerCase().includes(tag)));
            }

            if (filters.actorId) {
                filtered = filtered.filter(m => m.actorIds.includes(filters.actorId!));
            }

            if (filters.searchActor) {
                const actorTerm = filters.searchActor.toLowerCase();
                const matchedActorIds = MOCK_ACTORS
                    .filter(a => a.name.toLowerCase().includes(actorTerm))
                    .map(a => a.id);
                filtered = filtered.filter(m => m.actorIds.some(id => matchedActorIds.includes(id)));
            }

            const total = filtered.length;
            const totalPages = Math.ceil(total / size);
            const startIndex = (page - 1) * size;
            const records = filtered.slice(startIndex, startIndex + size);

            setTimeout(() => resolve(success({
                records,
                total,
                pages: totalPages,
                current: page,
                size
            })), 500);
        });
    }
  },

  /**
   * 获取色花堂资源数据 (分页 + 筛选)
   * 对应后端 API: GET /api/sehuatang
   */
  getSehuatangData: async (page: number = 1, size: number = 12, filters: SehuatangFilterParams = {}): Promise<ApiResponse<PageResult<SehuatangData>>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      try {
        const queryParams = buildQueryString({ page: page, size, ...filters });
        const response = await fetch(`${API_BASE_URL}/sehuatang?${queryParams}`);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch sehuatang data:", error);
        throw error;
      }
      */

      // --- MOCK DATA LOGIC ---
      return new Promise((resolve) => {
          let filtered = [...MOCK_SEHUATANG_DATA];

          if (filters.searchText) {
              const term = filters.searchText.toLowerCase();
              filtered = filtered.filter(item => 
                (item.title?.toLowerCase() || '').includes(term) ||
                (item.code?.toLowerCase() || '').includes(term) ||
                (item.movieCode?.toLowerCase() || '').includes(term)
              );
          }

          if (filters.searchActor) {
              const term = filters.searchActor.toLowerCase();
              filtered = filtered.filter(item => (item.actresses?.toLowerCase() || '').includes(term));
          }

          if (filters.startDate) filtered = filtered.filter(item => (item.releaseDate || '') >= filters.startDate!);
          if (filters.endDate) filtered = filtered.filter(item => (item.releaseDate || '') <= filters.endDate!);
          
          if (filters.category) filtered = filtered.filter(item => item.category === filters.category);
          if (filters.subCategory) filtered = filtered.filter(item => item.subCategory === filters.subCategory);

          filtered = filtered.filter(item => 
              checkBool(filters.isSubtitle, item.hasSubtitles) &&
              checkBool(filters.isVr, item.isVr) &&
              checkBool(filters.isMosaic, item.hasMosaic) &&
              checkBool(filters.is115, item.in115) &&
              checkBool(filters.isNas, item.inNas) &&
              checkBool(filters.isIgnored, item.isIgnoredMovie) &&
              checkBool(filters.isMultiActor, item.isMultiActor) &&
              checkBool(filters.isFavoriteActor, item.isActorFavorite)
          );

          const total = filtered.length;
          const totalPages = Math.ceil(total / size);
          const startIndex = (page - 1) * size;
          const records = filtered.slice(startIndex, startIndex + size);

          setTimeout(() => resolve(success({
              records,
              total,
              pages: totalPages,
              current: page,
              size
          })), 500);
      });
  },

  /**
   * 获取演员列表 (分页 + 筛选)
   * 对应后端 API: GET /api/actors
   */
  getActors: async (page: number = 1, size: number = 12, filters: ActorFilterParams = {}): Promise<ApiResponse<PageResult<Actor>>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      try {
        const queryParams = buildQueryString({ page: page, size, ...filters });
        const response = await fetch(`${API_BASE_URL}/actors?${queryParams}`);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch actors:", error);
        throw error;
      }
      */

      // --- MOCK DATA LOGIC ---
      return new Promise((resolve) => {
          let filtered = [...MOCK_ACTORS];

          if (filters.searchTerm) {
              const term = filters.searchTerm.toLowerCase();
              filtered = filtered.filter(a => a.name.toLowerCase().includes(term));
          }

          if (filters.status && filters.status !== 'ALL') {
              filtered = filtered.filter(a => a.status === filters.status);
          }

          if (filters.isFavorite && filters.isFavorite !== 'ALL') {
              if (filters.isFavorite === 'YES') filtered = filtered.filter(a => a.isFavorite);
              if (filters.isFavorite === 'NO') filtered = filtered.filter(a => !a.isFavorite);
          }

          if (filters.startBirthDate) {
              filtered = filtered.filter(a => a.birthDate && a.birthDate >= filters.startBirthDate!);
          }
          if (filters.endBirthDate) {
              filtered = filtered.filter(a => a.birthDate && a.birthDate <= filters.endBirthDate!);
          }

          const total = filtered.length;
          const totalPages = Math.ceil(total / size);
          const startIndex = (page - 1) * size;
          const records = filtered.slice(startIndex, startIndex + size);

          setTimeout(() => resolve(success({
              records,
              total,
              pages: totalPages,
              current: page,
              size
          })), 400);
      });
  },
  
  /**
   * 根据 ID 获取单个影片详情
   * 对应后端 API: GET /api/movies/{id}
   */
  getMovieById: async (id: string): Promise<ApiResponse<Movie | undefined>> => {
    // --- REAL BACKEND CALL ---
    /*
    try {
        const response = await fetch(`${API_BASE_URL}/movies/${id}`);
        if (!response.ok) throw new Error('Failed to fetch movie');
        return await response.json();
    } catch (e) { console.error(e); return { code: 500, msg: 'Error', data: undefined }; }
    */
    return new Promise((resolve) => setTimeout(() => resolve(success(MOCK_MOVIES.find(m => m.id === id))), 300));
  },

  /**
   * 根据影片的演员ID列表获取对应的演员信息列表
   * 对应后端 API: GET /api/actors/batch?ids=1,2,3...
   */
  getActorsByMovie: async (movieActorIds: string[]): Promise<ApiResponse<Actor[]>> => {
     // --- REAL BACKEND CALL (Commented out) ---
     /*
     try {
        const idsParam = movieActorIds.join(',');
        const response = await fetch(`${API_BASE_URL}/actors/batch?ids=${idsParam}`);
        return await response.json();
     } catch (e) { ... }
     */
     return new Promise((resolve) => {
         const result = MOCK_ACTORS.filter(a => movieActorIds.includes(a.id));
         setTimeout(() => resolve(success(result)), 300);
     });
  },

  /**
   * 根据演员 ID 获取该演员参演的所有影片 (用于内部查询，非分页)
   * 对应后端 API: GET /api/actors/{id}/movies
   */
  getMoviesByActor: async (actorId: string): Promise<ApiResponse<Movie[]>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      try {
         const response = await fetch(`${API_BASE_URL}/actors/${actorId}/movies`);
         return await response.json();
      } catch(e) { ... }
      */
      return new Promise((resolve) => {
          const result = MOCK_MOVIES.filter(m => m.actorIds.includes(actorId));
          setTimeout(() => resolve(success(result)), 300);
      });
  },

  /**
   * 更新影片状态 (入库、待下载、排除、待处理)
   * 对应后端 API: PUT /api/movies/{id}/status?status=XXX
   */
  updateMovieStatus: async (id: string, newStatus: MovieStatus): Promise<ApiResponse<void>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      await fetch(`${API_BASE_URL}/movies/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ status: newStatus })
      });
      */
      return new Promise((resolve) => {
          const movie = MOCK_MOVIES.find(m => m.id === id);
          if (movie) movie.status = newStatus;
          setTimeout(() => resolve(success(undefined)), 300);
      });
  },

  /**
   * 切换影片收藏状态
   * 对应后端 API: POST /api/movies/{id}/favorite
   */
  toggleMovieFavorite: async (id: string): Promise<ApiResponse<void>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      await fetch(`${API_BASE_URL}/movies/${id}/favorite`, { method: 'POST' });
      */
      return new Promise((resolve) => {
          const movie = MOCK_MOVIES.find(m => m.id === id);
          if (movie) movie.isFavorite = !movie.isFavorite;
          setTimeout(() => resolve(success(undefined)), 300);
      });
  },

  /**
   * 切换演员收藏状态
   * 对应后端 API: POST /api/actors/{id}/favorite
   */
  toggleActorFavorite: async (id: string): Promise<ApiResponse<void>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      await fetch(`${API_BASE_URL}/actors/${id}/favorite`, { method: 'POST' });
      */
      return new Promise((resolve) => {
          const actor = MOCK_ACTORS.find(a => a.id === id);
          if (actor) actor.isFavorite = !actor.isFavorite;
          setTimeout(() => resolve(success(undefined)), 300);
      });
  },

  /**
   * 更新演员信息 (简介、状态、出生日期)
   * 对应后端 API: PUT /api/actors/{id}
   */
  updateActor: async (id: string, updates: Partial<Actor>): Promise<ApiResponse<void>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      await fetch(`${API_BASE_URL}/actors/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
      });
      */
      return new Promise((resolve) => {
          const actor = MOCK_ACTORS.find(a => a.id === id);
          if (actor) {
              Object.assign(actor, updates);
          }
          setTimeout(() => resolve(success(undefined)), 300);
      });
  },

  /**
   * 切换色花堂资源的排除状态 (忽略该资源)
   * 对应后端 API: POST /api/sehuatang/{id}/ignore
   */
  toggleSehuatangIgnore: async (id: string): Promise<ApiResponse<void>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      await fetch(`${API_BASE_URL}/sehuatang/${id}/ignore`, { method: 'POST' });
      */
      return new Promise((resolve) => {
          const item = MOCK_SEHUATANG_DATA.find(d => d.id === id);
          if (item) {
              item.isIgnoredMovie = !item.isIgnoredMovie;
          }
          setTimeout(() => resolve(success(undefined)), 300);
      });
  },

  /**
   * 获取所有色花堂数据 (无分页，仅用于测试，慎用)
   */
  getAllSehuatangData: async (): Promise<ApiResponse<SehuatangData[]>> => {
      return new Promise((resolve) => {
          setTimeout(() => resolve(success([...MOCK_SEHUATANG_DATA])), 500);
      });
  },

  /**
   * 获取色花堂数据的所有大类别 (去重)
   * 对应后端 API: GET /api/sehuatang/categories
   */
  getSehuatangCategories: async (): Promise<ApiResponse<string[]>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      const res = await fetch(`${API_BASE_URL}/sehuatang/categories`);
      return await res.json();
      */
      return new Promise((resolve) => {
        const categories = Array.from(new Set(MOCK_SEHUATANG_DATA.map(d => d.category).filter((c): c is string => !!c)));
        setTimeout(() => resolve(success(categories)), 300);
      });
  },

  /**
   * 根据大类别获取对应的子类别 (去重)
   * 对应后端 API: GET /api/sehuatang/subcategories?category=xxx
   */
  getSehuatangSubCategories: async (category: string): Promise<ApiResponse<string[]>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      const res = await fetch(`${API_BASE_URL}/sehuatang/subcategories?category=${category}`);
      return await res.json();
      */
      return new Promise((resolve) => {
        const subCategories = Array.from(new Set(
            MOCK_SEHUATANG_DATA
                .filter(d => d.category === category)
                .map(d => d.subCategory)
                .filter((c): c is string => !!c)
        ));
        setTimeout(() => resolve(success(subCategories)), 300);
      });
  },

  /**
   * 获取所有影片标签 (支持按演员ID筛选)
   * 对应后端 API: GET /api/movies/tags?actorId=xxx
   */
  getTags: async (actorId?: string): Promise<ApiResponse<string[]>> => {
      // --- REAL BACKEND CALL (Commented out) ---
      /*
      const params = actorId ? `?actorId=${actorId}` : '';
      const response = await fetch(`${API_BASE_URL}/movies/tags${params}`);
      return await response.json();
      */
      return new Promise((resolve) => {
          let targetMovies = MOCK_MOVIES;
          if (actorId) {
              targetMovies = targetMovies.filter(m => m.actorIds.includes(actorId));
          }
          const allTagNames = Array.from(new Set(targetMovies.flatMap(m => m.tags.map(t => t.name))));
          setTimeout(() => resolve(success(allTagNames)), 300);
      });
  }
};