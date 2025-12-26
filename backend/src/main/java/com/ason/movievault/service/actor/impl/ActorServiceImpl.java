package com.ason.movievault.service.actor.impl;

import com.ason.movievault.dto.ActorFilterDTO;
import com.ason.movievault.entity.Actor;
import com.ason.movievault.mapper.actor.ActorMapper;
import com.ason.movievault.service.actor.ActorService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 演员服务实现类
 */
@Service
public class ActorServiceImpl extends ServiceImpl<ActorMapper, Actor> implements ActorService {

    @Override
    public IPage<Actor> pageWithFilter(Page<Actor> page, ActorFilterDTO filter) {
        LambdaQueryWrapper<Actor> qw = new LambdaQueryWrapper<>();

        // 枚举字段筛选
        if (StringUtils.hasText(filter.getStatus())) {
            qw.eq(Actor::getStatus, filter.getStatus());
        }
        // 布尔字段筛选
        if (filter.getIsFavorite() != null) {
            qw.eq(Actor::getIsFavorite, filter.getIsFavorite());
        }
        // 日期范围筛选
        if (filter.getStartBirthDate() != null) {
            qw.ge(Actor::getBirthDate, filter.getStartBirthDate());
        }
        if (filter.getEndBirthDate() != null) {
            qw.le(Actor::getBirthDate, filter.getEndBirthDate());
        }

        // 模糊搜索
        if (StringUtils.hasText(filter.getSearchTerm())) {
            String term = "%" + filter.getSearchTerm() + "%";
            qw.like(Actor::getName, term);
        }

        return this.page(page, qw);
    }

    @Override
    public void toggleFavorite(Long id) {
        // TODO: 补充业务逻辑（如更新缓存、发送消息等）
        Actor actor = this.getById(id);
        if (actor != null) {
            actor.setIsFavorite(!actor.getIsFavorite());
            this.updateById(actor);
        }
    }

    @Override
    public void updateActor(Long id, com.ason.movievault.dto.ActorUpdateDTO dto) {
        // TODO: 补充业务逻辑（如验证、记录历史等）
        Actor actor = new Actor();
        actor.setId(id);
        actor.setStatus(dto.getStatus());
        actor.setBirthDate(dto.getBirthDate());
        actor.setProfile(dto.getProfile());
        this.updateById(actor);
    }

    @Override
    public List<Actor> listByIds(List<Long> ids) {
        return this.listByIds(ids);
    }
}