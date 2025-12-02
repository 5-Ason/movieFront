export enum ActorStatus {
  ACTIVE = 'ACTIVE',   // 在籍
  RETIRED = 'RETIRED', // 退役
}

export enum MovieCensorship {
  CENSORED = 'CENSORED',     // 有码
  UNCENSORED = 'UNCENSORED', // 无码
}

export enum MovieStatus {
  IN_LIBRARY = 'IN_LIBRARY',   // 已入库 (Workflow complete)
  TO_DOWNLOAD = 'TO_DOWNLOAD', // 待下载
  EXCLUDED = 'EXCLUDED',       // 排除
  PENDING = 'PENDING',         // 不处理/待整理 (Default)
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 当前页码
  size: number;
}

export interface Actor {
  id: string;
  name: string;
  imageUrl: string;
  sourceImageUrl?: string; // 源头像URL
  movieCount: number;
  status: ActorStatus;
  sourceUrl?: string; // Javbus URL
  isFavorite?: boolean; // 是否收藏
  birthDate?: string; // 出生日期 YYYY-MM-DD
  profile?: string; // 新增：演员资料
}

export interface Magnet {
  id: string; // Added ID
  title: string;
  size: string;
  date: string;
  link: string;
  isHD: boolean;
  movieCode?: string; // 冗余存储番号
}

// Renamed from ExternalData to SehuatangData
export interface SehuatangData {
  id: string;
  movieCode: string;          // 关联的番号
  releaseDate?: string;       // 发布日期
  category?: string;          // 大类别
  subCategory?: string;       // 子类别
  code: string;               // 清洗后番号
  originalCode?: string;      // 原始番号
  hasSubtitles: boolean;      // 是否中字
  isVr: boolean;              // 是否VR
  hasMosaic: boolean;         // 是否有码
  originalTitle?: string;     // 原标题
  title?: string;             // 影片名称
  actresses?: string;         // 出演女优
  in115: boolean;             // 是否下载115
  inNas: boolean;             // 是否下载本地
  size?: string;              // 影片大小
  magnetLink?: string;        // 磁力链接
  sourceUrl?: string;         // 原帖链接
  
  // 0:正常 1:有码影片但存在无码资源 2:无码影片但存在中文字幕
  ignoreStatus: number;       
  
  isActorFavorite: boolean;   // 是否为已收藏女优 (Was isActorInLibrary)
  isMultiActor: boolean;      // 是否为多人共演
  isIgnoredMovie: boolean;    // 是否为忽略的影片 (关联 Movie status=EXCLUDED)
  
  coverUrl?: string;          // 封面图片
}

export interface Tag {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string; // 番号 (例如 SSNI-888)
  year: number; // 年份
  releaseDate: string; // 发行日期 (YYYY-MM-DD)
  length: number; // 时长 (分钟)
  director: string; // 导演
  studio: string; // 制作商 (Studio)
  label?: string; // 发行商 (Label)
  series?: string; // 系列
  posterUrl: string;
  backdropUrl: string;
  sourceUrl?: string; // Javbus URL
  
  // New Fields
  sourceCode?: string;        // 源番号 (冗余)
  transTitle?: string;        // 翻译标题
  transDescription?: string;  // 翻译描述
  sourcePosterUrl?: string;   // 源封面URL
  sourceBackdropUrl?: string; // 源背景URL
  isFavorite?: boolean;       // 是否收藏影片

  // Storage (Physical) - Read Only from User perspective
  in115: boolean;    // 是否在115
  inNas: boolean;    // 是否在NAS

  // Management (Logical) - Editable
  status: MovieStatus; 

  censorship: MovieCensorship;
  rating: number; // 0-10
  actorIds: string[];
  description: string; // 影片完整标题
  tags: Tag[]; // Changed from string[] to Tag[]
  magnets?: Magnet[]; // 磁力链接列表
  
  // Renamed property
  sehuatangData?: SehuatangData[]; // 色花堂关联数据
  
  isMultiActor?: boolean; // 是否为多人共演
}

export interface DashboardStats {
  totalMovies: number;
  
  // Status Counts
  statusPending: number;
  statusToDownload: number;
  statusExcluded: number;
  statusInLibrary: number;

  // Storage Counts
  storage115: number;
  storageNas: number;
  
  totalActors: number;
  activeActors: number;
  retiredActors: number; // Added
  censoredMovies: number;
  uncensoredMovies: number;
}