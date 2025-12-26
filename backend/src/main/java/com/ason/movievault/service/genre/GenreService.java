package com.ason.movievault.service.genre;

import com.ason.movievault.entity.Genre;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 标签服务接口
 */
public interface GenreService extends IService<Genre> {

    /**
     * 获取所有标签名称列表
     * @param actorId 演员ID（可选，为 null 时返回全部，否则返回该演员参演影片的标签）
     * @return 标签名称列表
     */
    List<String> getAllTagNames(Long actorId);
}