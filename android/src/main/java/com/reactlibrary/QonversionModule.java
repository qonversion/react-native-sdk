package com.reactlibrary;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.qonversion.android.sdk.AttributionSource;
import com.qonversion.android.sdk.QUserProperties;
import com.qonversion.android.sdk.Qonversion;
import com.qonversion.android.sdk.QonversionEligibilityCallback;
import com.qonversion.android.sdk.QonversionError;
import com.qonversion.android.sdk.QonversionErrorCode;
import com.qonversion.android.sdk.QonversionExperimentsCallback;
import com.qonversion.android.sdk.QonversionLaunchCallback;
import com.qonversion.android.sdk.QonversionOfferingsCallback;
import com.qonversion.android.sdk.QonversionPermissionsCallback;
import com.qonversion.android.sdk.QonversionProductsCallback;
import com.qonversion.android.sdk.dto.QLaunchResult;
import com.qonversion.android.sdk.dto.experiments.QExperimentInfo;
import com.qonversion.android.sdk.dto.offerings.QOffering;
import com.qonversion.android.sdk.dto.offerings.QOfferings;
import com.qonversion.android.sdk.dto.QPermission;
import com.qonversion.android.sdk.dto.products.QProduct;

import org.json.JSONException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import com.qonversion.android.sdk.dto.eligibility.QEligibility;

import java.util.List;

import android.app.Activity;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

public class QonversionModule extends ReactContextBaseJavaModule {

    private QonversionSDKInfo sdkInfoToSave;

    private static final HashMap<String, QUserProperties> userPropertiesMap = new HashMap<String, QUserProperties>() {{
        put("EMAIL", QUserProperties.Email);
        put("NAME", QUserProperties.Name);
        put("APPS_FLYER_USER_ID", QUserProperties.AppsFlyerUserId);
        put("ADJUST_USER_ID", QUserProperties.AdjustAdId);
        put("KOCHAVA_DEVICE_ID", QUserProperties.KochavaDeviceId);
        put("CUSTOM_USER_ID", QUserProperties.CustomUserId);
        put("FACEBOOK_ATTRIBUTION", QUserProperties.FacebookAttribution);
    }};

    public QonversionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void storeSDKInfoToPreferences(QonversionSDKInfo sdkInfo,Activity currentActivity){
        SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(currentActivity.getApplication()).edit();
        editor.putString(sdkInfo.sdkVersionKey, sdkInfo.sdkVersion);
        editor.putString(sdkInfo.sourceKey, sdkInfo.source);
        editor.apply();
    }

    private QonversionError generateActivityError () {
        return new QonversionError(QonversionErrorCode.UnknownError, "Android current activity is null, cannot perform the process.");
    }

    @Override
    public String getName() {
        return "RNQonversion";
    }

    @ReactMethod
    public void storeSDKInfo(String sourceKey, String source, String sdkVersionKey, String sdkVersion) {
        Activity currentActivity = getCurrentActivity();
        QonversionSDKInfo sdkInfo = new QonversionSDKInfo(sourceKey, source, sdkVersionKey, sdkVersion);

        if (currentActivity == null) {
            this.sdkInfoToSave = sdkInfo;
            return;
        }

        storeSDKInfoToPreferences(sdkInfo, currentActivity);
    }

