import {NativeModules, Platform} from "react-native";
import {Property, ProrationMode, Provider} from "../enums";
import ExperimentInfo from "./ExperimentInfo";
import IntroEligibility from "./IntroEligibility";
import LaunchResult from "./LaunchResult";
import Mapper from "./Mapper";
import Offerings from "./Offerings";
import Permission from "./Permission";
import Product from "./Product";
import {convertPropertyToNativeKey, isIos} from "../utils";

const {RNQonversion} = NativeModules;

const keyPrefix = "com.qonversion.keys";
const sourceKey = keyPrefix + ".source";
const versionKey = keyPrefix + ".sourceVersion";
const sdkVersion = "3.1.1";

export default class Qonversion {
  /**
   * Initializes Qonversion SDK with the given API ${@link key}.
   * You can get one in your account on https://dash.qonversion.io.
   *
   * @param key project key to setup the SDK.
   * @param observerMode set true if you are using observer mode only.
   * @returns the promise with the launch result.
   *
   * @see [Observer mode](https://documentation.qonversion.io/docs/how-qonversion-works)
   * @see [Installing the Android SDK](https://qonversion.io/docs/google)
   */
  static async launchWithKey(
    key: string,
    observerMode: boolean = false
  ): Promise<LaunchResult> {
    RNQonversion.storeSDKInfo(sourceKey, "rn", versionKey, sdkVersion);
    const response = await RNQonversion.launchWithKey(key, observerMode);
    const launchResult = Mapper.convertLaunchResult(response);

    return launchResult;
  }

  /**
   * Call this function to link a user to his unique ID in your system and share purchase data.
   *
   * @param userID unique user ID in your system.
   */
  static identify(userID: string) {
    RNQonversion.identify(userID);
  }

  /**
   * Call this function to unlink a user from his unique ID in your system and his purchase data.
   */
  static logout() {
    RNQonversion.logout();
  }

  /**
   * Sets user property for pre-defined case {@link property}.
   *
   * User properties are attributes you can set on a user level.
   * You can send user properties to third party platforms as well as use them in Qonversion for customer segmentation
   * and analytics.
   *
   * @param property defined enum key that will be transformed to string.
   * @param value property value.
   *
   * @see [documentation](https://documentation.qonversion.io/docs/user-properties)
   */
  static setProperty(property: Property, value: string) {
    const key = convertPropertyToNativeKey(property)

    if (key) {
      RNQonversion.setProperty(key, value);
    }
  }

  /**
   * Adds custom user {@link property}.
   *
   * User properties are attributes you can set on a user level.
   * You can send user properties to third party platforms as well as use them in Qonversion for customer segmentation
   * and analytics.
   *
   * @param property custom user property key.
   * @param value property value.
   *
   * @see [documentation](https://documentation.qonversion.io/docs/user-properties)
   */
  static setUserProperty(property: string, value: string) {
    RNQonversion.setUserProperty(property, value);
  }

  /**
   * Qonversion SDK provides an asynchronous method to set your side User ID that can be used to match users in
   * third-party integrations.
   *
   * @param userId your database user ID.
   *
   * @see [documentation](https://documentation.qonversion.io/docs/user-identifiers)
   *
   * @deprecated Will be removed in a future major release. Use {@link setProperty} with {@link Property.CUSTOM_USER_ID}
   * instead
   */
  static setUserId(userId: string) {
    this.setProperty(Property.CUSTOM_USER_ID, userId);
  }

  /**
   * Sends your attribution {@link data} to the {@link provider}.
   *
   * @param data an object containing your attribution data.
   * @param provider the provider to which the data will be sent.
   */
  static addAttributionData(data: Object, provider: Provider) {
    RNQonversion.addAttributionData(data, provider);
  }

  /**
   * You need to call the checkPermissions method at the start of your app to check if a user has the required
   * permission.
   *
   * This method will check the user receipt and will return the current permissions.
   *
   * @returns the promise with the permissions.
   *
   * If Apple or Google servers are not responding at the time of the request, Qonversion provides the latest
   * permissions data from its database.
   */
  static async checkPermissions(): Promise<Map<string, Permission>> {
    const permissions = await RNQonversion.checkPermissions();
    const mappedPermissions: Map<
      string,
      Permission
    > = Mapper.convertPermissions(permissions);

    return mappedPermissions;
  }

  /**
   * Starts a process of purchasing a product with the specified identifier.
   *
   * @throws exception in case of error in purchase flow.
   * @param productId Qonversion product identifier for purchase.
   * @returns the promise with the user permissions including the ones obtained by the purchase.
   */
  static async purchase(productId: string): Promise<Map<string, Permission>> {
    return this.purchaseProxy(productId);
  }

  /**
   * Starts a process of purchasing product with Qonversion's {@link Product} object.
   *
   * @param product - Qonversion's {@link Product} object
   * @returns { Promise<Map<string, Permission>> } A map of available permissions
   */
  static async purchaseProduct(product: Product): Promise<Map<string, Permission>> {
    return this.purchaseProxy(product.qonversionID, product.offeringId);
  }

