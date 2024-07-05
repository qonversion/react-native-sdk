import {Platform} from "react-native";

export const isIos = (): boolean => {
    return Platform.OS === "ios"
};

export const isAndroid = (): boolean => {
    return Platform.OS === "android"
};
