import { Movie, Actor, ActorStatus, MovieCensorship, MovieStatus, SehuatangData, Tag, Magnet } from '../types';

// --- 1. 静态演员数据 (12位) ---
export const MOCK_ACTORS: Actor[] = [
  { 
      id: 'a1', name: '三上悠亚', imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/1.jpg', movieCount: 15, status: ActorStatus.RETIRED, sourceUrl: 'https://www.javbus.com/star/okq', isFavorite: true, birthDate: '1993-08-16',
      profile: '前SKE48 Team S成员，鬼头桃菜。2015年以三上悠亚名义在MUTEKI出道。凭借偶像级的外貌和身材，迅速成为业界顶级女优。2023年正式引退。'
  },
  { 
      id: 'a2', name: '河北彩花', imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg', movieCount: 8, status: ActorStatus.ACTIVE, sourceUrl: 'https://www.javbus.com/star/xx2', isFavorite: true, birthDate: '1999-06-15',
      profile: '2017年在S1出道，被誉为“直球偶像”。出道即巅峰，随后隐退3年，2021年回归S1，再次掀起热潮。拥有极高的颜值和独特的气质。'
  },
  { id: 'a3', name: '相泽南', imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/3.jpg', movieCount: 12, status: ActorStatus.RETIRED, isFavorite: false, birthDate: '1996-06-14' },
  { id: 'a4', name: '小宵虎南', imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg', movieCount: 5, status: ActorStatus.ACTIVE, isFavorite: false, birthDate: '1999-04-01' },
  { id: 'a5', name: '新有菜', imageUrl: 'https://randomuser.me/api/portraits/women/5.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/5.jpg', movieCount: 20, status: ActorStatus.ACTIVE, isFavorite: true, birthDate: '1998-05-26' },
  { id: 'a6', name: '波多野结衣', imageUrl: 'https://randomuser.me/api/portraits/women/6.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/6.jpg', movieCount: 50, status: ActorStatus.ACTIVE, isFavorite: true, birthDate: '1988-05-24' },
  { id: 'a7', name: '明日花绮罗', imageUrl: 'https://randomuser.me/api/portraits/women/7.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/7.jpg', movieCount: 30, status: ActorStatus.RETIRED, isFavorite: false, birthDate: '1988-10-02' },
  { id: 'a8', name: '深田咏美', imageUrl: 'https://randomuser.me/api/portraits/women/8.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/8.jpg', movieCount: 25, status: ActorStatus.ACTIVE, isFavorite: false, birthDate: '1998-03-18' },
  { id: 'a9', name: '安斋拉拉', imageUrl: 'https://randomuser.me/api/portraits/women/9.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/9.jpg', movieCount: 10, status: ActorStatus.ACTIVE, isFavorite: true, birthDate: '1994-09-07' },
  { id: 'a10', name: '凉森玲梦', imageUrl: 'https://randomuser.me/api/portraits/women/10.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/10.jpg', movieCount: 18, status: ActorStatus.ACTIVE, isFavorite: false, birthDate: '1997-12-03' },
  { id: 'a11', name: '八挂海', imageUrl: 'https://randomuser.me/api/portraits/women/11.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/11.jpg', movieCount: 6, status: ActorStatus.ACTIVE, isFavorite: false, birthDate: '2000-09-23' },
  { id: 'a12', name: '枫富爱', imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg', sourceImageUrl: 'https://randomuser.me/api/portraits/women/12.jpg', movieCount: 9, status: ActorStatus.ACTIVE, isFavorite: true, birthDate: '2000-05-15' },
];

// --- 2. 静态磁力链接数据 ---
const mockMagnets: Magnet[] = [
    { id: 'mag1', title: 'SSNI-888-C.mp4', size: '5.2GB', date: '2023-11-16', link: 'magnet:?xt=urn:btih:mock1', isHD: true, movieCode: 'SSNI-888' },
    { id: 'mag2', title: 'SSNI-888.avi', size: '1.4GB', date: '2023-11-15', link: 'magnet:?xt=urn:btih:mock2', isHD: false, movieCode: 'SSNI-888' }
];

// Helper for tags
const createTags = (names: string[]): Tag[] => {
    return names.map((name, index) => ({
        id: `tag_${Math.random().toString(36).substr(2, 9)}`,
        name
    }));
};

// --- 3. 静态色花堂数据 (6条) ---
export const MOCK_SEHUATANG_DATA: SehuatangData[] = [
    { 
        id: 'ed1', movieCode: 'SSNI-888', code: 'SSNI-888', originalCode: 'SSNI-888',
        title: '[MP4/5.2G] SSNI-888 三上悠亜・新有菜 豪华共演！S1专属女优梦幻集结',
        actresses: '三上悠亜, 新有菜', releaseDate: '2023-11-15', category: '高清中文字幕', subCategory: '[有码高清]',
        size: '5.2GB', hasSubtitles: true, isVr: false, hasMosaic: true,
        in115: false, inNas: true, ignoreStatus: 0, isActorFavorite: true, isMultiActor: true, isIgnoredMovie: false,
        sourceUrl: '#', magnetLink: 'magnet:?xt=urn:btih:mock_ed1', coverUrl: 'https://picsum.photos/800/533?random=1'
    },
    { 
        id: 'ed2', movieCode: 'SSNI-888', code: 'SSNI-888', originalCode: 'ssni-888',
        title: '[MP4/4.8G] SSNI-888 S1 20th Anniversary Special (无字)',
        actresses: '三上悠亜, 新有菜', releaseDate: '2023-11-15', category: '亚洲无码原创', subCategory: '单体作品',
        size: '4.8GB', hasSubtitles: false, isVr: false, hasMosaic: false,
        in115: false, inNas: false, ignoreStatus: 1, isActorFavorite: true, isMultiActor: true, isIgnoredMovie: false,
        sourceUrl: '#', coverUrl: 'https://picsum.photos/800/533?random=2'
    },
    { 
        id: 'ed3', movieCode: 'IPX-123', code: 'IPX-123', originalCode: 'IPX-123',
        title: '[MP4/6.0G] IPX-123 相泽南引退作 催泪大结局',
        actresses: '相泽南', releaseDate: '2024-03-01', category: '高清中文字幕', subCategory: '单体作品',
        size: '6.0GB', hasSubtitles: true, isVr: false, hasMosaic: true,
        in115: true, inNas: false, ignoreStatus: 0, isActorFavorite: false, isMultiActor: false, isIgnoredMovie: false,
        sourceUrl: '#', magnetLink: 'magnet:?xt=urn:btih:mock_ed3', coverUrl: 'https://picsum.photos/800/533?random=3'
    },
    { 
        id: 'ed4', movieCode: 'FC2-223344', code: 'FC2-223344', originalCode: '223344',
        title: 'FC2-PPV-223344 绝品美少女 个人拍摄流出',
        actresses: '素人', releaseDate: '2024-01-20', category: '素人有码系列', subCategory: '无码流出',
        size: '2.1GB', hasSubtitles: false, isVr: false, hasMosaic: false,
        in115: true, inNas: false, ignoreStatus: 0, isActorFavorite: false, isMultiActor: false, isIgnoredMovie: false,
        sourceUrl: '#', magnetLink: 'magnet:?xt=urn:btih:mock_ed4', coverUrl: 'https://picsum.photos/800/533?random=4'
    },
    { 
        id: 'ed5', movieCode: 'MEYD-567', code: 'MEYD-567', originalCode: 'MEYD-567',
        title: '[VR] MEYD-567 波多野结衣 VR体验 就在你眼前',
        actresses: '波多野结衣', releaseDate: '2022-08-10', category: 'VR', subCategory: '4K',
        size: '12.0GB', hasSubtitles: true, isVr: true, hasMosaic: true,
        in115: false, inNas: false, ignoreStatus: 0, isActorFavorite: true, isMultiActor: false, isIgnoredMovie: true, // EXCLUDED
        sourceUrl: '#', magnetLink: 'magnet:?xt=urn:btih:mock_ed5', coverUrl: 'https://picsum.photos/800/533?random=5'
    },
    { 
        id: 'ed6', movieCode: 'STARS-900', code: 'STARS-900', originalCode: 'STARS-900',
        title: 'STARS-900 兰兰 出道一周年纪念',
        actresses: '安斋拉拉', releaseDate: '2023-05-20', category: '高清中文字幕', subCategory: '单体作品',
        size: '5.5GB', hasSubtitles: true, isVr: false, hasMosaic: true,
        in115: true, inNas: true, ignoreStatus: 0, isActorFavorite: true, isMultiActor: false, isIgnoredMovie: false,
        sourceUrl: '#', magnetLink: 'magnet:?xt=urn:btih:mock_ed6', coverUrl: 'https://picsum.photos/800/533?random=6'
    }
];

// --- 4. 静态影片数据 (16部) ---
// 确保 actorIds 对应 MOCK_ACTORS 中的 id
export const MOCK_MOVIES: Movie[] = [
  // 1. 已入库 & 双备份 & 多人共演
  {
    id: 'm1', title: 'SSNI-888', sourceCode: 'SSNI-888', year: 2023, releaseDate: '2023-11-15', length: 150,
    director: 'Hideki', studio: 'S1 NO.1 STYLE', label: 'S1', series: '20th Anniversary',
    posterUrl: 'https://picsum.photos/800/533?random=1', backdropUrl: 'https://picsum.photos/800/400?random=1',
    sourceUrl: 'https://www.javbus.com/SSNI-888', in115: true, inNas: true, status: MovieStatus.IN_LIBRARY,
    isFavorite: true, censorship: MovieCensorship.CENSORED, rating: 9.5,
    actorIds: ['a1', 'a5'], // 三上, 新有菜
    description: '三上悠亜・新有菜 豪华共演！S1专属女优梦幻集结。',
    transTitle: '三上悠亜・新有菜 豪华共演！S1专属女优梦幻集结',
    transDescription: 'S1的20周年纪念作品，集结了三上悠亚和新有菜两位顶尖女优，带来前所未有的豪华共演。',
    tags: createTags(['单体作品', '美少女', '豪华共演', '4K']),
    magnets: mockMagnets, sehuatangData: [MOCK_SEHUATANG_DATA[0], MOCK_SEHUATANG_DATA[1]], isMultiActor: true
  },
  // 2. 待处理 & 单人 & 退役
  {
    id: 'm2', title: 'IPX-123', sourceCode: 'IPX-123', year: 2024, releaseDate: '2024-03-01', length: 120,
    director: 'K.D.', studio: 'IDEA POCKET', label: 'IDEA POCKET', posterUrl: 'https://picsum.photos/800/533?random=2', backdropUrl: 'https://picsum.photos/800/400?random=2',
    sourceUrl: 'https://www.javbus.com/IPX-123', in115: false, inNas: false, status: MovieStatus.PENDING,
    isFavorite: false, censorship: MovieCensorship.CENSORED, rating: 8.8,
    actorIds: ['a3'], // 相泽南
    description: '相泽南引退作，感人至深的最后演出。',
    transTitle: '相泽南引退作：最后的闪耀',
    tags: createTags(['单体作品', '引退作', '剧情', '催泪']),
    magnets: [], sehuatangData: [MOCK_SEHUATANG_DATA[2]], isMultiActor: false
  },
  // 3. 待下载 & 无码 & 115已存
  {
    id: 'm3', title: 'FC2-PPV-223344', sourceCode: '223344', year: 2024, releaseDate: '2024-01-20', length: 65,
    director: 'Amateur', studio: 'FC2', posterUrl: 'https://picsum.photos/800/533?random=3', backdropUrl: 'https://picsum.photos/800/400?random=3',
    in115: true, inNas: false, status: MovieStatus.TO_DOWNLOAD,
    isFavorite: false, censorship: MovieCensorship.UNCENSORED, rating: 7.5,
    actorIds: [], // 素人
    description: '【个人拍摄】画质清晰，近距离拍摄。',
    tags: createTags(['素人', '自拍', '无码', '中出']),
    magnets: [], sehuatangData: [MOCK_SEHUATANG_DATA[3]], isMultiActor: false
  },
  // 4. 已排除 & VR & 有码
  {
    id: 'm4', title: 'MEYD-567', sourceCode: 'MEYD-567', year: 2022, releaseDate: '2022-08-10', length: 180,
    director: 'VR Man', studio: 'MOODYZ', series: 'VR Series', posterUrl: 'https://picsum.photos/800/533?random=4', backdropUrl: 'https://picsum.photos/800/400?random=4',
    in115: false, inNas: false, status: MovieStatus.EXCLUDED,
    isFavorite: false, censorship: MovieCensorship.CENSORED, rating: 6.5,
    actorIds: ['a6'], // 波多野结衣
    description: '波多野结衣 VR体验 就在你眼前。',
    tags: createTags(['VR', '人妻', '巨乳']),
    magnets: [], sehuatangData: [MOCK_SEHUATANG_DATA[4]], isMultiActor: false
  },
  // 5. 已入库 & 双备份 & 无码
  {
    id: 'm5', title: 'CARIB-001', sourceCode: '001', year: 2023, releaseDate: '2023-12-05', length: 45,
    director: 'Carib', studio: 'Caribbeancom', posterUrl: 'https://picsum.photos/800/533?random=5', backdropUrl: 'https://picsum.photos/800/400?random=5',
    in115: true, inNas: true, status: MovieStatus.IN_LIBRARY,
    isFavorite: true, censorship: MovieCensorship.UNCENSORED, rating: 9.0,
    actorIds: ['a8'], // 深田咏美
    description: '深田咏美 海外流出，展现最真实的一面。',
    tags: createTags(['无码', '整容级', '痴女', '颜射']),
    isMultiActor: false
  },
  // 6. 待下载 & 河北彩花
  {
    id: 'm6', title: 'SSNI-999', sourceCode: 'SSNI-999', year: 2023, releaseDate: '2023-10-10', length: 135,
    director: 'Hideki', studio: 'S1', label: 'S1', posterUrl: 'https://picsum.photos/800/533?random=6', backdropUrl: 'https://picsum.photos/800/400?random=6',
    in115: true, inNas: false, status: MovieStatus.TO_DOWNLOAD,
    isFavorite: true, censorship: MovieCensorship.CENSORED, rating: 9.3,
    actorIds: ['a2'], // 河北彩花
    description: '河北彩花最新力作，极致的美感与视觉享受。',
    tags: createTags(['单体作品', '美腿', '清纯', '4K']),
    isMultiActor: false
  },
  // 7. 待处理 & 安斋拉拉
  {
    id: 'm7', title: 'STARS-900', sourceCode: 'STARS-900', year: 2023, releaseDate: '2023-05-20', length: 110,
    director: 'Unknown', studio: 'SOD Create', posterUrl: 'https://picsum.photos/800/533?random=7', backdropUrl: 'https://picsum.photos/800/400?random=7',
    in115: false, inNas: false, status: MovieStatus.PENDING,
    isFavorite: true, censorship: MovieCensorship.CENSORED, rating: 9.1,
    actorIds: ['a9'], // 安斋拉拉
    description: '神之乳 安斋拉拉 回归作。',
    tags: createTags(['巨乳', '神颜', '复出']),
    magnets: [], sehuatangData: [MOCK_SEHUATANG_DATA[5]], isMultiActor: false
  },
  // 8. 已入库 & 小宵虎南
  {
    id: 'm8', title: 'SIVR-100', sourceCode: 'SIVR-100', year: 2023, releaseDate: '2023-04-01', length: 120,
    director: 'VR Staff', studio: 'S1', posterUrl: 'https://picsum.photos/800/533?random=8', backdropUrl: 'https://picsum.photos/800/400?random=8',
    in115: true, inNas: true, status: MovieStatus.IN_LIBRARY,
    isFavorite: false, censorship: MovieCensorship.CENSORED, rating: 8.2,
    actorIds: ['a4'], // 小宵虎南
    description: '小宵虎南 VR 沉浸式体验。',
    tags: createTags(['VR', '美臀', '骑乘']),
    isMultiActor: false
  },
  // 9. 待处理 & 凉森玲梦
  {
    id: 'm9', title: 'PRE-555', sourceCode: 'PRE-555', year: 2023, releaseDate: '2023-07-15', length: 140,
    director: 'Prestige', studio: 'Prestige', posterUrl: 'https://picsum.photos/800/533?random=9', backdropUrl: 'https://picsum.photos/800/400?random=9',
    in115: false, inNas: false, status: MovieStatus.PENDING,
    isFavorite: false, censorship: MovieCensorship.CENSORED, rating: 8.6,
    actorIds: ['a10'], // 凉森玲梦
    description: '凉森玲梦 极致诱惑。',
    tags: createTags(['美眼', '白丝', 'OL']),
    isMultiActor: false
  },
  // 10. 待下载 & 八挂海
  {
    id: 'm10', title: 'DASD-888', sourceCode: 'DASD-888', year: 2023, releaseDate: '2023-08-20', length: 130,
    director: 'Das', studio: 'DAS', posterUrl: 'https://picsum.photos/800/533?random=16', backdropUrl: 'https://picsum.photos/800/400?random=16',
    in115: true, inNas: false, status: MovieStatus.TO_DOWNLOAD,
    isFavorite: false, censorship: MovieCensorship.CENSORED, rating: 8.4,
    actorIds: ['a11'], // 八挂海
    description: '八挂海 青春活力。',
    tags: createTags(['短发', '可爱', '校园']),
    isMultiActor: false
  },
  // 11. 已入库 & 枫富爱
  {
    id: 'm11', title: 'IPX-999', sourceCode: 'IPX-999', year: 2023, releaseDate: '2023-09-09', length: 125,
    director: 'K.D.', studio: 'IDEA POCKET', posterUrl: 'https://picsum.photos/800/533?random=17', backdropUrl: 'https://picsum.photos/800/400?random=17',
    in115: true, inNas: true, status: MovieStatus.IN_LIBRARY,
    isFavorite: true, censorship: MovieCensorship.CENSORED, rating: 8.9,
    actorIds: ['a12'], // 枫富爱
    description: '枫富爱 奇迹的美少女。',
    tags: createTags(['美少女', '黑长直', '新人']),
    isMultiActor: false
  },
  // 12. 待处理 & 三上悠亚 (旧作)
  {
    id: 'm12', title: 'TEK-080', sourceCode: 'TEK-080', year: 2016, releaseDate: '2016-01-01', length: 180,
    director: 'S1', studio: 'S1', posterUrl: 'https://picsum.photos/800/533?random=18', backdropUrl: 'https://picsum.photos/800/400?random=18',
    in115: false, inNas: false, status: MovieStatus.PENDING,
    isFavorite: true, censorship: MovieCensorship.CENSORED, rating: 9.8,
    actorIds: ['a1'], // 三上
    description: '三上悠亚出道作，传说开始的地方。',
    tags: createTags(['出道作', '偶像', '经典']),
    isMultiActor: false
  },
  // 13. 已排除 & 烂片模拟
  {
    id: 'm13', title: 'BAD-001', sourceCode: 'BAD-001', year: 2020, releaseDate: '2020-01-01', length: 90,
    director: 'Bad Director', studio: 'Bad Studio', posterUrl: 'https://picsum.photos/800/533?random=19', backdropUrl: 'https://picsum.photos/800/400?random=19',
    in115: false, inNas: false, status: MovieStatus.EXCLUDED,
    isFavorite: false, censorship: MovieCensorship.CENSORED, rating: 2.0,
    actorIds: ['a4'], // 小宵虎南 (假设关联)
    description: '一部评价很低的影片，已被排除。',
    tags: createTags(['雷作']),
    isMultiActor: false
  },
  // 14. 待下载 & 共演 (河北 & 枫富爱)
  {
    id: 'm14', title: 'IPX-888', sourceCode: 'IPX-888', year: 2023, releaseDate: '2023-12-25', length: 160,
    director: 'K.D.', studio: 'IDEA POCKET', posterUrl: 'https://picsum.photos/800/533?random=20', backdropUrl: 'https://picsum.photos/800/400?random=20',
    in115: true, inNas: false, status: MovieStatus.TO_DOWNLOAD,
    isFavorite: true, censorship: MovieCensorship.CENSORED, rating: 9.4,
    actorIds: ['a2', 'a12'], // 河北, 枫富爱
    description: 'IP社两大王牌共演，圣诞特别企划。',
    tags: createTags(['共演', '美少女', '圣诞']),
    isMultiActor: true
  },
  // 15. PENDING & 无演员关联
  {
    id: 'm15', title: 'UNKNOWN-001', sourceCode: 'UNK-001', year: 2024, releaseDate: '2024-04-01', length: 60,
    director: 'Unknown', studio: 'Unknown', posterUrl: 'https://picsum.photos/800/533?random=21', backdropUrl: 'https://picsum.photos/800/400?random=21',
    in115: false, inNas: false, status: MovieStatus.PENDING,
    isFavorite: false, censorship: MovieCensorship.CENSORED, rating: 5.0,
    actorIds: [], 
    description: '抓取失败或无演员信息的影片。',
    tags: createTags(['待整理']),
    isMultiActor: false
  },
  // 16. 已入库 & 新有菜
  {
    id: 'm16', title: 'SSNI-777', sourceCode: 'SSNI-777', year: 2022, releaseDate: '2022-07-07', length: 130,
    director: 'Hideki', studio: 'S1', posterUrl: 'https://picsum.photos/800/533?random=22', backdropUrl: 'https://picsum.photos/800/400?random=22',
    in115: true, inNas: true, status: MovieStatus.IN_LIBRARY,
    isFavorite: true, censorship: MovieCensorship.CENSORED, rating: 9.1,
    actorIds: ['a5'], // 新有菜
    description: '新有菜 完美身材展示。',
    tags: createTags(['美腿', '高挑', 'S1']),
    isMultiActor: false
  }
];