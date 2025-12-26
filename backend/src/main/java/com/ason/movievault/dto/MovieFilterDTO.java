package com.ason.movievault.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * 影片列表查询 DTO
 * 对应前端 mockService.getMovies() 的 filter 参数
 */
@Data
@Schema(description = "影片筛选条件 DTO")
public class MovieFilterDTO {

    @Schema(description = "模糊搜索：标题、番号、译名、导演、制作商、系列")
    private String searchTerm;

    @Schema(description = "模糊搜索：演员姓名（需关联查询）")
    private String searchActor;

    @Schema(description = "精确匹配：演员ID（用于演员详情页关联查询）")
    private Long actorId;

    @Schema(description = "模糊搜索：标签名称（需关联查询）")
    private String searchTag;

    @Schema(description = "状态筛选：PENDING, TO_DOWNLOAD, EXCLUDED, IN_LIBRARY")
    private String status;

    @Schema(description = "审查状态筛选：CENSORED, UNCENSORED")
    private String censorship;

    @Schema(description = "是否关联色花堂资源：true, false")
    private Boolean hasSehuatang;

    @Schema(description = "是否收藏：true, false")
    private Boolean isFavorite;

    @Schema(description = "是否在115：true, false")
    private Boolean in115;

    @Schema(description = "是否在NAS：true, false")
    private Boolean inNas;

    @Schema(description = "发行日期起始（包含）")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) // 接收 "yyyy-MM-dd" 格式
    @JsonFormat(pattern = "yyyy-MM-dd") // 返回 "yyyy-MM-dd" 格式
    private LocalDate startDate;

    @Schema(description = "发行日期结束（包含）")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
}