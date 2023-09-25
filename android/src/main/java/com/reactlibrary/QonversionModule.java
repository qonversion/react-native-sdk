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
import android.app.Application;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import io.qonversion.sandwich.PurchaseResultListener;
import io.qonversion.sandwich.QonversionEventsListener;
import io.qonversion.sandwich.QonversionSandwich;
import io.qonversion.sandwich.SandwichError;

public class QonversionModule extends ReactContextBaseJavaModule implements QonversionEventsListener {

    private final QonversionSandwich qonversionSandwich;

    private static final String EVENT_ENTITLEMENTS_UPDATED = "entitlements_updated";

    private static final String ERROR_CODE_PURCHASE_CANCELLED_BY_USER = "PURCHASE_CANCELLED_BY_USER";

    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter = null;

    public QonversionModule(ReactApplicationContext reactContext) {
        super(reactContext);

        qonversionSandwich = new QonversionSandwich(
                (Application) reactContext.getApplicationContext(),
                QonversionModule.this::getCurrentActivity,
                this
        );
    }

    @Override
    public void initialize() {
        super.initialize();

        eventEmitter = getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    @NonNull
    @Override
    public String getName() {
        return "RNQonversion";
    }

    @ReactMethod
    public void storeSDKInfo(String source, String sdkVersion) {
        qonversionSandwich.storeSdkInfo(source, sdkVersion);
    }

    @ReactMethod
    public void initializeSdk(
            String projectKey,
            String launchModeKey,
            @Nullable String environmentKey,
            @Nullable String entitlementsCacheLifetimeKey,
            @Nullable String proxyUrl,
            boolean kidsMode
    ) {
        qonversionSandwich.initialize(
                getReactApplicationContext(),
                projectKey,
                launchModeKey,
                environmentKey,
                entitlementsCacheLifetimeKey,
                proxyUrl,
                kidsMode
        );
    }

    @ReactMethod
    public void syncHistoricalData() {
        qonversionSandwich.syncHistoricalData();
    }

    @ReactMethod
    public void purchaseProduct(String productId, String offeringId, final Promise promise) {
        qonversionSandwich.purchaseProduct(productId, offeringId, getPurchaseResultListener(promise));
    }

    @ReactMethod
    public void purchase(String productId, final Promise promise) {
        qonversionSandwich.purchase(productId, getPurchaseResultListener(promise));
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
                getPurchaseResultListener(promise)
        );
    }

    @ReactMethod
    public void updatePurchase(String productId, String oldProductId, final Promise promise) {
        updatePurchaseWithProrationMode(productId, oldProductId, null, promise);
    }

    @ReactMethod
    public void updatePurchaseWithProrationMode(String productId, String oldProductId, Integer prorationMode, final Promise promise) {
        qonversionSandwich.updatePurchase(productId, oldProductId, prorationMode, getPurchaseResultListener(promise));
    }

    @ReactMethod
    public void setDefinedProperty(String key, String value) {
        qonversionSandwich.setDefinedProperty(key, value);
    }

    @ReactMethod
    public void setCustomProperty(String key, String value) {
        qonversionSandwich.setCustomProperty(key, value);
    }

    @ReactMethod
    public void userProperties(final Promise promise) {
        qonversionSandwich.userProperties(Utils.getResultListener(promise));
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
    public void checkEntitlements(final Promise promise) {
        qonversionSandwich.checkEntitlements(Utils.getResultListener(promise));
    }

    @ReactMethod
    public void products(final Promise promise) {
        qonversionSandwich.products(Utils.getResultListener(promise));
    }

    @ReactMethod
    public void offerings(final Promise promise) {
        qonversionSandwich.offerings(Utils.getResultListener(promise));
    }

    @ReactMethod
    public void checkTrialIntroEligibilityForProductIds(ReadableArray ids, final Promise promise) {
        final List<String> idList = EntitiesConverter.convertArrayToStringList(ids);
        qonversionSandwich.checkTrialIntroEligibility(idList, Utils.getResultListener(promise));
    }

    @ReactMethod
    public void restore(final Promise promise) {
        qonversionSandwich.restore(Utils.getResultListener(promise));
    }

    @ReactMethod
    public void syncPurchases() {
        qonversionSandwich.syncPurchases();
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
    public void userInfo(final Promise promise) {
        qonversionSandwich.userInfo(Utils.getResultListener(promise));
    }

    @ReactMethod
    public void remoteConfig(final Promise promise) {
        qonversionSandwich.remoteConfig(Utils.getResultListener(promise));
    }

    @ReactMethod
    public void attachUserToExperiment(final String experimentId, final String groupId, final Promise promise) {
        qonversionSandwich.attachUserToExperiment(experimentId, groupId, Utils.getResultListener(promise));
    }

    @ReactMethod
    public void detachUserFromExperiment(final String experimentId, final Promise promise) {
        qonversionSandwich.detachUserFromExperiment(experimentId, Utils.getResultListener(promise));
    }

    @ReactMethod
    public void attachUserToRemoteConfiguration(final String remoteConfigurationId, final Promise promise) {
        qonversionSandwich.attachUserToRemoteConfiguration(remoteConfigurationId, Utils.getResultListener(promise));
    }

    @ReactMethod
    public void detachUserFromRemoteConfiguration(final String remoteConfigurationId, final Promise promise) {
        qonversionSandwich.detachUserFromRemoteConfiguration(remoteConfigurationId, Utils.getResultListener(promise));
    }

    @Override
    public void onEntitlementsUpdated(@NonNull Map<String, ?> map) {
        final WritableMap payload = EntitiesConverter.convertMapToWritableMap(map);
        if (eventEmitter != null) {
            eventEmitter.emit(EVENT_ENTITLEMENTS_UPDATED, payload);
        }
    }

    private PurchaseResultListener getPurchaseResultListener(final Promise promise) {
        return new PurchaseResultListener() {
            @Override
            public void onSuccess(@NonNull Map<String, ?> map) {
                final WritableMap payload = EntitiesConverter.convertMapToWritableMap(map);
                promise.resolve(payload);
            }

            @Override
            public void onError(@NonNull SandwichError error, boolean isCancelled) {
                if (isCancelled) {
                    Utils.rejectWithError(error, promise, ERROR_CODE_PURCHASE_CANCELLED_BY_USER);
                } else {
                    Utils.rejectWithError(error, promise);
                }
            }
        };
    }
}
