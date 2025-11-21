package com.qonversion.reactnativesdk

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import io.qonversion.sandwich.BridgeData
import io.qonversion.sandwich.NoCodesSandwich
import io.qonversion.sandwich.NoCodesEventListener

@ReactModule(name = NoCodesModule.NAME)
class NoCodesModule(private val reactContext: ReactApplicationContext) : NativeNoCodesModuleSpec(reactContext) {
    private val noCodesSandwich: NoCodesSandwich = NoCodesSandwich()
    private val noCodesEventListener: NoCodesEventListener = object : NoCodesEventListener {
        override fun onNoCodesEvent(event: NoCodesEventListener.Event, payload: BridgeData?) {
            val eventMap: WritableMap = WritableNativeMap()
            eventMap.putString("name", event.key)
            payload?.let {
                val payloadMap = EntitiesConverter.convertMapToWritableMap(it)

                eventMap.putMap("payload", payloadMap)
            }
            emitOnNoCodeEvent(eventMap)
        }
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    override fun initialize(projectKey: String, source: String, version: String, proxyUrl: String?) {
        noCodesSandwich.storeSdkInfo(reactContext, source, version)
        noCodesSandwich.initialize(reactContext, projectKey, null, null, proxyUrl)
        noCodesSandwich.setDelegate(noCodesEventListener)
        noCodesSandwich.setScreenCustomizationDelegate()
    }

    @ReactMethod
    override fun setScreenPresentationConfig(configData: ReadableMap, contextKey: String?, promise: Promise) {
        try {
            val config: Map<String, Any> = EntitiesConverter.convertReadableMapToHashMap(configData)
            noCodesSandwich.setScreenPresentationConfig(config, contextKey)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    override fun showScreen(contextKey: String, promise: Promise) {
        try {
            noCodesSandwich.showScreen(contextKey)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    override fun close(promise: Promise) {
        try {
            noCodesSandwich.close()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    companion object {
        const val NAME = "RNNoCodes"
    }
}
