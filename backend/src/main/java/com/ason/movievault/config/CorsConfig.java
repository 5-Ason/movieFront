package com.ason.movievault.config;// CorsConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 关键：指定确切的前端 URL
        config.setAllowedOriginPatterns(Arrays.asList(
                "https://4dom2gs3lyygalx9d2bwwbus7mhs9kwbsf2042qb4d38cu9vx4-h839267052.scf.usercontent.goog" // 你的前端 URL
                // "http://localhost:3000", // 如果你本地运行前端，也可以加上
                // "http://localhost:5173", // 如果你本地运行前端，也可以加上
                // ... 其他需要允许的来源
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        // 如果前端需要携带认证信息（如 cookie、Authorization header），则设为 true
        // 否则可以为 false
        config.setAllowCredentials(true); // 根据实际情况设置，如果设为 true，AllowedOrigins 不能为 "*"

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}