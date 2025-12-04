/*
 Navicat Premium Data Transfer

 Source Server         : javbus
 Source Server Type    : MySQL
 Source Server Version : 90500
 Source Host           : 192.168.0.100:3306
 Source Schema         : movie_vault

 Target Server Type    : MySQL
 Target Server Version : 90500
 File Encoding         : 65001

 Date: 03/12/2025 15:16:52
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for actor
-- ----------------------------
DROP TABLE IF EXISTS `actor`;
CREATE TABLE `actor`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '演员姓名',
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像URL',
  `source_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '源头像URL',
  `source_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Javbus演员页',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-活跃, RETIRED-退役',
  `is_favorite` tinyint NULL DEFAULT 0 COMMENT '是否为收藏的演员: 0-否, 1-是',
  `birth_date` date NULL DEFAULT NULL COMMENT '出生日期',
  `profile` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '演员资料/简介',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_actor_name`(`name` ASC) USING BTREE,
  INDEX `idx_actor_status`(`status` ASC) USING BTREE,
  INDEX `idx_actor_favorite`(`is_favorite` ASC) USING BTREE,
  INDEX `idx_actor_birth_date`(`birth_date` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '演员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for genre
-- ----------------------------
DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类别名称',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_genre_name`(`name` ASC) USING BTREE,
  INDEX `idx_genre_created`(`created_at` DESC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '类别标签表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for magnet
-- ----------------------------
DROP TABLE IF EXISTS `magnet`;
CREATE TABLE `magnet`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `movie_id` bigint UNSIGNED NOT NULL,
  `movie_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '冗余字段',
  `magnet_link` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '磁力链接',
  `magnet_hash` char(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '磁力链接Hash (SHA1)',
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '文件标题',
  `size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '文件大小',
  `share_date` date NULL DEFAULT NULL COMMENT '分享日期',
  `is_hd` tinyint NULL DEFAULT 0 COMMENT '是否高清: 0-否, 1-是',
  `is_selected` tinyint NULL DEFAULT 0 COMMENT '是否已选择下载: 0-否, 1-是',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_magnet_hash`(`magnet_hash` ASC) USING BTREE,
  INDEX `idx_magnet_movie_code`(`movie_code` ASC) USING BTREE,
  INDEX `idx_magnet_movie_id`(`movie_id` ASC) USING BTREE,
  INDEX `idx_magnet_hd`(`is_hd` ASC) USING BTREE,
  INDEX `idx_magnet_selected`(`is_selected` ASC) USING BTREE,
  INDEX `idx_magnet_share_date`(`share_date` DESC) USING BTREE,
  CONSTRAINT `magnet_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '磁力链接表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for movie
-- ----------------------------
DROP TABLE IF EXISTS `movie`;
CREATE TABLE `movie`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '番号 (业务主键, 如 SSNI-888)',
  `source_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '源番号 (冗余, 如 ssni-888)',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '原始标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '完整日文描述',
  `translated_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '翻译标题',
  `translated_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '翻译描述',
  `release_date` date NULL DEFAULT NULL COMMENT '发行日期',
  `duration` int UNSIGNED NULL DEFAULT NULL COMMENT '时长(分钟)',
  `director` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '导演',
  `studio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '制作商',
  `label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发行商',
  `series` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '系列',
  `poster_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面图片URL',
  `backdrop_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '背景大图URL',
  `source_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '来源页面URL (Javbus链接)',
  `source_poster_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '源封面URL',
  `source_backdrop_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '源背景URL',
  `has_115` tinyint NULL DEFAULT 0 COMMENT '是否在115网盘: 0-否, 1-是',
  `has_nas` tinyint NULL DEFAULT 0 COMMENT '是否在本地NAS: 0-否, 1-是',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING' COMMENT '状态: PENDING-待处理, TO_DOWNLOAD-待下载, EXCLUDED-已排除, IN_LIBRARY-已入库',
  `censorship` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CENSORED' COMMENT '审查: CENSORED-有码, UNCENSORED-无码',
  `rating` decimal(3, 1) UNSIGNED NULL DEFAULT 0.0 COMMENT '评分',
  `is_multi_actor` tinyint NULL DEFAULT 0 COMMENT '是否为多人共演: 0-否, 1-是',
  `is_favorite` tinyint NULL DEFAULT 0 COMMENT '是否为收藏影片: 0-否, 1-是',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_movie_code`(`code` ASC) USING BTREE,
  INDEX `idx_movie_release_date`(`release_date` DESC) USING BTREE,
  INDEX `idx_movie_studio`(`studio` ASC) USING BTREE,
  INDEX `idx_movie_status`(`status` ASC) USING BTREE,
  INDEX `idx_movie_censorship`(`censorship` ASC) USING BTREE,
  INDEX `idx_movie_favorite`(`is_favorite` ASC) USING BTREE,
  INDEX `idx_movie_multi_actor`(`is_multi_actor` ASC) USING BTREE,
  INDEX `idx_movie_created`(`created_at` DESC) USING BTREE,
  INDEX `idx_movie_studio_date`(`studio` ASC, `release_date` DESC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '影片主表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for movie_actor
-- ----------------------------
DROP TABLE IF EXISTS `movie_actor`;
CREATE TABLE `movie_actor`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `movie_id` bigint UNSIGNED NOT NULL,
  `movie_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '冗余字段',
  `actor_id` bigint UNSIGNED NOT NULL,
  `actor_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '冗余演员姓名',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_movie_actor`(`movie_id` ASC, `actor_id` ASC) USING BTREE,
  INDEX `idx_movie_actor_movie_code`(`movie_code` ASC) USING BTREE,
  INDEX `idx_movie_actor_actor_name`(`actor_name` ASC) USING BTREE,
  INDEX `idx_movie_actor_actor_id`(`actor_id` ASC) USING BTREE,
  CONSTRAINT `movie_actor_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `movie_actor_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '影片演员关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for movie_genre
-- ----------------------------
DROP TABLE IF EXISTS `movie_genre`;
CREATE TABLE `movie_genre`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `movie_id` bigint UNSIGNED NOT NULL,
  `movie_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '冗余字段',
  `genre_id` bigint UNSIGNED NOT NULL,
  `genre_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '冗余类别名称',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_movie_genre`(`movie_id` ASC, `genre_id` ASC) USING BTREE,
  INDEX `idx_movie_genre_movie_code`(`movie_code` ASC) USING BTREE,
  INDEX `idx_movie_genre_genre_name`(`genre_name` ASC) USING BTREE,
  INDEX `idx_movie_genre_genre_id`(`genre_id` ASC) USING BTREE,
  CONSTRAINT `movie_genre_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `movie_genre_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '影片类别关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sehuatang_data
-- ----------------------------
DROP TABLE IF EXISTS `sehuatang_data`;
CREATE TABLE `sehuatang_data`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `movie_id` bigint UNSIGNED NULL DEFAULT NULL COMMENT '本地影片ID',
  `movie_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '影片番号',
  `release_date` date NULL DEFAULT NULL COMMENT '发布日期',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '大类别',
  `sub_category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '子类别',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '清洗后的番号',
  `original_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '原始番号',
  `has_subtitles` tinyint NULL DEFAULT 0 COMMENT '是否中字: 0-否, 1-是',
  `is_vr` tinyint NULL DEFAULT 0 COMMENT '是否VR: 0-否, 1-是',
  `has_mosaic` tinyint NULL DEFAULT 1 COMMENT '是否有码: 0-否, 1-是',
  `original_title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '原标题',
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '影片名称',
  `actresses` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '出演女优',
  `cover_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '帖子封面图URL',
  `in_115` tinyint NULL DEFAULT 0 COMMENT '是否下载115: 0-否, 1-是',
  `in_nas` tinyint NULL DEFAULT 0 COMMENT '是否下载本地: 0-否, 1-是',
  `size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '影片大小',
  `magnet_link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '磁力链接',
  `source_url` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '原帖链接',
  `cleaning_status` tinyint NULL DEFAULT 0 COMMENT '清洗状态: 0-正常, 1-有码存无码, 2-无码存字幕',
  `is_actor_favorite` tinyint NULL DEFAULT 0 COMMENT '是否为已收藏女优: 0-否, 1-是',
  `is_multi_actor` tinyint NULL DEFAULT 0 COMMENT '是否为多人共演: 0-否, 1-是',
  `is_ignored` tinyint NULL DEFAULT 0 COMMENT '是否为忽略的影片: 0-否, 1-是',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_sehuatang_movie_code`(`movie_code` ASC) USING BTREE,
  INDEX `idx_sehuatang_movie_id`(`movie_id` ASC) USING BTREE,
  INDEX `idx_sehuatang_cleaning_status`(`cleaning_status` ASC) USING BTREE,
  INDEX `idx_sehuatang_has_subtitles`(`has_subtitles` ASC) USING BTREE,
  INDEX `idx_sehuatang_is_vr`(`is_vr` ASC) USING BTREE,
  INDEX `idx_sehuatang_in_115`(`in_115` ASC) USING BTREE,
  INDEX `idx_sehuatang_in_nas`(`in_nas` ASC) USING BTREE,
  INDEX `idx_sehuatang_created`(`created_at` DESC) USING BTREE,
  INDEX `idx_sehuatang_release_date`(`release_date` DESC) USING BTREE,
  INDEX `idx_sehuatang_composite`(`has_subtitles` ASC, `has_mosaic` ASC, `cleaning_status` ASC) USING BTREE,
  CONSTRAINT `sehuatang_data_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '色花堂数据表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
