package com.ason.movievault.service.actor;

import com.ason.movievault.dto.ActorFilterDTO;
import com.ason.movievault.entity.Actor;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 演员服务接口
 */
public interface ActorService extends IService<Actor> {

    /**
     * 分页查询演员（含筛选条件）
     * @param page 分页对象
     * @param filter 筛选条件 DTO
     * @return 分页结果
     */
    IPage<Actor> pageWithFilter(Page<Actor> page, ActorFilterDTO filter);

    /**
     * 切换演员收藏状态
     * @param id 演员ID
     */
    void toggleFavorite(Long id);

    /**
     * 更新演员信息
     * @param id 演员ID
     * @param dto 更新信息 DTO
     */
    void updateActor(Long id, com.ason.movievault.dto.ActorUpdateDTO dto);

    /**
     * 根据ID列表批量查询演员
     * @param ids 演员ID列表
     * @return 演员列表
     */
    List<Actor> listByIds(List<Long> ids);
}