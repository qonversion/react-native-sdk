package com.qonversion.reactnativesdk

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.reactlibrary.QonversionModule

class QonversionPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == NoCodesModule.NAME) {
            NoCodesModule(reactContext)
        } else if (name == QonversionModule.NAME) {
            QonversionModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                QonversionModule.NAME to ReactModuleInfo(
                    QonversionModule.NAME,
                    QonversionModule.NAME,
                    canOverrideExistingModule = false,
                    needsEagerInit = false,
                    isCxxModule = false,
                    isTurboModule = true
                ),
                NoCodesModule.NAME to ReactModuleInfo(
                    NoCodesModule.NAME,
                    NoCodesModule.NAME,
                    canOverrideExistingModule = false,
                    needsEagerInit = false,
                    isCxxModule = false,
                    isTurboModule = true
                )
            )
        }
    }
}
