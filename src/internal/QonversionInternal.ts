import {NativeEventEmitter, NativeModules} from "react-native";
import {AttributionProvider, QonversionErrorCode, UserPropertyKey} from "../dto/enums";
import IntroEligibility from "../dto/IntroEligibility";
import Mapper, {QEntitlement} from "./Mapper";
import Offerings from "../dto/Offerings";
import Entitlement from "../dto/Entitlement";
import Product from "../dto/Product";
import {isAndroid, isIos} from "./utils";
import {EntitlementsUpdateListener} from '../dto/EntitlementsUpdateListener';
import {PromoPurchasesListener} from '../dto/PromoPurchasesListener';
import User from '../dto/User';
import PurchaseOptions from '../dto/PurchaseOptions';
import SKProductDiscount from '../dto/storeProducts/SKProductDiscount';
import QonversionApi from '../QonversionApi';
import QonversionConfig from '../QonversionConfig';
import RemoteConfig from "../dto/RemoteConfig";
import UserProperties from '../dto/UserProperties';
import PurchaseModel from '../dto/PurchaseModel';
import PurchaseUpdateModel from '../dto/PurchaseUpdateModel';
import {RemoteConfigList} from '../index';
import PurchaseOptionsBuilder from "../dto/PurchaseOptionsBuilder";
import PromotionalOffer from '../dto/PromotionalOffer';

const {RNQonversion} = NativeModules;

const sdkVersion = "8.2.3";

const EVENT_ENTITLEMENTS_UPDATED = "entitlements_updated";
const EVENT_PROMO_PURCHASE_RECEIVED = "promo_purchase_received";

export default class QonversionInternal implements QonversionApi {

  constructor(qonversionConfig: QonversionConfig) {
    RNQonversion.storeSDKInfo("rn", sdkVersion);
    RNQonversion.initializeSdk(
      qonversionConfig.projectKey,
      qonversionConfig.launchMode,
      qonversionConfig.environment,
      qonversionConfig.entitlementsCacheLifetime,
      qonversionConfig.proxyUrl,
      qonversionConfig.kidsMode
    );

    if (qonversionConfig.entitlementsUpdateListener) {
      this.setEntitlementsUpdateListener(qonversionConfig.entitlementsUpdateListener);
    }
  }

  syncHistoricalData () {
    RNQonversion.syncHistoricalData();
  }

  syncStoreKit2Purchases() {
    if (isIos()) {
      RNQonversion.syncStoreKit2Purchases();
    }
  }

  async isFallbackFileAccessible(): Promise<Boolean> {
    const isAccessibleResult = await RNQonversion.isFallbackFileAccessible();

    return isAccessibleResult.success;
  }

  async getPromotionalOffer(product: Product, discount: SKProductDiscount): Promise<PromotionalOffer | null> {
    if (isAndroid()) {
      return null;
    }
    const promoOffer = await RNQonversion.getPromotionalOffer(product.qonversionID, discount.identifier);
    const mappedPromoOffer: PromotionalOffer | null = Mapper.convertPromoOffer(promoOffer);

    return mappedPromoOffer;
  }

  async purchaseProduct(product: Product, options: PurchaseOptions | undefined): Promise<Map<string, Entitlement>> {
    try {
      if (!options) {
        options = new PurchaseOptionsBuilder().build();
      }

      let purchasePromise: Promise<Record<string, QEntitlement> | null | undefined>;
      const promoOffer = {
        productDiscountId: options.promotionalOffer?.productDiscount.identifier,
        keyIdentifier: options.promotionalOffer?.paymentDiscount.keyIdentifier,
        nonce: options.promotionalOffer?.paymentDiscount.nonce,
        signature: options.promotionalOffer?.paymentDiscount.signature,
        timestamp: options.promotionalOffer?.paymentDiscount.timestamp
      };

      if (isIos()) {
        purchasePromise = RNQonversion.purchase(product.qonversionID, options.quantity, options.contextKeys, promoOffer);
      } else {
        purchasePromise = RNQonversion.purchase(
            product.qonversionID,
            options.offerId,
            options.applyOffer,
            options.oldProduct?.qonversionID,
            options.updatePolicy,
            options.contextKeys
        );
      }
      const entitlements = await purchasePromise;

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions = Mapper.convertEntitlements(entitlements);

      return mappedPermissions;
    } catch (e) {
      e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
      throw e;
    }
  }

