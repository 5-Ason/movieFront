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
 * 磁力链接表 Entity
 * 对应数据库表: magnet
 */
@Data
@Accessors(chain = true)
@TableName("magnet")
@Schema(description = "磁力链接实体")
public class Magnet {

    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("movie_id")
    @Schema(description = "关联的影片ID", required = true)
    private Long movieId;

    @TableField("movie_code")
    @Schema(description = "冗余字段：影片番号", required = true)
    private String movieCode;

    @TableField("magnet_link")
    @Schema(description = "磁力链接", required = true)
    private String magnetLink;

    @TableField("magnet_hash")
    @Schema(description = "磁力链接Hash (SHA1)")
    private String magnetHash;

    @TableField("title")
    @Schema(description = "文件标题")
    private String title;

    @TableField("size")
    @Schema(description = "文件大小")
    private String size;

    @TableField("share_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "分享日期")
    private LocalDate shareDate;

    @TableField("is_hd")
    @Schema(description = "是否高清: 0-否, 1-是")
    private Boolean isHd;

    @TableField("is_selected")
    @Schema(description = "是否已选择下载: 0-否, 1-是")
    private Boolean isSelected;

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