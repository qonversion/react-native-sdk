package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.qonversion.android.sdk.QonversionError;
import com.qonversion.android.sdk.automations.AutomationsEvent;
import com.qonversion.android.sdk.automations.QActionResult;
import com.qonversion.android.sdk.dto.experiments.QExperimentInfo;
import com.qonversion.android.sdk.dto.offerings.QOffering;
import com.qonversion.android.sdk.dto.offerings.QOfferings;
import com.qonversion.android.sdk.dto.products.QProduct;
import com.qonversion.android.sdk.dto.eligibility.QEligibility;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Nullable;

public class EntitiesConverter {

    static HashMap<String, Object> convertReadableMapToHashMap(ReadableMap readableMap) throws JSONException {
        JSONObject jsonObject = convertMapToJson(readableMap);
        return (HashMap<String, Object>)toMap(jsonObject);
    }

    static Map<String, Object> toMap(JSONObject jsonobj)  throws JSONException {
        Map<String, Object> map = new HashMap<String, Object>();
        Iterator<String> keys = jsonobj.keys();
        while(keys.hasNext()) {
            String key = keys.next();
            Object value = jsonobj.get(key);
            if (value instanceof JSONArray) {
                value = toList((JSONArray) value);
            } else if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            map.put(key, value);
        }   return map;
    }

    public static List<Object> toList(JSONArray array) throws JSONException {
        List<Object> list = new ArrayList<Object>();
        for(int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            if (value instanceof JSONArray) {
                value = toList((JSONArray) value);
            }
            else if (value instanceof JSONObject) {
                value = toMap((JSONObject) value);
            }
            list.add(value);
        }   return list;
    }

    static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();

        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }

    static List<String> convertArrayToStringList(ReadableArray readableArray) {
        final List<String> list = new ArrayList<>();
        for (int i = 0; i < readableArray.size(); ++i) {
            list.add(readableArray.getString(i));
        }
        return list;
    }

    static WritableArray convertListToWritableArray(List<?> list) {
        final WritableArray array = new WritableNativeArray();
        for(int i = 0; i < list.size(); i++) {
            Object value = list.get(i);
            if (value instanceof String) {
                array.pushString((String) value);
            } else if (value instanceof Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof Long) {
                array.pushDouble(((Long) value).doubleValue());
            } else if (value instanceof Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof Float) {
                array.pushDouble((Float) value);
            } else if (value instanceof Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof List) {
                array.pushArray(convertListToWritableArray((List<?>) value));
            } else if (value instanceof Map) {
                array.pushMap(convertMapToWritableMap((Map<?, ?>) value));
            }
        }
        return array;
    }

    static WritableMap convertMapToWritableMap(Map<?, ?> map) {
        final WritableMap writableMap = new WritableNativeMap();
        final Set<?> keys = map.keySet();
        for (Object key : keys) {
            String keyStr = key.toString();
            Object value = map.get(key);
            if (value instanceof String) {
                writableMap.putString(keyStr, (String) value);
            } else if (value instanceof Integer) {
                writableMap.putInt(keyStr, (Integer) value);
            } else if (value instanceof Long) {
                writableMap.putDouble(keyStr, ((Long) value).doubleValue());
            } else if (value instanceof Double) {
                writableMap.putDouble(keyStr, (Double) value);
            } else if (value instanceof Float) {
                writableMap.putDouble(keyStr, (Float) value);
            } else if (value instanceof Boolean) {
                writableMap.putBoolean(keyStr, (Boolean) value);
            } else if (value instanceof List) {
                writableMap.putArray(keyStr, convertListToWritableArray((List<?>) value));
            } else if (value instanceof Map) {
                writableMap.putMap(keyStr, convertMapToWritableMap((Map<?, ?>) value));
            }
        }
        return writableMap;
    }
}
