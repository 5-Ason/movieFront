package com.ason.movievault.service.sehuatang.impl;
import com.ason.movievault.dto.SehuatangFilterDTO;
import com.ason.movievault.entity.SehuatangData;
import com.ason.movievault.mapper.sehuatang.SehuatangDataMapper;
import com.ason.movievault.service.sehuatang.SehuatangService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 色花堂数据服务实现类
 */
@Service
public class SehuatangServiceImpl extends ServiceImpl<SehuatangDataMapper, SehuatangData> implements SehuatangService {

    @Override
    public IPage<SehuatangData> pageWithFilter(Page<SehuatangData> page, SehuatangFilterDTO filter) {
        LambdaQueryWrapper<SehuatangData> qw = new LambdaQueryWrapper<>();

        // 布尔字段筛选
        if (filter.getHasSubtitles() != null) qw.eq(SehuatangData::getHasSubtitles, filter.getHasSubtitles());
        if (filter.getIsVr() != null) qw.eq(SehuatangData::getIsVr, filter.getIsVr());
        if (filter.getHasMosaic() != null) qw.eq(SehuatangData::getHasMosaic, filter.getHasMosaic());
        if (filter.getIn115() != null) qw.eq(SehuatangData::getIn115, filter.getIn115());
        if (filter.getInNas() != null) qw.eq(SehuatangData::getInNas, filter.getInNas());
        if (filter.getIsIgnored() != null) qw.eq(SehuatangData::getIsIgnored, filter.getIsIgnored());
        if (filter.getIsMultiActor() != null) qw.eq(SehuatangData::getIsMultiActor, filter.getIsMultiActor());
        if (filter.getIsFavoriteActor() != null) qw.eq(SehuatangData::getIsActorFavorite, filter.getIsFavoriteActor());

        // 日期范围筛选
        if (filter.getStartDate() != null) qw.ge(SehuatangData::getReleaseDate, filter.getStartDate());
        if (filter.getEndDate() != null) qw.le(SehuatangData::getReleaseDate, filter.getEndDate());

        // 模糊搜索
        if (StringUtils.hasText(filter.getSearchText())) {
            String term = "%" + filter.getSearchText() + "%";
            qw.and(w -> w.like(SehuatangData::getTitle, term).or().like(SehuatangData::getCode, term));
        }
        if (StringUtils.hasText(filter.getSearchActor())) {
            String term = "%" + filter.getSearchActor() + "%";
            qw.like(SehuatangData::getActresses, term);
        }

        // 分类筛选
        if (StringUtils.hasText(filter.getCategory())) qw.eq(SehuatangData::getCategory, filter.getCategory());
        if (StringUtils.hasText(filter.getSubCategory())) qw.eq(SehuatangData::getSubCategory, filter.getSubCategory());

        return this.page(page, qw);
    }

    @Override
    public void toggleIgnore(Long id) {
        // TODO: 补充业务逻辑（如记录操作人、时间等）
        SehuatangData data = this.getById(id);
        if (data != null) {
            data.setIsIgnored(!data.getIsIgnored());
            this.updateById(data);
        }
    }

    @Override
    public List<String> getAllCategories() {
        return this.list().stream()
                .map(SehuatangData::getCategory)
                .filter(StringUtils::hasText)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getSubCategoriesByCategory(String category) {
        return this.lambdaQuery()
                .eq(SehuatangData::getCategory, category)
                .list()
                .stream()
                .map(SehuatangData::getSubCategory)
                .filter(StringUtils::hasText)
                .distinct()
                .collect(Collectors.toList());
    }
}