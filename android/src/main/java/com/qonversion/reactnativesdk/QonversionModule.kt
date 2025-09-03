package com.reactlibrary

import android.app.Activity
import android.app.Application
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.qonversion.reactnativesdk.EntitiesConverter
import com.qonversion.reactnativesdk.NativeQonversionModuleSpec
import com.qonversion.reactnativesdk.Utils.Companion.getResultListener
import io.qonversion.sandwich.ActivityProvider
import io.qonversion.sandwich.BridgeData
import io.qonversion.sandwich.QonversionEventsListener
import io.qonversion.sandwich.QonversionSandwich
import org.json.JSONException

@ReactModule(name = QonversionModule.NAME)
class QonversionModule(reactContext: ReactApplicationContext) : NativeQonversionModuleSpec(reactContext), QonversionEventsListener {
    private val qonversionSandwich = QonversionSandwich(
        (reactContext.applicationContext as Application),
        object : ActivityProvider {
            override val currentActivity: Activity?
                get() = this@QonversionModule.currentActivity
        },
        this
    )

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun storeSDKInfo(source: String, sdkVersion: String) {
        qonversionSandwich.storeSdkInfo(source, sdkVersion)
    }

    @ReactMethod
    override fun initializeSdk(
        projectKey: String,
        launchModeKey: String,
        environmentKey: String?,
        entitlementsCacheLifetimeKey: String?,
        proxyUrl: String?,
        kidsMode: Boolean
    ) {
        qonversionSandwich.initialize(
            reactApplicationContext,
            projectKey,
            launchModeKey,
            environmentKey,
            entitlementsCacheLifetimeKey,
            proxyUrl,
            kidsMode
        )
    }

    @ReactMethod
    override fun syncHistoricalData() {
        qonversionSandwich.syncHistoricalData()
    }

    @ReactMethod
    override fun purchase(
        productId: String,
        quantity: Double,
        contextKeys: ReadableArray?,
        promoOffer: ReadableMap?,
        offerId: String?,
        applyOffer: Boolean,
        oldProductId: String?,
        updatePolicyKey: String?,
        promise: Promise
    ) {
        var contextKeysList: List<String>? = null
        if (contextKeys != null) {
            contextKeysList = EntitiesConverter.convertArrayToStringList(contextKeys)
        }
        qonversionSandwich.purchase(
            productId,
            offerId,
            applyOffer,
            oldProductId,
            updatePolicyKey,
            contextKeysList,
            getResultListener(promise)
        )
    }

    @ReactMethod
    override fun updatePurchase(
        productId: String,
        offerId: String?,
        applyOffer: Boolean,
        oldProductId: String?,
        updatePolicyKey: String?,
        promise: Promise
    ) {
        purchase(
            productId,
            1.0,
            null,
            null,
            offerId,
            applyOffer,
            oldProductId,
            updatePolicyKey,
            promise
        )
    }

    @ReactMethod
    override fun setDefinedProperty(key: String, value: String) {
        qonversionSandwich.setDefinedProperty(key, value)
    }

    @ReactMethod
    override fun setCustomProperty(key: String, value: String) {
        qonversionSandwich.setCustomProperty(key, value)
    }

    @ReactMethod
    override fun userProperties(promise: Promise) {
        qonversionSandwich.userProperties(getResultListener(promise))
    }

    @ReactMethod
    override fun addAttributionData(map: ReadableMap?, provider: String) {
        try {
            val attributesHashMap = EntitiesConverter.convertReadableMapToHashMap(
                map!!
            )
            qonversionSandwich.addAttributionData(provider, attributesHashMap)
        } catch (e: JSONException) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    override fun checkEntitlements(promise: Promise) {
        qonversionSandwich.checkEntitlements(getResultListener(promise))
    }

    @ReactMethod
    override fun products(promise: Promise) {
        qonversionSandwich.products(getResultListener(promise))
    }

    @ReactMethod
    override fun offerings(promise: Promise) {
        qonversionSandwich.offerings(getResultListener(promise))
    }

    @ReactMethod
    override fun checkTrialIntroEligibilityForProductIds(ids: ReadableArray?, promise: Promise) {
        val idList = EntitiesConverter.convertArrayToStringList(
            ids!!
        )
        qonversionSandwich.checkTrialIntroEligibility(idList, getResultListener(promise))
    }

    @ReactMethod
    override fun restore(promise: Promise) {
        qonversionSandwich.restore(getResultListener(promise))
    }

    @ReactMethod
    override fun syncPurchases() {
        qonversionSandwich.syncPurchases()
    }

    @ReactMethod
    override fun identify(userId: String, promise: Promise) {
        qonversionSandwich.identify(userId, getResultListener(promise))
    }

    @ReactMethod
    override fun logout() {
        qonversionSandwich.logout()
    }

    @ReactMethod
    override fun userInfo(promise: Promise) {
        qonversionSandwich.userInfo(getResultListener(promise))
    }

    @ReactMethod
    override fun remoteConfig(contextKey: String?, promise: Promise) {
        qonversionSandwich.remoteConfig(contextKey, getResultListener(promise))
    }

    @ReactMethod
    override fun remoteConfigList(promise: Promise) {
        qonversionSandwich.remoteConfigList(getResultListener(promise))
    }

    @ReactMethod
    override fun remoteConfigListForContextKeys(
        contextKeys: ReadableArray?,
        includeEmptyContextKey: Boolean,
        promise: Promise
    ) {
        val keysList = EntitiesConverter.convertArrayToStringList(
            contextKeys!!
        )
        qonversionSandwich.remoteConfigList(
            keysList,
            includeEmptyContextKey,
            getResultListener(promise)
        )
    }

    @ReactMethod
    override fun attachUserToExperiment(experimentId: String, groupId: String, promise: Promise) {
        qonversionSandwich.attachUserToExperiment(experimentId, groupId, getResultListener(promise))
    }

    @ReactMethod
    override fun detachUserFromExperiment(experimentId: String, promise: Promise) {
        qonversionSandwich.detachUserFromExperiment(experimentId, getResultListener(promise))
    }

    @ReactMethod
    override fun attachUserToRemoteConfiguration(remoteConfigurationId: String, promise: Promise) {
        qonversionSandwich.attachUserToRemoteConfiguration(
            remoteConfigurationId,
            getResultListener(promise)
        )
    }

    @ReactMethod
    override fun detachUserFromRemoteConfiguration(remoteConfigurationId: String, promise: Promise) {
        qonversionSandwich.detachUserFromRemoteConfiguration(
            remoteConfigurationId,
            getResultListener(promise)
        )
    }

    @ReactMethod
    override fun isFallbackFileAccessible(promise: Promise) {
        qonversionSandwich.isFallbackFileAccessible(getResultListener(promise))
    }

    override fun syncStoreKit2Purchases() {
        // iOS only
    }

    override fun collectAdvertisingId() {
        // iOS only
    }

    override fun collectAppleSearchAdsAttribution() {
        // iOS only
    }

    override fun presentCodeRedemptionSheet() {
        // iOS only
    }

    override fun promoPurchase(productId: String?, promise: Promise?) {
        // iOS only
    }

    override fun getPromotionalOffer(product: String?, discount: String?, promise: Promise?) {
        // iOS only
    }

    override fun onEntitlementsUpdated(entitlements: BridgeData) {
        val mappedEntitlements = EntitiesConverter.convertMapToWritableMap(entitlements)
        emitOnEntitlementsUpdated(mappedEntitlements)
    }

    companion object {
        const val NAME = "RNQonversion"
    }
}
