package com.qonversion.reactnative;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.qonversion.nocodes.NoCodes;
import com.qonversion.nocodes.NoCodesCallback;
import com.qonversion.nocodes.NoCodesError;
import com.qonversion.nocodes.NoCodesResult;

import java.util.HashMap;
import java.util.Map;

public class RNNoCodes extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final String EVENT_NOCODES = "NoCodesEvent";

    public RNNoCodes(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "RNNoCodes";
    }

    @ReactMethod
    public void initialize(String projectKey) {
        NoCodes.initialize(projectKey);
    }

    @ReactMethod
    public void setScreenPresentationConfig(ReadableMap configData, String contextKey, final Promise promise) {
        Map<String, Object> config = configData.toHashMap();
        NoCodes.setScreenPresentationConfig(config, contextKey, new NoCodesCallback<NoCodesResult>() {
            @Override
            public void onSuccess(NoCodesResult result) {
                WritableMap response = Arguments.createMap();
                response.putBoolean("success", true);
                response.putMap("data", Arguments.fromMap(result.getData()));
                promise.resolve(response);
            }

            @Override
            public void onError(NoCodesError error) {
                WritableMap response = Arguments.createMap();
                response.putBoolean("success", false);
                WritableMap errorMap = Arguments.createMap();
                errorMap.putString("code", error.getCode());
                errorMap.putString("message", error.getMessage());
                response.putMap("error", errorMap);
                promise.resolve(response);
            }
        });
    }

    @ReactMethod
    public void showScreen(String contextKey, final Promise promise) {
        NoCodes.showScreen(contextKey, new NoCodesCallback<NoCodesResult>() {
            @Override
            public void onSuccess(NoCodesResult result) {
                WritableMap response = Arguments.createMap();
                response.putBoolean("success", true);
                response.putMap("data", Arguments.fromMap(result.getData()));
                promise.resolve(response);
            }

            @Override
            public void onError(NoCodesError error) {
                WritableMap response = Arguments.createMap();
                response.putBoolean("success", false);
                WritableMap errorMap = Arguments.createMap();
                errorMap.putString("code", error.getCode());
                errorMap.putString("message", error.getMessage());
                response.putMap("error", errorMap);
                promise.resolve(response);
            }
        });
    }

    @ReactMethod
    public void close(final Promise promise) {
        NoCodes.close(new NoCodesCallback<NoCodesResult>() {
            @Override
            public void onSuccess(NoCodesResult result) {
                WritableMap response = Arguments.createMap();
                response.putBoolean("success", true);
                response.putMap("data", Arguments.fromMap(result.getData()));
                promise.resolve(response);
            }

            @Override
            public void onError(NoCodesError error) {
                WritableMap response = Arguments.createMap();
                response.putBoolean("success", false);
                WritableMap errorMap = Arguments.createMap();
                errorMap.putString("code", error.getCode());
                errorMap.putString("message", error.getMessage());
                response.putMap("error", errorMap);
                promise.resolve(response);
            }
        });
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
} 