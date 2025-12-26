// src/main/java/com/ason/movievault/MovieVaultApplication.java
package com.ason.movievault;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ason.movievault.mapper") // ✅ 包路径已更新
public class MovieVaultApplication {
    public static void main(String[] args) {
        SpringApplication.run(MovieVaultApplication.class, args);
    }
}