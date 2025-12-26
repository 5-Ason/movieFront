package com.ason.movievault.entity;

import com.ason.movievault.enums.MovieStatus;
import com.ason.movievault.enums.MovieCensorship;
import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 影片主表 Entity
 * 对应数据库表: movie
 */
@Data
@Accessors(chain = true) // Lombok 链式调用
@TableName("movie") // MyBatis-Plus 表名映射
@Schema(description = "影片实体")
public class Movie {

    @TableId(value = "id", type = IdType.AUTO) // 主键自增
    @Schema(description = "主键ID")
    private Long id;

    @TableField("code")
    @Schema(description = "番号 (业务主键, 如 SSNI-888)", required = true)
    private String code;

    @TableField("source_code")
    @Schema(description = "源番号 (冗余, 如 ssni-888)")
    private String sourceCode;

    @TableField("title")
    @Schema(description = "原始标题")
    private String title;

    @TableField("description")
    @Schema(description = "完整日文描述")
    private String description;

    @TableField("translated_title")
    @Schema(description = "翻译标题")
    private String translatedTitle;

    @TableField("translated_description")
    @Schema(description = "翻译描述")
    private String translatedDescription;

    @TableField("release_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd") // 接收 "yyyy-MM-dd" 格式
    @JsonFormat(pattern = "yyyy-MM-dd") // 返回 "yyyy-MM-dd" 格式
    @Schema(description = "发行日期")
    private LocalDate releaseDate;

    @TableField("duration")
    @Schema(description = "时长(分钟)")
    private Integer duration;

    @TableField("director")
    @Schema(description = "导演")
    private String director;

    @TableField("studio")
    @Schema(description = "制作商")
    private String studio;

    @TableField("label")
    @Schema(description = "发行商")
    private String label;

    @TableField("series")
    @Schema(description = "系列")
    private String series;

    @TableField("poster_url")
    @Schema(description = "封面图片URL")
    private String posterUrl;

    @TableField("backdrop_url")
    @Schema(description = "背景大图URL")
    private String backdropUrl;

    @TableField("source_url")
    @Schema(description = "来源页面URL (Javbus链接)")
    private String sourceUrl;

    @TableField("source_poster_url")
    @Schema(description = "源封面URL")
    private String sourcePosterUrl;

    @TableField("source_backdrop_url")
    @Schema(description = "源背景URL")
    private String sourceBackdropUrl;

    @TableField("has_115")
    @Schema(description = "是否在115网盘: 0-否, 1-是")
    private Boolean has115;

    @TableField("has_nas")
    @Schema(description = "是否在本地NAS: 0-否, 1-是")
    private Boolean hasNas;

    @TableField("status")
    @Schema(description = "状态: PENDING-待处理, TO_DOWNLOAD-待下载, EXCLUDED-已排除, IN_LIBRARY-已入库")
    private MovieStatus status; // 枚举类型

    @TableField("censorship")
    @Schema(description = "审查: CENSORED-有码, UNCENSORED-无码")
    private MovieCensorship censorship; // 枚举类型

    @TableField("rating")
    @Schema(description = "评分")
    private BigDecimal rating;

    @TableField("is_multi_actor")
    @Schema(description = "是否为多人共演: 0-否, 1-是")
    private Boolean isMultiActor;

    @TableField("is_favorite")
    @Schema(description = "是否为收藏影片: 0-否, 1-是")
    private Boolean isFavorite;

    @TableField(value = "created_at", fill = FieldFill.INSERT) // 自动填充
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE) // 自动填充
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;

    // 非数据库字段，用于关联查询结果（需自定义 ResultMap 或注解）
    @TableField(exist = false)
    @Schema(description = "关联的演员列表（非数据库字段）")
    private java.util.List<Actor> actors;

    @TableField(exist = false)
    @Schema(description = "关联的标签列表（非数据库字段）")
    private java.util.List<Genre> genres;
}