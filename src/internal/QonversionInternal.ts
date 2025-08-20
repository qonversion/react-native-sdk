import {AttributionProvider, QonversionErrorCode, UserPropertyKey} from "../dto/enums";
import IntroEligibility from "../dto/IntroEligibility";
import Mapper from "./Mapper";
import type {QEntitlement, QEligibilityInfo, QProduct} from "./Mapper";
import Offerings from "../dto/Offerings";
import Entitlement from "../dto/Entitlement";
import Product from "../dto/Product";
import {isAndroid, isIos} from "./utils";
import type {EntitlementsUpdateListener} from '../dto/EntitlementsUpdateListener';
import type {PromoPurchasesListener} from '../dto/PromoPurchasesListener';
import User from '../dto/User';
import PurchaseOptions from '../dto/PurchaseOptions';
import SKProductDiscount from '../dto/storeProducts/SKProductDiscount';
import type { QonversionApi } from '../QonversionApi';
import QonversionConfig from '../QonversionConfig';
import RemoteConfig from "../dto/RemoteConfig";
import UserProperties from '../dto/UserProperties';
import PurchaseModel from '../dto/PurchaseModel';
import PurchaseUpdateModel from '../dto/PurchaseUpdateModel';
import {RemoteConfigList} from '../index';
import PurchaseOptionsBuilder from "../dto/PurchaseOptionsBuilder";
import PromotionalOffer from '../dto/PromotionalOffer';
import RNQonversion from './specs/NativeQonversionModule';
import type { QPromoOfferDetails } from './specs/NativeQonversionModule';

export const sdkVersion = "9.0.2";
export const sdkSource = "rn";

export default class QonversionInternal implements QonversionApi {

  private entitlementsUpdateListener: EntitlementsUpdateListener | null = null;
  private promoPurchasesDelegate: PromoPurchasesListener | null = null;

  constructor(qonversionConfig: QonversionConfig) {
    RNQonversion.storeSDKInfo(sdkSource, sdkVersion);
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

  async isFallbackFileAccessible(): Promise<boolean> {
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

      let purchasePromise: Promise<Object | null | undefined>;
      const promoOffer: QPromoOfferDetails = {
        productDiscountId: options.promotionalOffer?.productDiscount.identifier,
        keyIdentifier: options.promotionalOffer?.paymentDiscount.keyIdentifier,
        nonce: options.promotionalOffer?.paymentDiscount.nonce,
        signature: options.promotionalOffer?.paymentDiscount.signature,
        timestamp: options.promotionalOffer?.paymentDiscount.timestamp
      };

      if (isIos()) {
        purchasePromise = RNQonversion.purchase(
          product.qonversionID,
          options.quantity,
          options.contextKeys,
          promoOffer,
          undefined,
          false,
          undefined,
          undefined,
        );
      } else {
        purchasePromise = RNQonversion.purchase(
            product.qonversionID,
            1,
            options.contextKeys,
            undefined,
            options.offerId,
            options.applyOffer,
            options.oldProduct?.qonversionID,
            options.updatePolicy,
        );
      }
      const entitlements = await purchasePromise;

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions = Mapper.convertEntitlements(entitlements as Record<string, QEntitlement>);

      return mappedPermissions;
    } catch (e: any) {
      e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
      throw e;
    }
  }

  async purchase(purchaseModel: PurchaseModel): Promise<Map<string, Entitlement>> {
    try {
      let purchasePromise: Promise<Object | null | undefined>;
      if (isIos()) {
        purchasePromise = RNQonversion.purchase(
          purchaseModel.productId,
          1,
          undefined,
          undefined,
          undefined,
          false,
          undefined,
          undefined,
        );
      } else {
        purchasePromise = RNQonversion.purchase(
          purchaseModel.productId,
          1,
          undefined,
          undefined,
          purchaseModel.offerId,
          purchaseModel.applyOffer,
          undefined,
          undefined
        );
      }
      const entitlements = await purchasePromise;

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions = Mapper.convertEntitlements(entitlements as Record<string, QEntitlement>);

      return mappedPermissions;
    } catch (e: any) {
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
      );

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements as Record<string, QEntitlement>);

      return mappedPermissions;
    } catch (e: any) {
      e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
      throw e;
    }
  }

  async products(): Promise<Map<string, Product>> {
    let products = await RNQonversion.products();
    const mappedProducts: Map<string, Product> = Mapper.convertProducts(products as Record<string, QProduct>);

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

    const mappedEligibility: Map<string, IntroEligibility> = Mapper.convertEligibility(eligibilityInfo as Record<string, QEligibilityInfo>);

    return mappedEligibility;
  }

  async checkEntitlements(): Promise<Map<string, Entitlement>> {
    const entitlements = await RNQonversion.checkEntitlements();
    const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements as Record<string, QEntitlement>);

    return mappedPermissions;
  }

  async restore(): Promise<Map<string, Entitlement>> {
    const entitlements = await RNQonversion.restore();

    const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements as Record<string, QEntitlement>);

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
      RNQonversion.collectAdvertisingId();
    }
  }

  collectAppleSearchAdsAttribution() {
    if (isIos()) {
      RNQonversion.collectAppleSearchAdsAttribution();
    }
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

  private entitlementsUpdatedEventHandler = (payload: Object) => {
    const entitlements = Mapper.convertEntitlements(payload as Record<string, QEntitlement>);
    this.entitlementsUpdateListener?.onEntitlementsUpdated(entitlements);
  }

  private promoPurchaseReceivedEventHandler = (productId: string) => {
    const promoPurchaseExecutor = async () => {
      const entitlements = await RNQonversion.promoPurchase(productId);
      const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements as Record<string, QEntitlement>);
      return mappedPermissions;
    };
    this.promoPurchasesDelegate?.onPromoPurchaseReceived(productId, promoPurchaseExecutor);
  }

  setEntitlementsUpdateListener(listener: EntitlementsUpdateListener) {
    if (this.entitlementsUpdateListener == null) {
      RNQonversion.onEntitlementsUpdated(this.entitlementsUpdatedEventHandler);
    }
    
    this.entitlementsUpdateListener = listener;
  }

  setPromoPurchasesDelegate(delegate: PromoPurchasesListener) {
    if (!isIos()) {
      return;
    }

    if (this.promoPurchasesDelegate == null) {
      RNQonversion.onPromoPurchaseReceived(this.promoPurchaseReceivedEventHandler);
    }

    this.promoPurchasesDelegate = delegate;
  }
}
