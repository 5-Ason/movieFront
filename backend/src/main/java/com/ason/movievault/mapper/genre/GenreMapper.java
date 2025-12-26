package com.ason.movievault.mapper.genre;
import com.ason.movievault.entity.Genre;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 标签 Mapper 接口
 */
@Mapper
public interface GenreMapper extends BaseMapper<Genre> {
}