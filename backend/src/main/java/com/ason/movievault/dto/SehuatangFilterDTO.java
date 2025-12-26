package com.ason.movievault.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * 色花堂数据列表查询 DTO
 * 对应前端 mockService.getSehuatangData() 的 filter 参数
 */
@Data
@Schema(description = "色花堂数据筛选条件 DTO")
public class SehuatangFilterDTO {

    @Schema(description = "模糊搜索：标题、番号")
    private String searchText;

    @Schema(description = "模糊搜索：出演女优")
    private String searchActor;

    @Schema(description = "大类别")
    private String category;

    @Schema(description = "子类别")
    private String subCategory;

    @Schema(description = "是否中字：true, false")
    private Boolean hasSubtitles;

    @Schema(description = "是否VR：true, false")
    private Boolean isVr;

    @Schema(description = "是否有码：true, false")
    private Boolean hasMosaic;

    @Schema(description = "是否已下115：true, false")
    private Boolean in115;

    @Schema(description = "是否已下NAS：true, false")
    private Boolean inNas;

    @Schema(description = "是否已忽略：true, false")
    private Boolean isIgnored;

    @Schema(description = "是否多人共演：true, false")
    private Boolean isMultiActor;

    @Schema(description = "是否为收藏女优：true, false")
    private Boolean isFavoriteActor;

    @Schema(description = "分享日期起始（包含）")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @Schema(description = "分享日期结束（包含）")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
}