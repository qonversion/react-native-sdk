package com.reactlibrary;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;

import java.util.Map;

import io.qonversion.sandwich.AutomationsEventListener;
import io.qonversion.sandwich.AutomationsSandwich;

class AutomationsModule extends ReactContextBaseJavaModule implements AutomationsEventListener {

    private final AutomationsSandwich automationsSandwich;

    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;

    public AutomationsModule(ReactApplicationContext reactContext) {
        super(reactContext);

        automationsSandwich = new AutomationsSandwich();
    }

    @Override
    public void initialize() {
        super.initialize();

        eventEmitter = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    @NonNull
    @Override
    public String getName() {
        return "RNAutomations";
    }

    @ReactMethod
    void initializeSdk() {
        automationsSandwich.initialize();
    }

    @ReactMethod
    void subscribe() {
        automationsSandwich.setDelegate(this);
    }

    @ReactMethod
    public void setNotificationsToken(String token) {
        automationsSandwich.setNotificationToken(token);
    }

    @ReactMethod
    public void getNotificationCustomPayload(final ReadableMap notificationData, final Promise promise) {
        if (notificationData == null) {
            promise.resolve(null);
            return;
        }

        final Map<String, Object> dataMap;
        try {
            dataMap = EntitiesConverter.convertReadableMapToHashMap(notificationData);
        } catch (JSONException e) {
            promise.reject(e);
            return;
        }

        final Map<String, Object> payload = automationsSandwich.getNotificationCustomPayload(dataMap);
        if (payload == null) {
            promise.resolve(null);
        } else {
            final WritableMap convertedPayload = EntitiesConverter.convertMapToWritableMap(payload);

            promise.resolve(convertedPayload);
        }
    }

    @ReactMethod
    public void handleNotification(final ReadableMap notificationData, final Promise promise) {
        if (notificationData == null) {
            promise.resolve(false);
            return;
        }

        final Map<String, Object> dataMap;
        try {
            dataMap = EntitiesConverter.convertReadableMapToHashMap(notificationData);
        } catch (JSONException e) {
            promise.resolve(false);
            return;
        }

        final boolean isQonversionNotification = automationsSandwich.handleNotification(dataMap);
        promise.resolve(isQonversionNotification);
    }

    @Override
    public void onAutomationEvent(@NonNull AutomationsEventListener.Event event, @Nullable Map<String, ?> payload) {
        WritableMap payloadMap = null;
        if (payload != null) {
            payloadMap = EntitiesConverter.convertMapToWritableMap(payload);
        }
        if (eventEmitter != null) {
            eventEmitter.emit(event.getKey(), payloadMap);
        }
    }
}
