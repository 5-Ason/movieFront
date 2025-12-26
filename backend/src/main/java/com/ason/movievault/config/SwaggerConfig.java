package com.ason.movievault.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger API 文档配置
 * 配置 API 基本信息，如标题、描述、版本、联系人等
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MovieVault API")
                        .description("电影资源管理平台 API 接口文档")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Ason")
                                .email("ason@example.com") // 请替换为实际邮箱
                        )
                );
    }
}