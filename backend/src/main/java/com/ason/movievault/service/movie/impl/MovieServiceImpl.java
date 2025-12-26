package com.ason.movievault.service.movie.impl;

import com.ason.movievault.dto.MovieFilterDTO;
import com.ason.movievault.entity.Movie;
import com.ason.movievault.enums.MovieStatus;
import com.ason.movievault.mapper.movie.MovieMapper;
import com.ason.movievault.service.movie.MovieService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 影片服务实现类
 */
@Service
public class MovieServiceImpl extends ServiceImpl<MovieMapper, Movie> implements MovieService {

    @Override
    public IPage<Movie> pageWithFilter(Page<Movie> page, MovieFilterDTO filter) {
        LambdaQueryWrapper<Movie> qw = new LambdaQueryWrapper<>();

        // 日期范围筛选
        if (filter.getStartDate() != null) {
            qw.ge(Movie::getReleaseDate, filter.getStartDate());
        }
        if (filter.getEndDate() != null) {
            qw.le(Movie::getReleaseDate, filter.getEndDate());
        }

        // 枚举字段筛选
        if (StringUtils.hasText(filter.getStatus())) {
            qw.eq(Movie::getStatus, filter.getStatus());
        }
        if (StringUtils.hasText(filter.getCensorship())) {
            qw.eq(Movie::getCensorship, filter.getCensorship());
        }

        // 布尔字段筛选
        if (filter.getIsFavorite() != null) {
            qw.eq(Movie::getIsFavorite, filter.getIsFavorite());
        }
        if (filter.getIn115() != null) {
            qw.eq(Movie::getHas115, filter.getIn115());
        }
        if (filter.getInNas() != null) {
            qw.eq(Movie::getHasNas, filter.getInNas());
        }

        // 模糊搜索
        if (StringUtils.hasText(filter.getSearchTerm())) {
            String term = "%" + filter.getSearchTerm() + "%";
            qw.and(w -> w.like(Movie::getTitle, term)
                    .or().like(Movie::getCode, term)
                    .or().like(Movie::getTranslatedTitle, term));
        }

        // TODO: 演员搜索（需 join movie_actor 表）
        // TODO: 标签搜索（需 join movie_genre 表）

        return this.page(page, qw);
    }

    @Override
    public void updateStatus(Long id, MovieStatus status) {
        // TODO: 补充业务逻辑（如更新时间、记录日志、触发下载等）
        Movie movie = new Movie();
        movie.setId(id);
        movie.setStatus(status);
        this.updateById(movie);
    }

    @Override
    public void toggleFavorite(Long id) {
        // TODO: 补充业务逻辑（如更新缓存、发送消息等）
        Movie movie = this.getById(id);
        if (movie != null) {
            movie.setIsFavorite(!movie.getIsFavorite());
            this.updateById(movie);
        }
    }

    @Override
    public List<Movie> listByActorId(Long actorId) {
        // TODO: 需自定义 SQL join movie_actor 表查询
        // 示例 SQL: SELECT m.* FROM movie m JOIN movie_actor ma ON m.id = ma.movie_id WHERE ma.actor_id = ?
        // 暂时返回空列表
        return java.util.Collections.emptyList();
    }
}