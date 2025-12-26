package com.ason.movievault.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * 演员列表查询 DTO
 * 对应前端 mockService.getActors() 的 filter 参数
 */
@Data
@Schema(description = "演员筛选条件 DTO")
public class ActorFilterDTO {

    @Schema(description = "模糊搜索：演员姓名")
    private String searchTerm;

    @Schema(description = "状态筛选：ACTIVE, RETIRED")
    private String status;

    @Schema(description = "是否收藏：true, false")
    private Boolean isFavorite;

    @Schema(description = "出生日期起始（包含）")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startBirthDate;

    @Schema(description = "出生日期结束（包含）")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endBirthDate;
}