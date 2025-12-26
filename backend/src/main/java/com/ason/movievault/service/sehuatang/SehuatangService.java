package com.ason.movievault.service.sehuatang;

import com.ason.movievault.dto.SehuatangFilterDTO;
import com.ason.movievault.entity.SehuatangData;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * 色花堂数据服务接口
 */
public interface SehuatangService extends IService<SehuatangData> {

    /**
     * 分页查询色花堂数据（含筛选条件）
     * @param page 分页对象
     * @param filter 筛选条件 DTO
     * @return 分页结果
     */
    IPage<SehuatangData> pageWithFilter(Page<SehuatangData> page, SehuatangFilterDTO filter);

    /**
     * 切换忽略状态
     * @param id 数据ID
     */
    void toggleIgnore(Long id);

    /**
     * 获取所有大类别列表
     * @return 类别名称列表
     */
    List<String> getAllCategories();

    /**
     * 根据大类别获取子类别列表
     * @param category 大类别名称
     * @return 子类别名称列表
     */
    List<String> getSubCategoriesByCategory(String category);
}
