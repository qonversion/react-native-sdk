package com.reactlibrary;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.module.annotations.ReactModule;
import io.qonversion.sandwich.NoCodesSandwich;
import io.qonversion.sandwich.NoCodesEventListener;

import java.util.HashMap;
import java.util.Map;

public class NoCodesModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final String EVENT_NOCODES = "NoCodesEvent";
    private final NoCodesSandwich noCodesSandwich;
    private final NoCodesEventListener noCodesEventListener;
    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;

    public NoCodesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.noCodesSandwich = new NoCodesSandwich();

        // Создаем делегат в конструкторе и сохраняем как поле класса
        this.noCodesEventListener = new NoCodesEventListener() {
            @Override
            public void onNoCodesEvent(@NonNull Event event, @Nullable Map<String, ?> map) {
                WritableMap params = Arguments.createMap();
                params.putString("type", event.name());
                if (map != null) {
                    params.putMap("payload", EntitiesConverter.convertMapToWritableMap(map));
                }
                sendEvent(EVENT_NOCODES, params);
            }
        };
    }

    @Override
    public void initialize() {
        super.initialize();
        eventEmitter = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    @NonNull
    @Override
    public String getName() {
        return "RNNoCodes";
    }

    @ReactMethod
    public void initialize(String projectKey) {
        noCodesSandwich.initialize(reactContext, projectKey, null, null, null);
        noCodesSandwich.setDelegate(noCodesEventListener);
        noCodesSandwich.setScreenCustomizationDelegate();
    }

    @ReactMethod
    public void setScreenPresentationConfig(ReadableMap configData, String contextKey, final Promise promise) {
        try {
            Map<String, Object> config = EntitiesConverter.convertReadableMapToHashMap(configData);
            noCodesSandwich.setScreenPresentationConfig(config, contextKey);
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", true);
            promise.resolve(response);
        } catch (Exception e) {
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", false);
            WritableMap errorMap = Arguments.createMap();
            errorMap.putString("code", "UNKNOWN_ERROR");
            errorMap.putString("message", e.getMessage());
            response.putMap("error", errorMap);
            promise.resolve(response);
        }
    }

    @ReactMethod
    public void showScreen(String contextKey, final Promise promise) {
        try {
            noCodesSandwich.showScreen(contextKey);
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", true);
            promise.resolve(response);
        } catch (Exception e) {
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", false);
            WritableMap errorMap = Arguments.createMap();
            errorMap.putString("code", "UNKNOWN_ERROR");
            errorMap.putString("message", e.getMessage());
            response.putMap("error", errorMap);
            promise.resolve(response);
        }
    }

    @ReactMethod
    public void close(final Promise promise) {
        try {
            noCodesSandwich.close();
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", true);
            promise.resolve(response);
        } catch (Exception e) {
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", false);
            WritableMap errorMap = Arguments.createMap();
            errorMap.putString("code", "UNKNOWN_ERROR");
            errorMap.putString("message", e.getMessage());
            response.putMap("error", errorMap);
            promise.resolve(response);
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        if (eventEmitter != null) {
            eventEmitter.emit(eventName, params);
        }
    }
} 