package com.ason.movievault.service.movie.impl;

import com.ason.movievault.entity.MovieActor;
import com.ason.movievault.mapper.movie.MovieActorMapper;
import com.ason.movievault.service.movie.MovieActorService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 影片演员关联表 服务实现类
 * </p>
 *
 * @author ason
 * @since 2025-12-03
 */
@Service
public class MovieActorServiceImpl extends ServiceImpl<MovieActorMapper, MovieActor> implements MovieActorService {

}