    @ReactMethod
    public void launchWithKey(String key, Boolean observeMode, final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if(currentActivity == null){
            QonversionError qonversionError = generateActivityError();
            promise.reject(qonversionError.getCode().toString(), qonversionError.getDescription());
            return;
        }

        if(this.sdkInfoToSave != null){
            storeSDKInfoToPreferences(this.sdkInfoToSave, currentActivity);
        }

        Qonversion.launch(currentActivity.getApplication(), key, observeMode, new QonversionLaunchCallback()
        {
            @Override
            public void onSuccess(@NonNull QLaunchResult qLaunchResult) {
                WritableMap result = EntitiesConverter.mapLaunchResult(qLaunchResult);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void purchaseProduct(String productId, String offeringId, final Promise promise) {
        purchaseWithId(productId, offeringId, promise);
    }

    @ReactMethod
    public void purchase(String productId, final Promise promise) {
        purchaseWithId(productId, null, promise);
    }

    private void purchaseWithId(final String productId, @Nullable final String offeringId, final Promise promise) {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            QonversionError qonversionError = generateActivityError();
            promise.reject(qonversionError.getCode().toString(),qonversionError.getDescription());
            return;
        }

        if (offeringId == null) {
            proccessPurchase(currentActivity, productId, promise);
            return;
        }

        Qonversion.offerings(new QonversionOfferingsCallback() {
            @Override
            public void onSuccess(@NonNull QOfferings offerings) {
                final QOffering offering = offerings.offeringForID(offeringId);

                if (offering == null) {
                    proccessPurchase(currentActivity, productId, promise);
                    return;
                }

                final QProduct product = offering.productForID(productId);
                if (product == null) {
                    proccessPurchase(currentActivity, productId, promise);
                    return;
                }

                final QonversionPermissionsCallback callback = new QonversionPermissionsCallback() {
                    @Override
                    public void onSuccess(@NonNull Map<String, QPermission> map) {
                        WritableMap result = EntitiesConverter.mapPermissions(map);
                        promise.resolve(result);
                    }

                    @Override
                    public void onError(@NonNull QonversionError qonversionError) {
                        rejectWithError(qonversionError, promise);
                    }
                };

                Qonversion.purchase(currentActivity, product, callback);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                proccessPurchase(currentActivity, productId, promise);
            }
        });
    }

    private void proccessPurchase(Activity currentActivity, String productId, final Promise promise) {
        Qonversion.purchase(currentActivity, productId, new QonversionPermissionsCallback() {
            @Override
            public void onSuccess(@NonNull Map<String, QPermission> map) {
                WritableMap result = EntitiesConverter.mapPermissions(map);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void updatePurchaseWithProrationMode(String productId, String oldProductId, Integer prorationMode, final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            QonversionError qonversionError = generateActivityError();
            promise.reject(qonversionError.getCode().toString(),qonversionError.getDescription());
            return;
        }

        Qonversion.updatePurchase(currentActivity, productId, oldProductId, prorationMode, new QonversionPermissionsCallback() {
            @Override
            public void onSuccess(@NonNull Map<String, QPermission> map) {
                WritableMap result = EntitiesConverter.mapPermissions(map);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void updatePurchase(String productId, String oldProductId, final Promise promise) {
        updatePurchaseWithProrationMode(productId, oldProductId, null, promise);
    }

    @ReactMethod
    public void setProperty(String key, String value) {
        QUserProperties property = userPropertiesMap.get(key);

        if (property != null) {
            Qonversion.setProperty(property, value);
        }
    }

    @ReactMethod
    public void setUserProperty(String key, String value) {
        Qonversion.setUserProperty(key, value);
    }

    @ReactMethod
    public void addAttributionData(ReadableMap map, Integer provider) {
        AttributionSource source = null;
        switch (provider) {
            case 0:
                source = AttributionSource.AppsFlyer;
                break;
            case 1:
                source = AttributionSource.Branch;
                break;
            case 2:
                source = AttributionSource.Adjust;
                break;
        }

        if (source == null) {
            return;
        }

        try {
            HashMap attributesHashMap = EntitiesConverter.convertReadableMapToHashMap(map);
            Qonversion.attribution(attributesHashMap, source);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void checkPermissions(final Promise promise) {
        Qonversion.checkPermissions(new QonversionPermissionsCallback() {
            @Override
            public void onSuccess(@NonNull Map<String, QPermission> map) {
                WritableMap result = EntitiesConverter.mapPermissions(map);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void products(final Promise promise) {
        Qonversion.products(new QonversionProductsCallback() {
            @Override
            public void onSuccess(@NonNull Map<String, QProduct> map) {
                WritableMap result = EntitiesConverter.mapProducts(map);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void offerings(final Promise promise) {
        Qonversion.offerings(new QonversionOfferingsCallback() {
            @Override
            public void onSuccess(@NonNull QOfferings offerings) {
                WritableMap result = EntitiesConverter.mapOfferings(offerings);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void checkTrialIntroEligibilityForProductIds(ReadableArray ids, final Promise promise) {
        List<String> result = Arrays.asList(ids.toArrayList().toArray(new String[ids.size()]));
        Qonversion.checkTrialIntroEligibilityForProductIds(result, new QonversionEligibilityCallback() {
            @Override
            public void onSuccess(@NonNull Map<String, QEligibility> map) {
                WritableArray result = EntitiesConverter.mapEligibility(map);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void experiments(final Promise promise) {
        Qonversion.experiments(new QonversionExperimentsCallback() {
            @Override
            public void onSuccess(@NonNull Map<String, QExperimentInfo> map) {
                WritableArray result = EntitiesConverter.mapExperiments(map);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void restore(final Promise promise) {
        Qonversion.restore(new QonversionPermissionsCallback() {
            @Override
            public void onSuccess(@NonNull Map<String, QPermission> map) {
                WritableMap result = EntitiesConverter.mapPermissions(map);
                promise.resolve(result);
            }

            @Override
            public void onError(@NonNull QonversionError qonversionError) {
                rejectWithError(qonversionError, promise);
            }
        });
    }

    @ReactMethod
    public void syncPurchases() {
        Qonversion.syncPurchases();
    }

    @ReactMethod
    public void setDebugMode() {
        Qonversion.setDebugMode();
    }

    @ReactMethod
    public void resetUser() {
        Qonversion.resetUser();
    }

    @ReactMethod
    public void identify(String userID) {
        Qonversion.identify(userID);
    }

    @ReactMethod
    public void logout() {
        Qonversion.logout();
    }

    @ReactMethod
    public void setNotificationsToken(String token) {
        Qonversion.setNotificationsToken(token);
    }

    @ReactMethod
    public void handleNotification(final ReadableMap data, final Promise promise) {
        final ReadableMap notificationData = data.getMap("notificationData");
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

        if (dataMap.isEmpty()) {
            promise.resolve(false);
            return;
        }

        final Map<String, String> stringsMap = new HashMap<>();
        for (String key : dataMap.keySet()) {
            Object value = dataMap.get(key);
            if (value != null) {
                stringsMap.put(key, value.toString());
            }
        }

        boolean isQonversionNotification = Qonversion.handleNotification(stringsMap);
        promise.resolve(isQonversionNotification);
    }

    private void rejectWithError(@NonNull QonversionError qonversionError, final Promise promise) {
        String errorMessage = qonversionError.getDescription() + "\n" +  qonversionError.getAdditionalMessage();
        promise.reject(qonversionError.getCode().toString(), errorMessage);
    }
}
