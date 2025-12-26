package com.ason.movievault.service.movie.impl;

import com.ason.movievault.entity.MovieGenre;
import com.ason.movievault.mapper.movie.MovieGenreMapper;
import com.ason.movievault.service.movie.MovieGenreService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 影片类别关联表 服务实现类
 * </p>
 *
 * @author ason
 * @since 2025-12-03
 */
@Service
public class MovieGenreServiceImpl extends ServiceImpl<MovieGenreMapper, MovieGenre> implements MovieGenreService {

}
