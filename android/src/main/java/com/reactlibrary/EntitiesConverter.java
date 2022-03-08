package com.reactlibrary;

import com.android.billingclient.api.SkuDetails;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.qonversion.android.sdk.QonversionError;
import com.qonversion.android.sdk.automations.AutomationsEvent;
import com.qonversion.android.sdk.automations.QActionResult;
import com.qonversion.android.sdk.dto.QLaunchResult;
import com.qonversion.android.sdk.dto.experiments.QExperimentInfo;
import com.qonversion.android.sdk.dto.offerings.QOffering;
import com.qonversion.android.sdk.dto.offerings.QOfferingTag;
import com.qonversion.android.sdk.dto.offerings.QOfferings;
import com.qonversion.android.sdk.dto.QPermission;
import com.qonversion.android.sdk.dto.products.QProduct;
import com.qonversion.android.sdk.dto.products.QProductDuration;
import com.qonversion.android.sdk.dto.eligibility.QEligibility;
import com.qonversion.android.sdk.dto.products.QTrialDuration;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

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
            WritableMap map = EntitiesConverter.mapProduct(entry.getValue());
            result.putMap(entry.getKey(), map);
        }

        return result;
    }

    static WritableMap mapProduct(QProduct product) {
        WritableMap map = Arguments.createMap();
        map.putString("id", product.getQonversionID());
        map.putString("store_id", product.getStoreID());
        map.putInt("type", product.getType().getType());

        String offeringId = product.getOfferingID();

        if (offeringId != null) {
            map.putString("offeringId", offeringId);
        }

        QProductDuration duration = product.getDuration();
        if (duration != null) {
            map.putInt("duration", duration.getType());
        }

        QTrialDuration trialDuration = product.getTrialDuration();
        if (trialDuration != null) {
            map.putInt("trialDuration", trialDuration.getType());
        }

        SkuDetails skuDetails = product.getSkuDetail();
        if (skuDetails != null) {
            WritableMap mappedSkuDetails = mapSkuDetails(product.getSkuDetail());
            map.putMap("storeProduct", mappedSkuDetails);
            map.putString("prettyPrice", product.getPrettyPrice());
        }

        return map;
    }

    static WritableMap mapOfferings(QOfferings offerings) {
        WritableMap result = Arguments.createMap();

        if (offerings.getMain() != null) {
            WritableMap mainOffering = EntitiesConverter.mapOffering(offerings.getMain());
            result.putMap("main", mainOffering);
        }

        WritableArray availableOfferings = Arguments.createArray();

        for (QOffering offering : offerings.getAvailableOfferings()) {
            WritableMap convertedOffering = EntitiesConverter.mapOffering(offering);

            availableOfferings.pushMap(convertedOffering);
        }

        result.putArray("availableOfferings", availableOfferings);

        return result;
    }

    static WritableMap mapOffering(QOffering offering) {
        WritableMap result = Arguments.createMap();
        result.putString("id", offering.getOfferingID());

        Integer tagValue = offering.getTag().getTag();
        if (tagValue != null) {
            result.putInt("tag", tagValue);
        }

        WritableArray convertedProducts = Arguments.createArray();

        for (QProduct product : offering.getProducts()) {
            WritableMap convertedProduct = EntitiesConverter.mapProduct(product);
            convertedProducts.pushMap(convertedProduct);
        }

        result.putArray("products", convertedProducts);

        return result;
    }

    static WritableArray mapEligibility(Map<String, QEligibility> eligibilities) {
        WritableArray result = Arguments.createArray();

        for (Map.Entry<String, QEligibility> entry : eligibilities.entrySet()) {
            WritableMap convertedEligibility = Arguments.createMap();
            QEligibility eligibility = entry.getValue();
            convertedEligibility.putString("productId", entry.getKey());
            convertedEligibility.putString("status", eligibility.getStatus().getType());

            result.pushMap(convertedEligibility);
        }

        return result;
    }

    static WritableArray mapExperiments(Map<String, QExperimentInfo> experiments) {
        WritableArray result = Arguments.createArray();

        for (Map.Entry<String, QExperimentInfo> entry : experiments.entrySet()) {
            QExperimentInfo experimentInfo = entry.getValue();

            WritableMap convertedExperimentInfo = Arguments.createMap();
            WritableMap convertedExperimentGroup = Arguments.createMap();
            convertedExperimentGroup.putInt("type", 0);

            convertedExperimentInfo.putString("id", experimentInfo.getExperimentID());
            convertedExperimentInfo.putMap("group", convertedExperimentGroup);

            result.pushMap(convertedExperimentInfo);
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

    static WritableMap mapActionResult(QActionResult actionResult) {
        final WritableMap result = Arguments.createMap();
        result.putString("type", actionResult.getType().getType());
        result.putMap("error", EntitiesConverter.mapQonversionError(actionResult.getError()));
        result.putMap("value", mapStringsMap(actionResult.getValue()));
        return result;
    }

    static WritableMap mapAutomationsEvent(AutomationsEvent automationsEvent) {
        final WritableMap result = Arguments.createMap();
        result.putString("type", automationsEvent.getType().getType());
        result.putDouble("timestamp", (double)automationsEvent.getDate().getTime());
        return result;
    }

    static WritableMap mapQonversionError(@Nullable QonversionError error) {
        if (error == null) {
            return null;
        }

        final WritableMap result = Arguments.createMap();
        result.putString("description", error.getDescription());
        result.putString("additionalMessage", error.getAdditionalMessage());
        return result;
    }

    static WritableMap mapStringsMap(@Nullable Map<String, String> map) {
        if (map == null) {
            return null;
        }
        final WritableMap result = Arguments.createMap();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            result.putString(entry.getKey(), entry.getValue());
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
