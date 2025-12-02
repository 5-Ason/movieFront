import { Movie, Actor, MovieStatus, SehuatangData, PageResponse, DashboardStats, ActorStatus, MovieCensorship } from '../types';
import { MOCK_MOVIES, MOCK_ACTORS, MOCK_SEHUATANG_DATA } from './mockData';

// 配置后端 API 地址
const API_BASE_URL = 'http://localhost:8080/api';

interface MovieFilterParams {
    searchTerm?: string;
    searchActor?: string;
    actorId?: string; // Added: Filter by specific actor ID
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

const checkBool = (filter: string | undefined, value: boolean) => {
    if (!filter || filter === 'ALL') return true;
    if (filter === 'YES') return value === true;
    if (filter === 'NO') return value === false;
    return true;
};

export const mockService = {

  // 获取仪表盘统计数据
  getDashboardStats: async (): Promise<DashboardStats> => {
      // --- REAL BACKEND CALL ---
      // const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      // return await response.json();

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
          
          setTimeout(() => resolve(stats), 400);
      });
  },

  // 获取影片列表 (分页 + 筛选)
  getMovies: async (page: number = 1, size: number = 12, filters: MovieFilterParams = {}): Promise<PageResponse<Movie>> => {
    // --- REAL BACKEND CALL ---
    // try {
    //   const params = new URLSearchParams({ page: (page-1).toString(), size: size.toString(), ...filters });
    //   const response = await fetch(`${API_BASE_URL}/movies?${params}`);
    //   return await response.json();
    // } catch (error) { ... }

    // --- MOCK DATA LOGIC ---
    return new Promise((resolve) => {
        let filtered = [...MOCK_MOVIES];

        // 1. Filter Logic
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

        // Search Term
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

        // Search Tag
        if (filters.searchTag) {
             const tag = filters.searchTag.toLowerCase();
             filtered = filtered.filter(m => m.tags.some(t => t.toLowerCase().includes(tag)));
        }

        // Filter by specific Actor ID (Exact match in array)
        if (filters.actorId) {
            filtered = filtered.filter(m => m.actorIds.includes(filters.actorId!));
        }

        // Search Actor Name (Text search)
        if (filters.searchActor) {
            const actorTerm = filters.searchActor.toLowerCase();
            const matchedActorIds = MOCK_ACTORS
                .filter(a => a.name.toLowerCase().includes(actorTerm))
                .map(a => a.id);
            filtered = filtered.filter(m => m.actorIds.some(id => matchedActorIds.includes(id)));
        }

        // 2. Pagination Logic
        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);
        const startIndex = (page - 1) * size;
        const content = filtered.slice(startIndex, startIndex + size);

        setTimeout(() => resolve({
            content,
            totalElements,
            totalPages,
            number: page,
            size
        }), 500);
    });
  },

  // 获取色花堂数据 (分页 + 筛选)
  getSehuatangData: async (page: number = 1, size: number = 12, filters: SehuatangFilterParams = {}): Promise<PageResponse<SehuatangData>> => {
      // --- REAL BACKEND CALL ---
      // ...

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

          // Pagination
          const totalElements = filtered.length;
          const totalPages = Math.ceil(totalElements / size);
          const startIndex = (page - 1) * size;
          const content = filtered.slice(startIndex, startIndex + size);

          setTimeout(() => resolve({
              content,
              totalElements,
              totalPages,
              number: page,
              size
          }), 500);
      });
  },

  // 获取演员列表 (分页 + 筛选)
  getActors: async (page: number = 1, size: number = 12, filters: ActorFilterParams = {}): Promise<PageResponse<Actor>> => {
      // --- REAL BACKEND CALL ---
      // const params = new URLSearchParams({ page: (page-1).toString(), size: size.toString(), ...filters });
      // const response = await fetch(`${API_BASE_URL}/actors?${params}`);
      
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

          // Strict birth date filtering (must have birth date to be included in range)
          if (filters.startBirthDate) {
              filtered = filtered.filter(a => a.birthDate && a.birthDate >= filters.startBirthDate!);
          }
          if (filters.endBirthDate) {
              filtered = filtered.filter(a => a.birthDate && a.birthDate <= filters.endBirthDate!);
          }

          const totalElements = filtered.length;
          const totalPages = Math.ceil(totalElements / size);
          const startIndex = (page - 1) * size;
          const content = filtered.slice(startIndex, startIndex + size);

          setTimeout(() => resolve({
              content,
              totalElements,
              totalPages,
              number: page,
              size
          }), 400);
      });
  },
  
  getMovieById: async (id: string): Promise<Movie | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_MOVIES.find(m => m.id === id)), 300));
  },

  getActorsByMovie: async (movieActorIds: string[]): Promise<Actor[]> => {
     return new Promise((resolve) => {
         const result = MOCK_ACTORS.filter(a => movieActorIds.includes(a.id));
         setTimeout(() => resolve(result), 300);
     });
  },

  getMoviesByActor: async (actorId: string): Promise<Movie[]> => {
      return new Promise((resolve) => {
          const result = MOCK_MOVIES.filter(m => m.actorIds.includes(actorId));
          setTimeout(() => resolve(result), 300);
      });
  },

  updateMovieStatus: async (id: string, newStatus: MovieStatus): Promise<void> => {
      return new Promise((resolve) => {
          const movie = MOCK_MOVIES.find(m => m.id === id);
          if (movie) movie.status = newStatus;
          setTimeout(() => resolve(), 300);
      });
  },

  toggleMovieFavorite: async (id: string): Promise<void> => {
      return new Promise((resolve) => {
          const movie = MOCK_MOVIES.find(m => m.id === id);
          if (movie) movie.isFavorite = !movie.isFavorite;
          setTimeout(() => resolve(), 300);
      });
  },

  getAllSehuatangData: async (): Promise<SehuatangData[]> => {
      return new Promise((resolve) => {
          setTimeout(() => resolve([...MOCK_SEHUATANG_DATA]), 500);
      });
  },

  getSehuatangCategories: async (): Promise<string[]> => {
      return new Promise((resolve) => {
        const categories = Array.from(new Set(MOCK_SEHUATANG_DATA.map(d => d.category).filter((c): c is string => !!c)));
        setTimeout(() => resolve(categories), 300);
      });
  },

  getSehuatangSubCategories: async (category: string): Promise<string[]> => {
      return new Promise((resolve) => {
        const subCategories = Array.from(new Set(
            MOCK_SEHUATANG_DATA
                .filter(d => d.category === category)
                .map(d => d.subCategory)
                .filter((c): c is string => !!c)
        ));
        setTimeout(() => resolve(subCategories), 300);
      });
  },

  getTags: async (actorId?: string): Promise<string[]> => {
      // --- REAL BACKEND CALL ---
      // const params = actorId ? `?actorId=${actorId}` : '';
      // const response = await fetch(`${API_BASE_URL}/movies/tags${params}`);
      // return await response.json();

      return new Promise((resolve) => {
          let targetMovies = MOCK_MOVIES;
          if (actorId) {
              targetMovies = targetMovies.filter(m => m.actorIds.includes(actorId));
          }
          const allTags = Array.from(new Set(targetMovies.flatMap(m => m.tags || [])));
          setTimeout(() => resolve(allTags), 300);
      });
  }
};