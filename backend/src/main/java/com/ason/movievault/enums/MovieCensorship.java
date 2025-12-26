package com.ason.movievault.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 影片审查状态枚举
 * 与数据库 movie.censorship 字段映射
 */
@Getter
public enum MovieCensorship {
    /**
     * 有码
     */
    CENSORED("CENSORED"),
    /**
     * 无码
     */
    UNCENSORED("UNCENSORED");

    @EnumValue
    @JsonValue
    private final String value;

    MovieCensorship(String value) {
        this.value = value;
    }

    /**
     * 根据字符串值获取枚举
     * @param value 数据库中的字符串值
     * @return 对应的枚举
     * @throws IllegalArgumentException 如果值无效
     */
    public static MovieCensorship fromValue(String value) {
        for (MovieCensorship c : values()) {
            if (c.value.equals(value)) return c;
        }
        throw new IllegalArgumentException("Invalid MovieCensorship: " + value);
    }
}