// src/main/java/com/ason/movievault/controller/sehuatang/SehuatangController.java
package com.ason.movievault.controller.sehuatang;

import com.ason.movievault.common.result.PageResult;
import com.ason.movievault.common.result.R;
import com.ason.movievault.dto.SehuatangFilterDTO;
import com.ason.movievault.dto.ToggleFavoriteDTO;
import com.ason.movievault.entity.SehuatangData;
import com.ason.movievault.service.sehuatang.SehuatangService;
import com.baomidou.mybatisplus.core.metadata.IPage;
// 导入正确的 MyBatis-Plus Page 类
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 色花堂数据管理控制器
 * 对应前端 mockService 中的 getSehuatangData, toggleSehuatangIgnore, getSehuatangCategories, getSehuatangSubCategories 接口
 */
@RestController
@RequestMapping("/api/sehuatang")
@Tag(name = "色花堂数据")
@RequiredArgsConstructor
public class SehuatangController {

    private final SehuatangService sehuatangService;

    @Operation(summary = "分页查询色花堂数据")
    @GetMapping
    public R<PageResult<SehuatangData>> list(
            // 修复：使用 long 类型
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "12") long size,
            SehuatangFilterDTO filter) {
        // 修复：创建 Page 对象时使用 long 类型参数
        Page<SehuatangData> page = new Page<>(current, size);
        // 修复：调用 Service 方法
        IPage<SehuatangData> result = sehuatangService.pageWithFilter(page, filter);
        // 修复：返回 R<PageResult<T>>
        return R.page(result);
    }

    @Operation(summary = "切换忽略状态")
    @PostMapping("/{id}/ignore")
    public R<Void> toggleIgnore(@PathVariable Long id, ToggleFavoriteDTO dto) {
        sehuatangService.toggleIgnore(id);
        return R.success();
    }

    @Operation(summary = "获取所有大类别")
    @GetMapping("/categories")
    public R<List<String>> getCategories() {
        return R.success(sehuatangService.getAllCategories());
    }

    @Operation(summary = "根据大类别获取子类别")
    @GetMapping("/subcategories")
    public R<List<String>> getSubCategories(@RequestParam String category) {
        return R.success(sehuatangService.getSubCategoriesByCategory(category));
    }
}