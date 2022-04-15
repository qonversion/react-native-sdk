package com.reactlibrary;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

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

    @Override
    public String getName() {
        return "RNAutomations";
    }

    @ReactMethod
    void subscribe() {
        automationsSandwich.subscribe(this);
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
