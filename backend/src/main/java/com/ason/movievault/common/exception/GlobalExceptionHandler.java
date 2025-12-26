package com.ason.movievault.common.exception;

import com.ason.movievault.common.result.R;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public R<String> handleException(Exception e) {
        log.error("【系统异常】", e);
        return R.fail("服务器内部错误，请联系管理员");
    }

    @ExceptionHandler(BindException.class)
    public R<String> handleBindException(BindException e) {
        List<FieldError> errors = e.getBindingResult().getFieldErrors();
        String msg = !errors.isEmpty() ? errors.get(0).getDefaultMessage() : "参数绑定失败";
        return R.paramError(msg);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public R<String> handleValidationException(MethodArgumentNotValidException e) {
        List<FieldError> errors = e.getBindingResult().getFieldErrors();
        String msg = !errors.isEmpty() ? errors.get(0).getDefaultMessage() : "参数校验失败";
        return R.paramError(msg);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public R<String> handleConstraintViolationException(ConstraintViolationException e) {
        ConstraintViolation<?> violation = e.getConstraintViolations().iterator().next();
        String msg = violation.getMessage();
        return R.paramError(msg);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public R<String> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        return R.paramError("请求体格式错误（如 JSON 格式不对）");
    }

    // 可扩展自定义业务异常
    // @ExceptionHandler(ServiceException.class)
    // public R<String> handleServiceException(ServiceException e) {
    //     return R.fail(e.getMessage());
    // }
}