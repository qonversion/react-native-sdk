package com.qonversion.reactnativesdk

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import io.qonversion.sandwich.ResultListener
import io.qonversion.sandwich.SandwichError

class Utils {
    companion object {
        @JvmStatic
        fun getResultListener(promise: Promise): ResultListener {
            return object : ResultListener {
                override fun onSuccess(data: Map<String, *>) {
                    val payload: WritableMap = EntitiesConverter.convertMapToWritableMap(data)
                    promise.resolve(payload)
                }

                override fun onError(error: SandwichError) {
                    rejectWithError(error, promise)
                }
            }
        }

        @JvmStatic
        @JvmOverloads
        fun rejectWithError(sandwichError: SandwichError, promise: Promise, customErrorCode: String? = null) {
            val errorMessage = sandwichError.description + "\n" + sandwichError.additionalMessage
            val errorCode = customErrorCode ?: sandwichError.code
            promise.reject(errorCode, errorMessage)
        }
    }
}
