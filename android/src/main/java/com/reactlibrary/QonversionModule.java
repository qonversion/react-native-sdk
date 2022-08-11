package com.reactlibrary;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.json.JSONException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import android.app.Activity;
import android.app.Application;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import io.qonversion.sandwich.ActivityProvider;
import io.qonversion.sandwich.QonversionEventsListener;
import io.qonversion.sandwich.QonversionSandwich;
import io.qonversion.sandwich.ResultListener;
import io.qonversion.sandwich.SandwichError;

public class QonversionModule extends ReactContextBaseJavaModule implements QonversionEventsListener {

    private final QonversionSandwich qonversionSandwich;

    private static final String EVENT_PERMISSIONS_UPDATED = "permissions_updated";

    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;

    public QonversionModule(ReactApplicationContext reactContext) {
        super(reactContext);

        qonversionSandwich = new QonversionSandwich(
                (Application) reactContext.getApplicationContext(),
                new ActivityProvider() {
                    @Nullable
                    @Override
                    public Activity getCurrentActivity() {
                        return QonversionModule.this.getCurrentActivity();
                    }
                },
                this
        );
    }

    @Override
    public void initialize() {
        super.initialize();

        eventEmitter = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    @Override
    public String getName() {
        return "RNQonversion";
    }

    @ReactMethod
    public void storeSDKInfo(String source, String sdkVersion) {
        qonversionSandwich.storeSdkInfo(source, sdkVersion);
    }

    @ReactMethod
    public void launch(String key, Boolean observeMode, final Promise promise) {
        qonversionSandwich.launch(key, observeMode, getResultListener(promise));
    }

    @ReactMethod
    public void purchaseProduct(String productId, String offeringId, final Promise promise) {
        qonversionSandwich.purchaseProduct(productId, offeringId, getResultListener(promise));
    }

    @ReactMethod
    public void purchase(String productId, final Promise promise) {
        qonversionSandwich.purchase(productId, getResultListener(promise));
    }

    @ReactMethod
    public void updateProductWithId(
            final String productId,
            @Nullable final String offeringId,
            final String oldProductId,
            final Promise promise
    ) {
        updateProductWithIdAndProrationMode(productId, offeringId, oldProductId, null, promise);
    }

    @ReactMethod
    public void updateProductWithIdAndProrationMode(
            final String productId,
            @Nullable final String offeringId,
            final String oldProductId,
            @Nullable final Integer prorationMode,
            final Promise promise
    ) {
        qonversionSandwich.updatePurchaseWithProduct(
                productId,
                offeringId,
                oldProductId,
                prorationMode,
                getResultListener(promise)
        );
    }

    @ReactMethod
    public void updatePurchase(String productId, String oldProductId, final Promise promise) {
        updatePurchaseWithProrationMode(productId, oldProductId, null, promise);
    }

    @ReactMethod
    public void updatePurchaseWithProrationMode(String productId, String oldProductId, Integer prorationMode, final Promise promise) {
        qonversionSandwich.updatePurchase(productId, oldProductId, prorationMode, getResultListener(promise));
    }

    @ReactMethod
    public void setProperty(String key, String value) {
        qonversionSandwich.setDefinedProperty(key, value);
    }

    @ReactMethod
    public void setUserProperty(String key, String value) {
        qonversionSandwich.setCustomProperty(key, value);
    }

    @ReactMethod
    public void addAttributionData(ReadableMap map, String provider) {
        try {
            HashMap<String, Object> attributesHashMap = EntitiesConverter.convertReadableMapToHashMap(map);
            qonversionSandwich.addAttributionData(provider, attributesHashMap);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void checkPermissions(final Promise promise) {
        qonversionSandwich.checkPermissions(getResultListener(promise));
    }

    @ReactMethod
    public void products(final Promise promise) {
        qonversionSandwich.products(getResultListener(promise));
    }

    @ReactMethod
    public void offerings(final Promise promise) {
        qonversionSandwich.offerings(getResultListener(promise));
    }

    @ReactMethod
    public void checkTrialIntroEligibilityForProductIds(ReadableArray ids, final Promise promise) {
        final List<String> idList = EntitiesConverter.convertArrayToStringList(ids);
        qonversionSandwich.checkTrialIntroEligibility(idList, getResultListener(promise));
    }

    @ReactMethod
    public void experiments(final Promise promise) {
        qonversionSandwich.experiments(getResultListener(promise));
    }

    @ReactMethod
    public void restore(final Promise promise) {
        qonversionSandwich.restore(getResultListener(promise));
    }

    @ReactMethod
    public void syncPurchases() {
        qonversionSandwich.syncPurchases();
    }

    @ReactMethod
    public void setDebugMode() {
        qonversionSandwich.setDebugMode();
    }

    @ReactMethod
    public void identify(String userID) {
        qonversionSandwich.identify(userID);
    }

    @ReactMethod
    public void logout() {
        qonversionSandwich.logout();
    }

    @ReactMethod
    public void setNotificationsToken(String token) {
        qonversionSandwich.setNotificationToken(token);
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

        boolean isQonversionNotification = qonversionSandwich.handleNotification(dataMap);
        promise.resolve(isQonversionNotification);
    }

    @Override
    public void onPermissionsUpdate(@NonNull Map<String, ?> map) {
        final WritableMap payload = EntitiesConverter.convertMapToWritableMap(map);
        if (eventEmitter != null) {
            eventEmitter.emit(EVENT_PERMISSIONS_UPDATED, payload);
        }
    }

    private ResultListener getResultListener(final Promise promise) {
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

    private void rejectWithError(@NonNull SandwichError sandwichError, final Promise promise) {
        String errorMessage = sandwichError.getDescription() + "\n" + sandwichError.getAdditionalMessage();
        promise.reject(sandwichError.getCode(), errorMessage);
    }
}
