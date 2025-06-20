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
    private final NoCodesSandwich noCodesSandwich;
    private final NoCodesEventListener noCodesEventListener;
    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;

    public NoCodesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.noCodesSandwich = new NoCodesSandwich();

        this.noCodesEventListener = (event, payload) -> {
            WritableMap payloadMap = null;
            if (payload != null) {
                payloadMap = EntitiesConverter.convertMapToWritableMap(payload);
            }

            sendEvent(event.getKey(), payloadMap);
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
            Utils.resolveWithSuccess(promise);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void showScreen(String contextKey, final Promise promise) {
        try {
            noCodesSandwich.showScreen(contextKey);
            Utils.resolveWithSuccess(promise);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void close(final Promise promise) {
        try {
            noCodesSandwich.close();
            Utils.resolveWithSuccess(promise);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        if (eventEmitter != null) {
            eventEmitter.emit(eventName, params);
        }
    }
}
