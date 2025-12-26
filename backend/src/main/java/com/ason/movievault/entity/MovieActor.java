package com.ason.movievault.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

/**
 * 影片演员关联表 Entity
 * 对应数据库表: movie_actor
 * 用于多对多关系映射
 */
@Data
@Accessors(chain = true)
@TableName("movie_actor")
@Schema(description = "影片演员关联实体")
public class MovieActor {

    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    @TableField("movie_id")
    @Schema(description = "影片ID", required = true)
    private Long movieId;

    @TableField("movie_code")
    @Schema(description = "冗余字段：影片番号", required = true)
    private String movieCode;

    @TableField("actor_id")
    @Schema(description = "演员ID", required = true)
    private Long actorId;

    @TableField("actor_name")
    @Schema(description = "冗余字段：演员姓名", required = true)
    private String actorName;

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

    @TableField(exist = false)
    @Schema(description = "关联的演员信息（非数据库字段）")
    private Actor actor;
}