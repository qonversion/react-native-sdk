package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import com.qonversion.android.sdk.Qonversion;
import com.qonversion.android.sdk.QonversionBillingBuilder;
import com.qonversion.android.sdk.QonversionCallback;

import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.Purchase;
import java.util.List;
import org.jetbrains.annotations.Nullable;
import org.jetbrains.annotations.NotNull;

public class QonversionModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public QonversionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNQonversion";
    }

    @ReactMethod
    public void launchWithKey(String key, Callback callback) {
        Qonversion.initialize(
                getCurrentActivity().getApplication(),
                key,
                "",
                buildBilling(),
                true,
                getCallback(callback)
        );
    }

    @ReactMethod
    public void launchWithKeyUserID(String key, String userId) {
        Qonversion.initialize(
                getCurrentActivity().getApplication(),
                key,
                userId,
                buildBilling(),
                true,
                null
        );
    }

    @ReactMethod
    public void launchWithKeyAutotrackPurchases(String key, boolean autoTrackPurchases, Callback callback) {
        Qonversion.initialize(
                getCurrentActivity().getApplication(),
                key,
                "",
                buildBilling(),
                autoTrackPurchases,
                getCallback(callback)
        );
    }

    private QonversionBillingBuilder buildBilling() {
        return new QonversionBillingBuilder()
                .enablePendingPurchases()
                .setChildDirected(BillingClient.ChildDirected.CHILD_DIRECTED)
                .setListener(new PurchasesUpdatedListener() {
                    @Override
                    public void onPurchasesUpdated(BillingResult billingResult, @Nullable List<Purchase> purchases) {}
                });
    }

    private QonversionCallback getCallback(final Callback callback) {
        return new QonversionCallback() {
            @Override
            public void onSuccess(@NotNull String uid) {
                callback.invoke(uid);
            }

            @Override
            public void onError(@NotNull Throwable t) {
                callback.invoke("Error launching Qonversion: " + t.getLocalizedMessage() + ", cause:" + t.getCause());
            }
        };
    }
}
