package com.ason.movievault.service.genre.impl;

import com.ason.movievault.entity.Genre;
import com.ason.movievault.mapper.genre.GenreMapper;
import com.ason.movievault.service.genre.GenreService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 标签服务实现类
 */
@Service
public class GenreServiceImpl extends ServiceImpl<GenreMapper, Genre> implements GenreService {

    @Override
    public List<String> getAllTagNames(Long actorId) {
        // TODO: 若 actorId != null，需 join movie_actor + movie_genre 查询该演员的标签
        // 暂时返回所有标签名称
        return this.list().stream()
                .map(Genre::getName)
                .collect(Collectors.toList());
    }
}