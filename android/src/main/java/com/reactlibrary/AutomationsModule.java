package com.reactlibrary;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.qonversion.android.sdk.automations.Automations;
import com.qonversion.android.sdk.automations.AutomationsDelegate;
import com.qonversion.android.sdk.automations.QActionResult;

class AutomationsModule extends ReactContextBaseJavaModule {
    private static final String EVENT_SCREEN_SHOWN = "automations_screen_shown";
    private static final String EVENT_ACTION_STARTED = "automations_action_started";
    private static final String EVENT_ACTION_FAILED = "automations_action_failed";
    private static final String EVENT_ACTION_FINISHED = "automations_action_finished";
    private static final String EVENT_AUTOMATIONS_FINISHED = "automations_finished";

    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;
    private AutomationsDelegate automationsDelegate = null;

    public AutomationsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RNAutomations";
    }

    @ReactMethod
    void subscribe() {
        if (automationsDelegate != null) {
            return;
        }

        this.eventEmitter = getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);

        automationsDelegate = createAutomationsDelegate();
        Automations.setDelegate(automationsDelegate);
    }

    private AutomationsDelegate createAutomationsDelegate() {
        return new AutomationsDelegate() {
            @Override
            public void automationsDidShowScreen(@NonNull String screenId) {
                eventEmitter.emit(EVENT_SCREEN_SHOWN, screenId);
            }

            @Override
            public void automationsDidStartExecuting(@NonNull QActionResult actionResult) {
                final WritableMap payload = EntitiesConverter.mapActionResult(actionResult);
                eventEmitter.emit(EVENT_ACTION_STARTED, payload);
            }

            @Override
            public void automationsDidFailExecuting(@NonNull QActionResult actionResult) {
                final WritableMap payload = EntitiesConverter.mapActionResult(actionResult);
                eventEmitter.emit(EVENT_ACTION_FAILED, payload);
            }

            @Override
            public void automationsDidFinishExecuting(@NonNull QActionResult actionResult) {
                final WritableMap payload = EntitiesConverter.mapActionResult(actionResult);
                eventEmitter.emit(EVENT_ACTION_FINISHED, payload);
            }

            @Override
            public void automationsFinished() {
                eventEmitter.emit(EVENT_AUTOMATIONS_FINISHED, null);
            }
        };
    }
}
