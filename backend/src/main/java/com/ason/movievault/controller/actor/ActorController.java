// src/main/java/com/ason/movievault/controller/actor/ActorController.java
package com.ason.movievault.controller.actor;

import com.ason.movievault.common.result.PageResult;
import com.ason.movievault.common.result.R;
import com.ason.movievault.dto.*;
import com.ason.movievault.entity.Actor;
import com.ason.movievault.entity.Movie;
import com.ason.movievault.service.actor.ActorService;
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
 * 演员管理控制器
 * 对应前端 mockService 中的 getActors, getActorsByMovie, getMoviesByActor, toggleActorFavorite, updateActor 接口
 */
@RestController
@RequestMapping("/api/actors")
@Tag(name = "演员管理")
@RequiredArgsConstructor
public class ActorController {

    private final ActorService actorService;
    private final MovieService movieService;

    @Operation(summary = "分页查询演员")
    @GetMapping
    public R<PageResult<Actor>> list(
            // 修复：使用 long 类型
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "12") long size,
            ActorFilterDTO filter) {
        // 修复：创建 Page 对象时使用 long 类型参数
        Page<Actor> page = new Page<>(current, size);
        // 修复：调用 Service 方法
        IPage<Actor> result = actorService.pageWithFilter(page, filter);
        // 修复：返回 R<PageResult<T>>
        return R.page(result);
    }

    @Operation(summary = "批量获取演员")
    @GetMapping("/batch")
    public R<List<Actor>> batch(@RequestParam("ids") List<Long> ids) {
        return R.success(actorService.listByIds(ids));
    }

    @Operation(summary = "根据演员ID获取其参演影片")
    @GetMapping("/{id}/movies")
    public R<List<Movie>> getMoviesByActor(@PathVariable Long id) {
        return R.success(movieService.listByActorId(id));
    }

    @Operation(summary = "切换演员收藏状态")
    @PostMapping("/{id}/favorite")
    public R<Void> toggleFavorite(@PathVariable Long id, ToggleFavoriteDTO dto) {
        actorService.toggleFavorite(id);
        return R.success();
    }

    @Operation(summary = "更新演员信息")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody ActorUpdateDTO dto) {
        actorService.updateActor(id, dto);
        return R.success();
    }
}