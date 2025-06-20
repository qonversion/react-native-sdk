package com.reactlibrary;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Map;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import io.qonversion.sandwich.ResultListener;
import io.qonversion.sandwich.SandwichError;

public class Utils {
    static ResultListener getResultListener(final Promise promise) {
        return new ResultListener() {
            @Override
            public void onSuccess(@NonNull Map<String, ?> map) {
                final WritableMap payload = EntitiesConverter.convertMapToWritableMap(map);
                promise.resolve(payload);
            }

            @Override
            public void onError(@NonNull SandwichError error) {
                rejectWithError(error, promise);
            }
        };
    }

    static void resolveWithSuccess(final Promise promise) {
        WritableMap response = Arguments.createMap();
        response.putBoolean("success", true);
        promise.resolve(response);
    }

    static void rejectWithError(@NonNull SandwichError sandwichError, final Promise promise) {
        rejectWithError(sandwichError, promise, null);
    }

    static void rejectWithError(@NonNull SandwichError sandwichError, final Promise promise, @Nullable String customErrorCode) {
        String errorMessage = sandwichError.getDescription() + "\n" + sandwichError.getAdditionalMessage();
        String errorCode = customErrorCode == null ? sandwichError.getCode() : customErrorCode;
        promise.reject(errorCode, errorMessage);
    }
}
