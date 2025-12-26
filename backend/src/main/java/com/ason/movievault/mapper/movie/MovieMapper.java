package com.ason.movievault.mapper.movie;

import com.ason.movievault.entity.Movie;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 影片 Mapper 接口
 */
@Mapper
public interface MovieMapper extends BaseMapper<Movie> {
}