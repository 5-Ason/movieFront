-- 创建数据库
CREATE DATABASE IF NOT EXISTS movie_vault DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE movie_vault;

-- ========================================================
-- 清理旧表 (按依赖关系倒序删除)
-- ========================================================
DROP TABLE IF EXISTS sehuatang_data;
DROP TABLE IF EXISTS magnet;
DROP TABLE IF EXISTS movie_genre;
DROP TABLE IF EXISTS genre;
DROP TABLE IF EXISTS movie_actor;
DROP TABLE IF EXISTS actor;
DROP TABLE IF EXISTS movie;

-- ========================================================
-- 1. 影片主表 (Movie)
-- ========================================================
CREATE TABLE movie (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '番号 (业务主键, 如 SSNI-888)',
    source_code VARCHAR(50) COMMENT '源番号 (冗余, 如 ssni-888)',
    title VARCHAR(255) COMMENT '原始番号/标题',
    description TEXT COMMENT '完整日文标题/描述',
    trans_title VARCHAR(255) COMMENT '翻译标题',
    trans_description TEXT COMMENT '翻译描述',
    
    release_date DATE COMMENT '发行日期',
    length INT COMMENT '时长(分钟)',
    director VARCHAR(100) COMMENT '导演',
    studio VARCHAR(100) COMMENT '制作商',
    label VARCHAR(100) COMMENT '发行商',
    series VARCHAR(100) COMMENT '系列',
    
    poster_url VARCHAR(500) COMMENT '封面图片URL',
    backdrop_url VARCHAR(500) COMMENT '背景大图URL',
    source_url VARCHAR(500) COMMENT '来源页面URL (Javbus链接)',
    source_poster_url VARCHAR(500) COMMENT '源封面URL',
    source_backdrop_url VARCHAR(500) COMMENT '源背景URL',
    
    -- *** 物理存储状态 (只读) ***
    is_115 BOOLEAN DEFAULT FALSE COMMENT '是否在115网盘',
    is_nas BOOLEAN DEFAULT FALSE COMMENT '是否在本地NAS',
    
    -- *** 业务管理状态 ***
    -- PENDING: 待处理 (默认)
    -- TO_DOWNLOAD: 待下载
    -- EXCLUDED: 已排除
    -- IN_LIBRARY: 已入库
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态',

    censorship VARCHAR(20) DEFAULT 'CENSORED' COMMENT '审查: CENSORED, UNCENSORED',
    rating DECIMAL(3,1) DEFAULT 0.0 COMMENT '评分',
    
    is_multi_actor BOOLEAN DEFAULT FALSE COMMENT '是否为多人共演',
    is_favorite BOOLEAN DEFAULT FALSE COMMENT '是否为收藏影片',
    
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_code (code),
    INDEX idx_release_date (release_date),
    INDEX idx_studio (studio),
    INDEX idx_status (status),
    INDEX idx_favorite (is_favorite)
) ENGINE=InnoDB COMMENT='影片主表';

-- ========================================================
-- 2. 演员表 (Actor)
-- ========================================================
CREATE TABLE actor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '演员姓名',
    image_url VARCHAR(500) COMMENT '头像URL',
    source_image_url VARCHAR(500) COMMENT '源头像URL',
    source_url VARCHAR(500) COMMENT 'Javbus演员页',
    
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE, RETIRED',
    is_favorite BOOLEAN DEFAULT FALSE COMMENT '是否为收藏的演员',
    birth_date DATE COMMENT '出生日期',
    
    profile TEXT COMMENT '演员资料/简介', -- 新增字段
    
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_name (name)
) ENGINE=InnoDB COMMENT='演员表';

-- ========================================================
-- 3. 影片-演员关联表 (Movie_Actor)
-- ========================================================
CREATE TABLE movie_actor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    movie_code VARCHAR(50) NOT NULL COMMENT '冗余字段',
    actor_id BIGINT NOT NULL,
    actor_name VARCHAR(100) COMMENT '冗余演员姓名',
    
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actor(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_movie_actor (movie_id, actor_id),
    INDEX idx_ma_movie_code (movie_code)
) ENGINE=InnoDB COMMENT='影片演员关联表';

