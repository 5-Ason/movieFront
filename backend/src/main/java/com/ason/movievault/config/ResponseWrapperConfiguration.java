// src/main/java/com/ason/movievault/config/ResponseWrapperConfiguration.java
package com.ason.movievault.config;

import com.ason.movievault.common.result.PageResult;
import com.ason.movievault.common.result.R;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * 全局响应包装：
 * - 自动将 Controller 中返回的 IPage<T> 包装为 R<PageResult<T>>
 */
@RestControllerAdvice(basePackages = "com.ason.movievault.controller")
public class ResponseWrapperConfiguration implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType,
                            Class<? extends HttpMessageConverter<?>> converterType) {
        // 仅处理非 R<?> 类型的返回值（避免二次包装）
        return !R.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        // 若返回值是 IPage，自动包装为 R<PageResult>
        if (body instanceof IPage) {
            IPage<?> page = (IPage<?>) body;
            return R.success(PageResult.of(page));
        }

        // 其他类型直接原样返回（由 R 统一封装）
        return body;
    }
}