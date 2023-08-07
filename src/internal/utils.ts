import {Platform} from "react-native";

export const isIos = (): boolean => {
    return Platform.OS === "ios"
};

export const isAndroid = (): boolean => {
    return Platform.OS === "android"
};

export enum DefinedNativeErrorCodes {
    PURCHASE_CANCELLED_BY_USER = "PURCHASE_CANCELLED_BY_USER"
}
