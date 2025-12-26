package com.ason.movievault.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 影片状态枚举
 * 与数据库 movie.status 字段映射
 */
@Getter
public enum MovieStatus {
    /**
     * 待处理：刚抓取，未分类
     */
    PENDING("PENDING"),
    /**
     * 待下载：已标记需要下载
     */
    TO_DOWNLOAD("TO_DOWNLOAD"),
    /**
     * 已排除：不打算下载/已忽略
     */
    EXCLUDED("EXCLUDED"),
    /**
     * 已入库：已下载并归档
     */
    IN_LIBRARY("IN_LIBRARY");

    @EnumValue // MyBatis-Plus 枚举映射注解，用于自动转换数据库值
    @JsonValue // Jackson 序列化注解，返回 JSON 时转为字符串
    private final String value;

    MovieStatus(String value) {
        this.value = value;
    }

    /**
     * 根据字符串值获取枚举
     * @param value 数据库中的字符串值
     * @return 对应的枚举
     * @throws IllegalArgumentException 如果值无效
     */
    public static MovieStatus fromValue(String value) {
        for (MovieStatus s : values()) {
            if (s.value.equals(value)) return s;
        }
        throw new IllegalArgumentException("Invalid MovieStatus: " + value);
    }
}