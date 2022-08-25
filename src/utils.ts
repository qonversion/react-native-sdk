import {Property} from "./enums";
import {Platform} from "react-native";

export const isIos = (): boolean => {
    return Platform.OS === "ios"
}

export const isAndroid = (): boolean => {
    return Platform.OS === "android"
}

const propertyKeyMap = {
    [Property.EMAIL]: "EMAIL",
    [Property.NAME]: "NAME",
    [Property.APPS_FLYER_USER_ID]: "APPS_FLYER_USER_ID",
    [Property.ADJUST_USER_ID]: "ADJUST_USER_ID",
    [Property.KOCHAVA_DEVICE_ID]: "KOCHAVA_DEVICE_ID",
    [Property.CUSTOM_USER_ID]: "CUSTOM_USER_ID",
    [Property.FACEBOOK_ATTRIBUTION]: "FACEBOOK_ATTRIBUTION", // android only
    [Property.ADVERTISING_ID]: "ADVERTISING_ID", // ios only
    [Property.FIREBASE_APP_INSTANCE_ID]: "FIREBASE_APP_INSTANCE_ID"
};

export const convertPropertyToNativeKey = (property: Property): string => {
    return propertyKeyMap[property]
}