package com.reactlibrary;

import com.android.billingclient.api.SkuDetails;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.qonversion.android.sdk.dto.QLaunchResult;
import com.qonversion.android.sdk.dto.QPermission;
import com.qonversion.android.sdk.dto.QProduct;
import com.qonversion.android.sdk.dto.QProductDuration;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class EntitiesConverter {
    static WritableMap mapLaunchResult(QLaunchResult launchResult) {
        WritableMap products = mapProducts(launchResult.getProducts());
        WritableMap permissions = mapPermissions(launchResult.getPermissions());
        WritableMap userProducts = mapProducts(launchResult.getUserProducts());

        WritableMap result = Arguments.createMap();
        result.putString("uid", launchResult.getUid());
        result.putDouble("timestamp", (double)launchResult.getDate().getTime());
        result.putMap("products", products);
        result.putMap("permissions", permissions);
        result.putMap("user_products", userProducts);

        return result;
    }

    static WritableMap mapProducts(Map<String, QProduct> products) {
        WritableMap result = Arguments.createMap();

        for (Map.Entry<String, QProduct> entry : products.entrySet()) {
            WritableMap map = Arguments.createMap();
            map.putString("id", entry.getValue().getQonversionID());
            map.putString("store_id", entry.getValue().getStoreID());
            map.putInt("type", entry.getValue().getType().getType());

            QProductDuration duration = entry.getValue().getDuration();
            if (duration != null) {
                map.putInt("duration", duration.getType());
            }

            SkuDetails skuDetails = entry.getValue().getSkuDetail();
            if (skuDetails != null) {
                WritableMap mappedSkuDetails = mapSkuDetails(entry.getValue().getSkuDetail());
                map.putMap("storeProduct", mappedSkuDetails);
                map.putString("prettyPrice", entry.getValue().getPrettyPrice());
            }

            result.putMap(entry.getKey(), map);
        }

        return result;
    }

    static WritableMap mapSkuDetails(SkuDetails skuDetails) {
        WritableMap map = Arguments.createMap();
        map.putString("description", skuDetails.getDescription());
        map.putString("freeTrialPeriod", skuDetails.getFreeTrialPeriod());
        map.putString("iconUrl", skuDetails.getIconUrl());
        map.putString("introductoryPrice", skuDetails.getIntroductoryPrice());
        map.putDouble("introductoryPriceAmountMicros", (double)skuDetails.getIntroductoryPriceAmountMicros());
        map.putInt("introductoryPriceCycles", skuDetails.getIntroductoryPriceCycles());
        map.putString("introductoryPricePeriod", skuDetails.getIntroductoryPricePeriod());
        map.putString("originalJson", skuDetails.getOriginalJson());
        map.putString("originalPrice", skuDetails.getOriginalPrice());
        map.putDouble("originalPriceAmountMicros", (double)skuDetails.getOriginalPriceAmountMicros());
        map.putString("price", skuDetails.getPrice());
        map.putDouble("priceAmountMicros", (double)skuDetails.getPriceAmountMicros());
        map.putString("priceCurrencyCode", skuDetails.getPriceCurrencyCode());
        map.putString("sku", skuDetails.getSku());
        map.putString("subscriptionPeriod", skuDetails.getSubscriptionPeriod());
        map.putString("title", skuDetails.getTitle());
        map.putString("type", skuDetails.getType());
        map.putInt("hashCode", skuDetails.hashCode());
        map.putString("toString", skuDetails.toString());

        return map;
    }

    static WritableMap mapPermissions(Map<String, QPermission> permissions){
        WritableMap result = Arguments.createMap();
        for (Map.Entry<String, QPermission> entry : permissions.entrySet()) {
            WritableMap map = Arguments.createMap();
            map.putString("id", entry.getValue().getPermissionID());
            map.putString("associated_product", entry.getValue().getProductID());
            map.putInt("renew_state", entry.getValue().getRenewState().getType());
            map.putBoolean("active", entry.getValue().isActive());

            map.putDouble("started_timestamp", (double)entry.getValue().getStartedDate().getTime());

            Date expirationDate = entry.getValue().getExpirationDate();
            if (expirationDate != null) {
                map.putDouble("expiration_timestamp", (double)expirationDate.getTime());
            }

            result.putMap(entry.getKey(), map);
        }

        return result;
    }

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
}
