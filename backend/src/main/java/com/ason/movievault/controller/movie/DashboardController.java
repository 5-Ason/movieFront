package com.ason.movievault.controller.movie;

import com.ason.movievault.common.result.R;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 仪表盘控制器
 * 对应前端 mockService 中的 getDashboardStats 接口
 */
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "仪表盘")
public class DashboardController {

    /**
     * 仪表盘统计 DTO
     */
    @Data
    public static class DashboardStats {
        private long totalMovies;
        private long statusPending;
        private long statusToDownload;
        private long statusExcluded;
        private long statusInLibrary;
        private long storage115;
        private long storageNas;
        private long totalActors;
        private long activeActors;
        private long retiredActors;
        private long censoredMovies;
        private long uncensoredMovies;
    }

    @Operation(summary = "获取仪表盘统计")
    @GetMapping("/stats")
    public R<DashboardStats> getStats() {
        // TODO: 补充真实统计逻辑（count + group by）
        DashboardStats stats = new DashboardStats();
        stats.setTotalMovies(150L);
        stats.setStatusInLibrary(90L);
        stats.setTotalActors(50L);
        return R.success(stats);
    }
}