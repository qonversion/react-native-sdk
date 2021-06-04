import { NativeModules, Platform } from "react-native";
import { Property, ProrationMode, Provider } from "../enums";
import ExperimentInfo from "./ExperimentInfo";
import IntroEligibility from "./IntroEligibility";
import LaunchResult from "./LaunchResult";
import Mapper from "./Mapper";
import Offerings from "./Offerings";
import Permission from "./Permission";
import Product from "./Product";

const { RNQonversion } = NativeModules;

const keyPrefix = "com.qonversion.keys";
const sourceKey = keyPrefix + ".source";
const versionKey = keyPrefix + ".sourceVersion";
const sdkVersion = "2.6.0";

export default class Qonversion {
  static async launchWithKey(
    key: string,
    observerMode: boolean = false
  ): Promise<LaunchResult> {
    RNQonversion.storeSDKInfo(sourceKey, "rn", versionKey, sdkVersion);
    const response = await RNQonversion.launchWithKey(key, observerMode);
    const launchResult = Mapper.convertLaunchResult(response);

    return launchResult;
  }

  static identify(userID: string) {
    RNQonversion.identify(userID);
  }

  static logout() {
    RNQonversion.logout();
  }

  static setProperty(property: Property, value: string) {
    RNQonversion.setProperty(property, value);
  }

  static setUserProperty(property: string, value: string) {
    RNQonversion.setUserProperty(property, value);
  }

  static setUserId(userId: string) {
    RNQonversion.setUserId(userId);
  }

  static addAttributionData(data: Object, provider: Provider) {
    RNQonversion.addAttributionData(data, provider);
  }

  static async checkPermissions(): Promise<Map<string, Permission>> {
    const permissions = await RNQonversion.checkPermissions();
    const mappedPermissions: Map<
      string,
      Permission
    > = Mapper.convertPermissions(permissions);

    return mappedPermissions;
  }

  static async purchase(productId: string): Promise<Map<string, Permission>> {
    try {
      const permissions = await RNQonversion.purchase(productId);
      const mappedPermissions = Mapper.convertPermissions(permissions);

      return mappedPermissions;
    } catch (e) {
      const isIOS = Platform.OS === "ios";
      const iOSCancelCode = "1";
      const iOSCancelErrorDomain = "com.qonversion.io";
      const androidCancelCode = "CanceledPurchase";
      e.userCanceled =
        (isIOS &&
          e.domain === iOSCancelErrorDomain &&
          e.code === iOSCancelCode) ||
        (!isIOS && e.code === androidCancelCode);

      throw e;
    }
  }

  static async updatePurchase(
    productId: string,
    oldProductId: string,
    prorationMode: ProrationMode | null = null
  ): Promise<Map<string, Permission> | null> {
    if (Platform.OS === "ios") {
      return null;
    }

    let permissions;
    if (prorationMode == null) {
      permissions = await RNQonversion.updatePurchase(productId, oldProductId);
    } else {
      permissions = await RNQonversion.updatePurchaseWithProrationMode(
        productId,
        oldProductId,
        prorationMode
      );
    }

    const mappedPermissions: Map<
      string,
      Permission
    > = Mapper.convertPermissions(permissions);

    return mappedPermissions;
  }

  static async products(): Promise<Map<string, Product>> {
    let products = await RNQonversion.products();
    const mappedProducts: Map<string, Product> = Mapper.convertProducts(
      products
    );

    return mappedProducts;
  }

  static async offerings(): Promise<Offerings | null> {
    let offerings = await RNQonversion.offerings();
    const mappedOfferings = Mapper.convertOfferings(offerings);

    return mappedOfferings;
  }

  static async restore(): Promise<Map<string, Permission>> {
    const permissions = await RNQonversion.restore();

    const mappedPermissions: Map<
      string,
      Permission
    > = Mapper.convertPermissions(permissions);

    return mappedPermissions;
  }

  static async checkTrialIntroEligibilityForProductIds(
    ids: string[]
  ): Promise<Map<string, IntroEligibility>> {
    const eligibilityInfo = await RNQonversion.checkTrialIntroEligibilityForProductIds(
      ids
    );

    const mappedEligibility: Map<
      string,
      IntroEligibility
    > = Mapper.convertEligibility(eligibilityInfo);

    return mappedEligibility;
  }

  static async experiments(): Promise<Map<string, ExperimentInfo>> {
    const experiments = await RNQonversion.experiments();

    const mappedExperiments: Map<
      string,
      ExperimentInfo
    > = Mapper.convertExperimentInfo(experiments);

    return mappedExperiments;
  }

  static syncPurchases() {
    if (Platform.OS === "ios") {
      return;
    }

    RNQonversion.syncPurchases();
  }

  static setDebugMode() {
    RNQonversion.setDebugMode();
  }

  static resetUser() {
    RNQonversion.resetUser();
  }

  static setAdvertisingID() {
    if (Platform.OS === "ios") {
      RNQonversion.setAdvertisingID();
    }
  }
}