-- ========================================================
-- 4. 类别/标签表 (Genre)
-- ========================================================
CREATE TABLE genre (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '类别名称',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_name (name)
) ENGINE=InnoDB COMMENT='类别标签表';

-- ========================================================
-- 5. 影片-类别关联表 (Movie_Genre)
-- ========================================================
CREATE TABLE movie_genre (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    movie_code VARCHAR(50) NOT NULL COMMENT '冗余字段',
    genre_id BIGINT NOT NULL,
    genre_name VARCHAR(50) COMMENT '冗余类别名称',
    
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE,
    
    UNIQUE KEY uk_movie_genre (movie_id, genre_id),
    INDEX idx_mg_movie_code (movie_code)
) ENGINE=InnoDB COMMENT='影片类别关联表';

-- ========================================================
-- 6. 本地磁力链接表 (Magnet)
-- ========================================================
CREATE TABLE magnet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    movie_code VARCHAR(50) NOT NULL COMMENT '冗余字段',
    link VARCHAR(1000) NOT NULL COMMENT '磁力链接',
    link_hash VARCHAR(100) COMMENT 'Hash去重',
    title VARCHAR(255) COMMENT '文件标题',
    size VARCHAR(50) COMMENT '文件大小',
    share_date DATE COMMENT '分享日期',
    is_hd BOOLEAN DEFAULT FALSE COMMENT '是否高清',
    
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE,
    INDEX idx_mag_movie_code (movie_code)
) ENGINE=InnoDB COMMENT='本地磁力链接表';

-- ========================================================
-- 7. 色花堂清洗数据表 (Sehuatang_Data)
-- ========================================================
CREATE TABLE sehuatang_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    
    -- 关联字段
    movie_id BIGINT COMMENT '本地影片ID',
    movie_code VARCHAR(50) NOT NULL COMMENT '影片番号',
    
    -- 核心业务字段
    release_date DATE COMMENT '发布日期',
    category VARCHAR(50) COMMENT '大类别',
    sub_category VARCHAR(50) COMMENT '子类别',
    code VARCHAR(50) COMMENT '清洗后的番号',
    original_code VARCHAR(50) COMMENT '原始番号',
    has_subtitles BOOLEAN DEFAULT FALSE COMMENT '是否中字',
    is_vr BOOLEAN DEFAULT FALSE COMMENT '是否VR',
    has_mosaic BOOLEAN DEFAULT TRUE COMMENT '是否有码',
    original_title TEXT COMMENT '原标题',
    title TEXT COMMENT '影片名称',
    actresses TEXT COMMENT '出演女优',
    cover_url VARCHAR(500) COMMENT '帖子封面图URL',
    
    -- 外部资源状态
    in_115 BOOLEAN DEFAULT FALSE COMMENT '是否下载115',
    in_nas BOOLEAN DEFAULT FALSE COMMENT '是否下载本地',
    size VARCHAR(50) COMMENT '影片大小',
    magnet_link TEXT COMMENT '磁力链接',
    source_url TEXT COMMENT '原帖链接',
    
    -- 智能清洗状态
    ignore_status INT DEFAULT 0 COMMENT '清洗状态(0:正常 1:有码存无码 2:无码存字幕)',
    
    is_actor_favorite BOOLEAN DEFAULT FALSE COMMENT '是否为已收藏女优',
    is_multi_actor BOOLEAN DEFAULT FALSE COMMENT '是否为多人共演',
    is_ignored_movie BOOLEAN DEFAULT FALSE COMMENT '是否为忽略的影片',
    
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_movie_code (movie_code),
    INDEX idx_movie_id (movie_id)
) ENGINE=InnoDB COMMENT='色花堂清洗数据表';