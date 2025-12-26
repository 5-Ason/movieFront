// src/main/java/com/ason/movievault/common/result/PageResult.java
package com.ason.movievault.common.result;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

/**
 * 分页结果封装，适配前端表格组件（如 Ant Design Table）
 */
@Data
@NoArgsConstructor
public class PageResult<T> {
    /**
     * 当前页码（从 1 开始）
     */
    private long current;

    /**
     * 每页大小
     */
    private long size;

    /**
     * 总记录数
     */
    private long total;

    /**
     * 总页数
     */
    private long pages;

    /**
     * 数据列表
     */
    private List<T> records;

    public PageResult(long current, long size, long total, List<T> records) {
        this.current = current;
        this.size = size;
        this.total = total;
        this.pages = size > 0 ? (total + size - 1) / size : 0; // 向上取整
        this.records = records != null ? records : Collections.emptyList();
    }

    /**
     * 从 MyBatis-Plus IPage 构造 PageResult
     */
    public static <T> PageResult<T> of(IPage<T> page) {
        return new PageResult<>(
                page.getCurrent(),
                page.getSize(),
                page.getTotal(),
                page.getRecords()
        );
    }

    /**
     * 空分页（用于无数据场景）
     */
    public static <T> PageResult<T> empty() {
        return new PageResult<>(1, 10, 0, Collections.emptyList());
    }
}