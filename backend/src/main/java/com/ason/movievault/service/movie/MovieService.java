package com.ason.movievault.service.movie;

import com.ason.movievault.dto.MovieFilterDTO;
import com.ason.movievault.entity.Movie;
import com.ason.movievault.enums.MovieStatus;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 影片服务接口
 */
public interface MovieService extends IService<Movie> {

    /**
     * 分页查询影片（含筛选条件）
     * @param page 分页对象
     * @param filter 筛选条件 DTO
     * @return 分页结果
     */
    IPage<Movie> pageWithFilter(Page<Movie> page, MovieFilterDTO filter);

    /**
     * 更新影片状态
     * @param id 影片ID
     * @param status 新状态
     */
    void updateStatus(Long id, MovieStatus status);

    /**
     * 切换影片收藏状态
     * @param id 影片ID
     */
    void toggleFavorite(Long id);

    /**
     * 根据演员ID查询其参演的影片列表
     * @param actorId 演员ID
     * @return 影片列表
     */
    List<Movie> listByActorId(Long actorId);
}