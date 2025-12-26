package com.ason.movievault.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 演员状态枚举
 * 与数据库 actor.status 字段映射
 */
@Getter
public enum ActorStatus {
    /**
     * 活跃：仍在活动
     */
    ACTIVE("ACTIVE"),
    /**
     * 退役：已引退
     */
    RETIRED("RETIRED");

    @EnumValue
    @JsonValue
    private final String value;

    ActorStatus(String value) {
        this.value = value;
    }

    /**
     * 根据字符串值获取枚举
     * @param value 数据库中的字符串值
     * @return 对应的枚举
     * @throws IllegalArgumentException 如果值无效
     */
    public static ActorStatus fromValue(String value) {
        for (ActorStatus s : values()) {
            if (s.value.equals(value)) return s;
        }
        throw new IllegalArgumentException("Invalid ActorStatus: " + value);
    }
}