  private static async purchaseProxy(productId: string, offeringId: string | null = null): Promise<Map<string, Permission>> {
    try {
      const purchasePromise = !!offeringId ?
          RNQonversion.purchaseProduct(productId, offeringId)
          :
          RNQonversion.purchase(productId);

      const permissions = await purchasePromise;

      const mappedPermissions = Mapper.convertPermissions(permissions);

      return mappedPermissions;
    } catch (e) {
      const iOSCancelCode = "1";
      const iOSCancelErrorDomain = "com.qonversion.io";
      const androidCancelCode = "CanceledPurchase";
      e.userCanceled =
        (isIos() &&
          e.domain === iOSCancelErrorDomain &&
          e.code === iOSCancelCode) ||
        (!isIos() && e.code === androidCancelCode);

      throw e;
    }
  }

  /**
   * Android only. Returns `null` if called on iOS.
   *
   * Upgrading, downgrading, or changing a subscription on Google Play Store requires calling updatePurchase() function.
   *
   * @param productId Qonversion product identifier for purchase.
   * @param oldProductId Qonversion product identifier from which the upgrade/downgrade will be initialized.
   * @param prorationMode proration mode.
   * @returns the promise with the user permissions including updated ones.
   *
   * @see [Google Play Documentation](https://developer.android.com/google/play/billing/subscriptions#upgrade-downgrade)
   * for more details.
   * @see [Proration mode](https://developer.android.com/google/play/billing/subscriptions#proration)
   * @see [Product Center](https://qonversion.io/docs/product-center)
   */
  static async updatePurchase(
    productId: string,
    oldProductId: string,
    prorationMode: ProrationMode | null = null
  ): Promise<Map<string, Permission> | null> {
    if (isIos()) {
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

  /**
   * Returns Qonversion products in association with Apple and Google Play Store Products.
   *
   * @returns the promise with Qonversion products.
   *
   * @see [Product Center](https://qonversion.io/docs/product-center)
   */
  static async products(): Promise<Map<string, Product>> {
    let products = await RNQonversion.products();
    const mappedProducts: Map<string, Product> = Mapper.convertProducts(
      products
    );

    return mappedProducts;
  }

  /**
   * Return Qonversion Offerings Object.
   *
   * An offering is a group of products that you can offer to a user on a given paywall based on your business logic.
   * For example, you can offer one set of products on a paywall immediately after onboarding and another
   * set of products with discounts later on if a user has not converted.
   * Offerings allow changing the products offered remotely without releasing app updates.
   *
   * @returns the promise with Qonversion offerings.
   *
   * @see [Offerings](https://qonversion.io/docs/offerings) for more details.
   * @see [Product Center](https://qonversion.io/docs/product-center) for more details.
   */
  static async offerings(): Promise<Offerings | null> {
    let offerings = await RNQonversion.offerings();
    const mappedOfferings = Mapper.convertOfferings(offerings);

    return mappedOfferings;
  }

  /**
   * Restoring purchases restores users purchases in your app, to maintain access to purchased content.
   * Users sometimes need to restore purchased content, such as when they upgrade to a new phone.
   *
   * @returns the promise with the user permissions.
   */
  static async restore(): Promise<Map<string, Permission>> {
    const permissions = await RNQonversion.restore();

    const mappedPermissions: Map<
      string,
      Permission
    > = Mapper.convertPermissions(permissions);

    return mappedPermissions;
  }

  /**
   * You can check if a user is eligible for an introductory offer, including a free trial.
   * You can show only a regular price for users who are not eligible for an introductory offer.
   *
   * @param ids products identifiers that must be checked.
   * @returns the promise with eligibility map.
   */
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

  /**
   * This method will send all purchases to the Qonversion backend. Call this every time when purchase is handled
   * by your own implementation.
   *
   * **Warning!**
   *
   * This method works for Android only.
   * It should only be called if you're using Qonversion SDK in observer mode.
   *
   * @see [Observer mode for Android SDK](https://documentation.qonversion.io/docs/observer-mode#android-sdk)
   */
  static syncPurchases() {
    if (isIos()) {
      return;
    }

    RNQonversion.syncPurchases();
  }

  /**
   * You can set the flag to distinguish sandbox and production users.
   * To see the sandbox users turn on the Viewing test Data toggle on Qonversion Dashboard
   */
  static setDebugMode() {
    RNQonversion.setDebugMode();
  }

  /**
   * Call this function to reset user ID and generate new anonymous user ID.
   * Call this function before Qonversion.launchWithKey()
   *
   * @deprecated This function was used in debug mode only. You can reinstall the app if you need to reset the user ID.
   */
  static resetUser() {}

  /**
   * iOS only. Returns `null` if called on Android.
   * On iOS 14.5+, after requesting the app tracking permission using ATT, you need to notify Qonversion if tracking
   * is allowed and IDFA is available.
   */
  static setAdvertisingID() {
    if (isIos()) {
      RNQonversion.setAdvertisingID();
    }
  }

  /**
   * Enable attribution collection from Apple Search Ads. False by default.
   */
  static setAppleSearchAdsAttributionEnabled(enabled: boolean) {
    if (isIos()) {
      RNQonversion.setAppleSearchAdsAttributionEnabled(enabled);
    }
  }

  /**
   * Set push token to Qonversion to enable Qonversion push notifications
   * @param token Firebase device token on Android. APNs device token on iOS.
   */
  static setNotificationsToken(token: string) {
    RNQonversion.setNotificationsToken(token);
  }
}
