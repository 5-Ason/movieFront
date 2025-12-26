// src/main/java/com/ason/movievault/controller/movie/MovieController.java
package com.ason.movievault.controller.movie;

import com.ason.movievault.common.result.PageResult;
import com.ason.movievault.common.result.R;
import com.ason.movievault.dto.*;
import com.ason.movievault.entity.Movie;
import com.ason.movievault.service.movie.MovieService;
import com.baomidou.mybatisplus.core.metadata.IPage;
// 导入正确的 MyBatis-Plus Page 类
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 影片管理控制器
 * 对应前端 mockService 中的 getMovies, getMovieById, updateMovieStatus, toggleMovieFavorite, getTags 接口
 */
@RestController
@RequestMapping("/api/movies")
@Tag(name = "影片管理")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @Operation(summary = "分页查询影片")
    @GetMapping
    public R<PageResult<Movie>> list(
            // 使用 long 类型，与 MyBatis-Plus Page 构造函数参数类型匹配
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "12") long size,
            MovieFilterDTO filter) {

        // 创建 MyBatis-Plus 的 Page 对象，使用 long 类型参数
        Page<Movie> page = new Page<>(current, size);
        // 调用 Service 方法，传入正确的 Page 类型
        IPage<Movie> result = movieService.pageWithFilter(page, filter);
        // 使用 R.page 方法将 IPage 转换为 R<PageResult<Movie>>
        return R.page(result);
    }

    @Operation(summary = "根据ID查询影片")
    @GetMapping("/{id}")
    public R<Movie> getById(@PathVariable Long id) {
        return R.success(movieService.getById(id));
    }

    @Operation(summary = "更新影片状态")
    @PutMapping("/{id}/status")
    public R<Void> updateStatus(@PathVariable Long id, MovieUpdateStatusDTO dto) {
        movieService.updateStatus(id, com.ason.movievault.enums.MovieStatus.valueOf(dto.getStatus()));
        return R.success();
    }

    @Operation(summary = "切换影片收藏状态")
    @PostMapping("/{id}/favorite")
    public R<Void> toggleFavorite(@PathVariable Long id, ToggleFavoriteDTO dto) {
        movieService.toggleFavorite(id);
        return R.success();
    }

    // 以下为前端 mockService 中定义的接口
    @Operation(summary = "获取所有影片标签")
    @GetMapping("/tags")
    public R<List<String>> getTags(@RequestParam(required = false) Long actorId) {
        // TODO: 调用 genreService.getAllTagNames(actorId)
        return R.success(java.util.Collections.emptyList());
    }
}