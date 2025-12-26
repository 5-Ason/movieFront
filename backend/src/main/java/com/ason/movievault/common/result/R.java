package com.ason.movievault.common.result;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class R<T> {
    private int code;
    private String msg;
    private T data;

    public static <T> R<T> success() {
        return new R<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), null);
    }

    public static <T> R<T> success(T data) {
        return new R<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMsg(), data);
    }

    public static <T> R<T> fail(String msg) {
        return new R<>(ResultCode.FAIL.getCode(), msg, null);
    }

    public static <T> R<T> fail(ResultCode code) {
        return new R<>(code.getCode(), code.getMsg(), null);
    }

    public static <T> R<T> paramError(String msg) {
        return new R<>(ResultCode.PARAM_ERROR.getCode(), msg, null);
    }

    public static <T> R<T> notFound() {
        return new R<>(ResultCode.NOT_FOUND.getCode(), ResultCode.NOT_FOUND.getMsg(), null);
    }

    public static <T> R<PageResult<T>> page(IPage<T> page) {
        return success(PageResult.of(page));
    }

    public static <T> R<PageResult<T>> emptyPage() {
        return success(PageResult.empty());
    }
}