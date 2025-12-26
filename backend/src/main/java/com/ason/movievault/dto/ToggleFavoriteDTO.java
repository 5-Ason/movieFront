package com.ason.movievault.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 切换收藏状态 DTO
 * 用于 POST /api/movies/{id}/favorite, POST /api/actors/{id}/favorite 等
 * 仅用于占位，实际请求体为空或无参数
 */
@Data
@Schema(description = "切换收藏状态 DTO（空）")
public class ToggleFavoriteDTO {
    // 空 DTO，仅用于占位（实际用路径参数）
}