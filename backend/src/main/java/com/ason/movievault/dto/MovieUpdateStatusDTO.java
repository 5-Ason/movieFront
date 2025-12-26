package com.ason.movievault.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 更新影片状态 DTO
 * 用于 PUT /api/movies/{id}/status
 */
@Data
@Schema(description = "更新影片状态 DTO")
public class MovieUpdateStatusDTO {

    @Schema(description = "新的状态：PENDING, TO_DOWNLOAD, EXCLUDED, IN_LIBRARY", required = true)
    private String status; // MovieStatus 枚举字符串
}