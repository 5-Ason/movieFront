package com.ason.movievault.dto;

import com.ason.movievault.enums.ActorStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * 更新演员信息 DTO
 * 用于 PUT /api/actors/{id}
 */
@Data
@Schema(description = "更新演员信息 DTO")
public class ActorUpdateDTO {

    @Schema(description = "新状态：ACTIVE, RETIRED")
    private ActorStatus status;

    @Schema(description = "出生日期")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDate;

    @Schema(description = "演员资料/简介")
    private String profile;
}