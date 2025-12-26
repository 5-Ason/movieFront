package com.ason.movievault.entity;

import com.ason.movievault.enums.ActorStatus;
import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 演员表 Entity
 * 对应数据库表: actor
 */
@Data
@Accessors(chain = true)
@TableName("actor")
@Schema(description = "演员实体")
public class Actor {

    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("name")
    @Schema(description = "演员姓名", required = true)
    private String name;

    @TableField("image_url")
    @Schema(description = "头像URL")
    private String imageUrl;

    @TableField("source_image_url")
    @Schema(description = "源头像URL")
    private String sourceImageUrl;

    @TableField("source_url")
    @Schema(description = "Javbus演员页")
    private String sourceUrl;

    @TableField("status")
    @Schema(description = "状态: ACTIVE-活跃, RETIRED-退役")
    private ActorStatus status; // 枚举类型

    @TableField("is_favorite")
    @Schema(description = "是否为收藏的演员: 0-否, 1-是")
    private Boolean isFavorite;

    @TableField("birth_date")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(description = "出生日期")
    private LocalDate birthDate;

    @TableField("profile")
    @Schema(description = "演员资料/简介")
    private String profile;

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
    @Schema(description = "关联的影片列表（非数据库字段）")
    private java.util.List<Movie> movies;
}