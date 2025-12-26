package com.ason.movievault.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 色花堂数据表 Entity
 * 对应数据库表: sehuatang_data
 */
@Data
@Accessors(chain = true)
@TableName("sehuatang_data")
@Schema(description = "色花堂数据实体")
public class SehuatangData {

    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("movie_id")
    @Schema(description = "关联的本地影片ID")
    private Long movieId;

    @TableField("movie_code")
    @Schema(description = "影片番号")
    private String movieCode;

    @TableField("release_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "发布日期")
    private LocalDate releaseDate;

    @TableField("category")
    @Schema(description = "大类别")
    private String category;

    @TableField("sub_category")
    @Schema(description = "子类别")
    private String subCategory;

    @TableField("code")
    @Schema(description = "清洗后的番号")
    private String code;

    @TableField("original_code")
    @Schema(description = "原始番号")
    private String originalCode;

    @TableField("has_subtitles")
    @Schema(description = "是否中字: 0-否, 1-是")
    private Boolean hasSubtitles;

    @TableField("is_vr")
    @Schema(description = "是否VR: 0-否, 1-是")
    private Boolean isVr;

    @TableField("has_mosaic")
    @Schema(description = "是否有码: 0-否, 1-是")
    private Boolean hasMosaic;

    @TableField("original_title")
    @Schema(description = "原标题")
    private String originalTitle;

    @TableField("title")
    @Schema(description = "影片名称")
    private String title;

    @TableField("actresses")
    @Schema(description = "出演女优")
    private String actresses;

    @TableField("cover_url")
    @Schema(description = "帖子封面图URL")
    private String coverUrl;

    @TableField("in_115")
    @Schema(description = "是否下载115: 0-否, 1-是")
    private Boolean in115;

    @TableField("in_nas")
    @Schema(description = "是否下载本地: 0-否, 1-是")
    private Boolean inNas;

    @TableField("size")
    @Schema(description = "影片大小")
    private String size;

    @TableField("magnet_link")
    @Schema(description = "磁力链接")
    private String magnetLink;

    @TableField("source_url")
    @Schema(description = "原帖链接")
    private String sourceUrl;

    @TableField("cleaning_status")
    @Schema(description = "清洗状态: 0-正常, 1-有码存无码, 2-无码存字幕")
    private Integer cleaningStatus;

    @TableField("is_actor_favorite")
    @Schema(description = "是否为已收藏女优: 0-否, 1-是")
    private Boolean isActorFavorite;

    @TableField("is_multi_actor")
    @Schema(description = "是否为多人共演: 0-否, 1-是")
    private Boolean isMultiActor;

    @TableField("is_ignored")
    @Schema(description = "是否为忽略的影片: 0-否, 1-是")
    private Boolean isIgnored;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;

    // 非数据库字段
    @TableField(exist = false)
    @Schema(description = "关联的影片信息（非数据库字段）")
    private Movie movie;
}