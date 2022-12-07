import Entitlement from './dto/Entitlement';
import Product from './dto/Product';
import {UserProperty, ProrationMode, AttributionProvider} from './dto/enums';
import Offerings from './dto/Offerings';
import IntroEligibility from './dto/IntroEligibility';
import User from './dto/User';
import {EntitlementsUpdateListener} from './dto/EntitlementsUpdateListener';
import {PromoPurchasesListener} from './dto/PromoPurchasesListener';

interface QonversionApi {

  /**
   * Make a purchase and validate it through server-to-server using Qonversion's Backend
   *
   * @param productId Qonversion product identifier for purchase
   * @returns the promise with the user entitlements including the ones obtained by the purchase
   */
  purchase(productId: string): Promise<Map<string, Entitlement>>;

  /**
   * Make a purchase and validate it through server-to-server using Qonversion's Backend
   *
   * @param product - Qonversion's {@link Product} object
   * @returns the promise with the user entitlements including the ones obtained by the purchase
   */
  purchaseProduct(product: Product): Promise<Map<string, Entitlement>>;

  /**
   * Android only. Returns `null` if called on iOS.
   *
   * Update (upgrade/downgrade) subscription on Google Play Store and validate it through server-to-server using Qonversion's Backend
   *
   * @param productId Qonversion product identifier for purchase
   * @param oldProductId Qonversion product identifier from which the upgrade/downgrade will be initialized
   * @param prorationMode proration mode
   * @returns the promise with the user entitlements including updated ones.
   *
   * @see [Google Play Documentation](https://developer.android.com/google/play/billing/subscriptions#upgrade-downgrade)
   * for more details.
   * @see [Proration mode](https://developer.android.com/google/play/billing/subscriptions#proration)
   * @see [Product Center](https://qonversion.io/docs/product-center)
   */
  updatePurchase(
    productId: string,
    oldProductId: string,
    prorationMode: ProrationMode | undefined
  ): Promise<Map<string, Entitlement> | null>;

  /**
   * Android only. Returns `null` if called on iOS.
   *
   * Update (upgrade/downgrade) subscription on Google Play Store and validate it through server-to-server using Qonversion's Backend
   *
   * @param product Qonversion product for purchase
   * @param oldProductId Qonversion product identifier from which the upgrade/downgrade will be initialized
   * @param prorationMode proration mode
   * @returns the promise with the user entitlements including updated ones
   *
   * @see [Google Play Documentation](https://developer.android.com/google/play/billing/subscriptions#upgrade-downgrade)
   * for more details.
   * @see [Proration mode](https://developer.android.com/google/play/billing/subscriptions#proration)
   * @see [Product Center](https://qonversion.io/docs/product-center)
   */
  updatePurchaseWithProduct(
    product: Product,
    oldProductId: String,
    prorationMode: ProrationMode | undefined
  ): Promise<Map<string, Entitlement> | null>;

  /**
   * Returns Qonversion products in association with Apple and Google Play Store Products.
   *
   * @returns the promise with Qonversion products
   *
   * @see [Product Center](https://qonversion.io/docs/product-center)
   */
  products(): Promise<Map<string, Product>>;

  /**
   * Return Qonversion Offerings Object.
   *
   * An offering is a group of products that you can offer to a user on a given paywall based on your business logic.
   * For example, you can offer one set of products on a paywall immediately after onboarding and another
   * set of products with discounts later on if a user has not converted.
   * Offerings allow changing the products offered remotely without releasing app updates.
   *
   * @returns the promise with Qonversion offerings
   *
   * @see [Offerings](https://qonversion.io/docs/offerings) for more details
   * @see [Product Center](https://qonversion.io/docs/product-center) for more details
   */
  offerings(): Promise<Offerings | null>;

  /**
   * You can check if a user is eligible for an introductory offer, including a free trial.
   * You can show only a regular price for users who are not eligible for an introductory offer.
   *
   * @param ids products identifiers that must be checked
   * @returns the promise with eligibility map
   */
  checkTrialIntroEligibility(ids: string[]): Promise<Map<string, IntroEligibility>>;

  /**
   * You need to call the checkEntitlements method to check if a user has the required entitlement.
   *
   * This method will check the user receipt and will return the current entitlements.
   *
   * @returns the promise with the entitlements
   *
   * If Apple or Google servers are not responding at the time of the request, Qonversion provides the latest
   * entitlements' data from its database.
   */
  checkEntitlements(): Promise<Map<string, Entitlement>>;

  /**
   * Restores users purchases in your app, to maintain access to purchased content.
   * Users sometimes need to restore purchased content, such as when they upgrade to a new phone.
   *
   * @returns the promise with the user entitlements
   */
  restore(): Promise<Map<string, Entitlement>>;

  /**
   * Android only. Does nothing if called on iOS.
   *
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
  syncPurchases(): void;

  /**
   * Call this function to link a user to his unique ID in your system and share purchase data.
   *
   * @param userID unique user ID in your system
   */
  identify(userID: string): void;

  /**
   * Call this function to unlink a user from his unique ID in your system and his purchase data.
   */
  logout(): void;

  /**
   * This method returns information about the current Qonversion user.
   * @returns the promise with the information about the user.
   */
  userInfo(): Promise<User>;

  /**
   * Sends your attribution {@link data} to the {@link provider}.
   *
   * @param data an object containing your attribution data
   * @param provider the provider to which the data will be sent
   */
  attribution(data: Object, provider: AttributionProvider): void;

  /**
   * Sets Qonversion reserved user {@link property}, like email or one-signal id
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
  setProperty(property: UserProperty, value: string): void;

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
  setUserProperty(property: string, value: string): void;

  /**
   * Provide a listener to be notified about asynchronous user entitlements updates.
   *
   * Make sure you provide this listener for being up-to-date with the user entitlements.
   * Else you can lose some important updates. Also, please, consider that this listener
   * should live for the whole lifetime of the application.
   *
   * You may set entitlements listener both *after* Qonversion SDK initializing
   * with {@link QonversionApi.setEntitlementsUpdateListener} and *while* Qonversion initializing
   * with {@link Qonversion.initialize}.
   *
   * @param listener listener to be called when entitlements update
   */
  setEntitlementsUpdateListener(listener: EntitlementsUpdateListener): void;

  /**
   * iOS only. Does nothing if called on Android.
   *
   * On iOS 14.5+, after requesting the app tracking permission using ATT, you need to notify Qonversion if tracking
   * is allowed and IDFA is available.
   */
  collectAdvertisingId(): void;

  /**
   * iOS only. Does nothing if called on Android.
   *
   * Enable attribution collection from Apple Search Ads.
   */
  collectAppleSearchAdsAttribution(): void;

  /**
   * iOS only. Does nothing if called on Android.
   *
   * Set the delegate to handle promo purchases.
   * The delegate is called when a promo purchase from the App Store happens.
   * @param delegate delegate to be called when event happens.
   */
  setPromoPurchasesDelegate(delegate: PromoPurchasesListener): void;

  /**
   * iOS only. Does nothing if called on Android.
   *
   * On iOS 14.0+ shows up a sheet for users to redeem App Store offer codes.
   */
  presentCodeRedemptionSheet(): void;
}

export default QonversionApi;
