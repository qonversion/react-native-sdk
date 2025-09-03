package com.qonversion.reactnativesdk

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableMapKeySetIterator
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

class EntitiesConverter {
    companion object {
        @Throws(JSONException::class)
        fun convertReadableMapToHashMap(readableMap: ReadableMap): HashMap<String, Any> {
            val jsonObject = convertMapToJson(readableMap)
            return toMap(jsonObject) as HashMap<String, Any>
        }

        @Throws(JSONException::class)
        fun toMap(jsonObj: JSONObject): Map<String, Any> {
            val map: MutableMap<String, Any> = HashMap()
            val keys: Iterator<String> = jsonObj.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                var value = jsonObj[key]
                if (value is JSONArray) {
                    value = toList(value)
                } else if (value is JSONObject) {
                    value = toMap(value)
                }
                map[key] = value
            }
            return map
        }

        @Throws(JSONException::class)
        fun toList(array: JSONArray): List<Any> {
            val list: MutableList<Any> = ArrayList()
            for (i in 0 until array.length()) {
                var value = array[i]
                if (value is JSONArray) {
                    value = toList(value)
                } else if (value is JSONObject) {
                    value = toMap(value)
                }
                list.add(value)
            }
            return list
        }

        @Throws(JSONException::class)
        fun convertMapToJson(readableMap: ReadableMap): JSONObject {
            val `object` = JSONObject()
            val iterator: ReadableMapKeySetIterator = readableMap.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                when (readableMap.getType(key)) {
                    ReadableType.Null -> `object`.put(key, JSONObject.NULL)
                    ReadableType.Boolean -> `object`.put(key, readableMap.getBoolean(key))
                    ReadableType.Number -> `object`.put(key, readableMap.getDouble(key))
                    ReadableType.String -> `object`.put(key, readableMap.getString(key))
                    ReadableType.Map -> `object`.put(key, convertMapToJson(readableMap.getMap(key)!!))
                    ReadableType.Array -> `object`.put(key, convertArrayToJson(readableMap.getArray(key)!!))
                }
            }
            return `object`
        }

        @Throws(JSONException::class)
        fun convertArrayToJson(readableArray: ReadableArray): JSONArray {
            val array = JSONArray()
            for (i in 0 until readableArray.size()) {
                when (readableArray.getType(i)) {
                    ReadableType.Null -> {}
                    ReadableType.Boolean -> array.put(readableArray.getBoolean(i))
                    ReadableType.Number -> array.put(readableArray.getDouble(i))
                    ReadableType.String -> array.put(readableArray.getString(i))
                    ReadableType.Map -> array.put(convertMapToJson(readableArray.getMap(i)!!))
                    ReadableType.Array -> array.put(convertArrayToJson(readableArray.getArray(i)!!))
                }
            }
            return array
        }

        fun convertArrayToStringList(readableArray: ReadableArray): List<String> {
            val list: MutableList<String> = ArrayList()
            for (i in 0 until readableArray.size()) {
                list.add(readableArray.getString(i)!!)
            }
            return list
        }

        fun convertListToWritableArray(list: List<*>): WritableArray {
            val array: WritableArray = WritableNativeArray()
            for (i in list.indices) {
                val value = list[i]
                when (value) {
                    is String -> array.pushString(value)
                    is Int -> array.pushInt(value)
                    is Long -> array.pushDouble(value.toDouble())
                    is Double -> array.pushDouble(value)
                    is Float -> array.pushDouble(value.toDouble())
                    is Boolean -> array.pushBoolean(value)
                    is List<*> -> array.pushArray(convertListToWritableArray(value))
                    is Map<*, *> -> array.pushMap(convertMapToWritableMap(value))
                }
            }
            return array
        }

        fun convertMapToWritableMap(map: Map<*, *>): WritableMap {
            val writableMap: WritableMap = WritableNativeMap()
            val keys: Set<*> = map.keys
            for (key in keys) {
                val keyStr = key.toString()
                val value = map[key]
                when (value) {
                    is String -> writableMap.putString(keyStr, value)
                    is Int -> writableMap.putInt(keyStr, value)
                    is Long -> writableMap.putDouble(keyStr, value.toDouble())
                    is Double -> writableMap.putDouble(keyStr, value)
                    is Float -> writableMap.putDouble(keyStr, value.toDouble())
                    is Boolean -> writableMap.putBoolean(keyStr, value)
                    is List<*> -> writableMap.putArray(keyStr, convertListToWritableArray(value))
                    is Map<*, *> -> writableMap.putMap(keyStr, convertMapToWritableMap(value))
                }
            }
            return writableMap
        }
    }
}