  async purchase(purchaseModel: PurchaseModel): Promise<Map<string, Entitlement>> {
    try {
      let purchasePromise: Promise<Record<string, QEntitlement> | null | undefined>;
      if (isIos()) {
        purchasePromise = RNQonversion.purchase(purchaseModel.productId, 1, null, null);
      } else {
        purchasePromise = RNQonversion.purchase(
          purchaseModel.productId,
          purchaseModel.offerId,
          purchaseModel.applyOffer,
          null,
          null,
          null
        );
      }
      const entitlements = await purchasePromise;

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions = Mapper.convertEntitlements(entitlements);

      return mappedPermissions;
    } catch (e) {
      e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
      throw e;
    }
  }

  async updatePurchase(purchaseUpdateModel: PurchaseUpdateModel): Promise<Map<string, Entitlement> | null> {
    if (!isAndroid()) {
      return null;
    }

    try {
      const entitlements = await RNQonversion.updatePurchase(
        purchaseUpdateModel.productId,
        purchaseUpdateModel.offerId,
        purchaseUpdateModel.applyOffer,
        purchaseUpdateModel.oldProductId,
        purchaseUpdateModel.updatePolicy,
        null
      );

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements);

      return mappedPermissions;
    } catch (e) {
      e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
      throw e;
    }
  }

  async products(): Promise<Map<string, Product>> {
    let products = await RNQonversion.products();
    const mappedProducts: Map<string, Product> = Mapper.convertProducts(
      products
    );

    return mappedProducts;
  }

  async offerings(): Promise<Offerings | null> {
    let offerings = await RNQonversion.offerings();
    const mappedOfferings = Mapper.convertOfferings(offerings);

    return mappedOfferings;
  }

  async checkTrialIntroEligibility(
    ids: string[]
  ): Promise<Map<string, IntroEligibility>> {
    const eligibilityInfo = await RNQonversion.checkTrialIntroEligibilityForProductIds(ids);

    const mappedEligibility: Map<
      string,
      IntroEligibility
    > = Mapper.convertEligibility(eligibilityInfo);

    return mappedEligibility;
  }

  async checkEntitlements(): Promise<Map<string, Entitlement>> {
    const entitlements = await RNQonversion.checkEntitlements();
    const mappedPermissions: Map<
      string,
      Entitlement
    > = Mapper.convertEntitlements(entitlements);

    return mappedPermissions;
  }

  async restore(): Promise<Map<string, Entitlement>> {
    const entitlements = await RNQonversion.restore();

    const mappedPermissions: Map<
      string,
      Entitlement
    > = Mapper.convertEntitlements(entitlements);

    return mappedPermissions;
  }

  syncPurchases() {
    if (!isAndroid()) {
      return;
    }

    RNQonversion.syncPurchases();
  }

  async identify(userID: string): Promise<User> {
    const userInfo = await RNQonversion.identify(userID);
    const mappedUserInfo: User = Mapper.convertUserInfo(userInfo);

    return mappedUserInfo;
  }

  logout() {
    RNQonversion.logout();
  }

  async userInfo(): Promise<User> {
    const info = await RNQonversion.userInfo();
    const mappedUserInfo: User = Mapper.convertUserInfo(info);

    return mappedUserInfo;
  }

  attribution(data: Object, provider: AttributionProvider) {
    RNQonversion.addAttributionData(data, provider);
  }

  setUserProperty(property: UserPropertyKey, value: string) {
    if (property === UserPropertyKey.CUSTOM) {
      console.warn("Can not set user property with the key `UserPropertyKey.CUSTOM`. " +
        "To set custom user property, use the `setCustomUserProperty` method.");
      return;
    }

    RNQonversion.setDefinedProperty(property, value);
  }

  setCustomUserProperty(property: string, value: string) {
    RNQonversion.setCustomProperty(property, value);
  }

  async userProperties(): Promise<UserProperties> {
    const properties = await RNQonversion.userProperties();
    const mappedUserProperties: UserProperties = Mapper.convertUserProperties(properties);

    return mappedUserProperties;
  }

  collectAdvertisingId() {
    if (isIos()) {
      RNQonversion.collectAdvertisingID();
    }
  }

  collectAppleSearchAdsAttribution() {
    if (isIos()) {
      RNQonversion.collectAppleSearchAdsAttribution();
    }
  }

  setEntitlementsUpdateListener(listener: EntitlementsUpdateListener) {
    const eventEmitter = new NativeEventEmitter(RNQonversion);
    eventEmitter.removeAllListeners(EVENT_ENTITLEMENTS_UPDATED);
    eventEmitter.addListener(EVENT_ENTITLEMENTS_UPDATED, payload => {
      const entitlements = Mapper.convertEntitlements(payload);
      listener.onEntitlementsUpdated(entitlements);
    });
  }

  setPromoPurchasesDelegate(delegate: PromoPurchasesListener) {
    if (!isIos()) {
      return;
    }

    const eventEmitter = new NativeEventEmitter(RNQonversion);
    eventEmitter.removeAllListeners(EVENT_PROMO_PURCHASE_RECEIVED);
    eventEmitter.addListener(EVENT_PROMO_PURCHASE_RECEIVED, productId => {
      const promoPurchaseExecutor = async () => {
        const entitlements = await RNQonversion.promoPurchase(productId);
        const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements);
        return mappedPermissions;
      };
      delegate.onPromoPurchaseReceived(productId, promoPurchaseExecutor);
    });
  }

  presentCodeRedemptionSheet() {
    if (isIos()) {
      RNQonversion.presentCodeRedemptionSheet();
    }
  }

  async remoteConfig(contextKey: string | undefined): Promise<RemoteConfig> {
    const remoteConfig = await RNQonversion.remoteConfig(contextKey);
    const mappedRemoteConfig: RemoteConfig = Mapper.convertRemoteConfig(remoteConfig);

    return mappedRemoteConfig;
  }

  async remoteConfigList(): Promise<RemoteConfigList> {
    const remoteConfigList = await RNQonversion.remoteConfigList();
    const mappedRemoteConfigList: RemoteConfigList = Mapper.convertRemoteConfigList(remoteConfigList);

    return mappedRemoteConfigList;
  }

  async remoteConfigListForContextKeys(contextKeys: string[], includeEmptyContextKey: boolean): Promise<RemoteConfigList> {
    const remoteConfigList = await RNQonversion.remoteConfigListForContextKeys(contextKeys, includeEmptyContextKey);
    const mappedRemoteConfigList: RemoteConfigList = Mapper.convertRemoteConfigList(remoteConfigList);

    return mappedRemoteConfigList;
  }

  async attachUserToExperiment(experimentId: string, groupId: string): Promise<void> {
    await RNQonversion.attachUserToExperiment(experimentId, groupId);
    return;
  }

  async detachUserFromExperiment(experimentId: string): Promise<void> {
    await RNQonversion.detachUserFromExperiment(experimentId);
    return;
  }

  async attachUserToRemoteConfiguration(remoteConfigurationId: string): Promise<void> {
    await RNQonversion.attachUserToRemoteConfiguration(remoteConfigurationId);
    return;
  }

  async detachUserFromRemoteConfiguration(remoteConfigurationId: string): Promise<void> {
    await RNQonversion.detachUserFromRemoteConfiguration(remoteConfigurationId);
    return;
  }
}
