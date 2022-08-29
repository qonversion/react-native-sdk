import {Property, Provider} from "./enums";
import {Platform} from "react-native";

export const isIos = (): boolean => {
    return Platform.OS === "ios"
}

export const isAndroid = (): boolean => {
    return Platform.OS === "android"
}

const propertyKeyMap = {
    [Property.EMAIL]: "Email",
    [Property.NAME]: "Name",
    [Property.APPS_FLYER_USER_ID]: "AppsFlyerUserId",
    [Property.ADJUST_USER_ID]: "AdjustAdId",
    [Property.KOCHAVA_DEVICE_ID]: "KochavaDeviceId",
    [Property.CUSTOM_USER_ID]: "CustomUserId",
    [Property.FACEBOOK_ATTRIBUTION]: "FacebookAttribution", // android only
    [Property.ADVERTISING_ID]: "AdvertisingId", // ios only
    [Property.FIREBASE_APP_INSTANCE_ID]: "FirebaseAppInstanceId"
};

export const convertPropertyToNativeKey = (property: Property): string => {
    return propertyKeyMap[property]
}

const providerKeyMap = {
    [Provider.APPSFLYER]: "AppsFlyer",
    [Provider.BRANCH]: "Branch",
    [Provider.ADJUST]: "Adjust",
    [Provider.APPLE]: "AppleSearchAds", // ios only
};

export const convertProviderToNativeKey = (provider: Provider): string => {
    return providerKeyMap[provider]
}

export enum DefinedNativeErrorCodes {
    PURCHASE_CANCELLED_BY_USER = "PURCHASE_CANCELLED_BY_USER"
}