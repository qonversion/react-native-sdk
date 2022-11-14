import {NativeEventEmitter, NativeModules} from "react-native";
import {Property, ProrationMode, Provider} from "../dto/enums";
import IntroEligibility from "../dto/IntroEligibility";
import Mapper from "./Mapper";
import Offerings from "../dto/Offerings";
import Entitlement from "../dto/Entitlement";
import Product from "../dto/Product";
import {
  convertPropertyToNativeKey,
  convertProviderToNativeKey,
  DefinedNativeErrorCodes,
  isAndroid,
  isIos
} from "./utils";
import {EntitlementsUpdateListener} from '../dto/EntitlementsUpdateListener';
import {PromoPurchasesListener} from '../dto/PromoPurchasesListener';
import User from '../dto/User';
import QonversionApi from '../QonversionApi';
import QonversionConfig from '../QonversionConfig';

const {RNQonversion} = NativeModules;

const sdkVersion = "3.6.2";

const EVENT_ENTITLEMENTS_UPDATED = "entitlements_updated";
const EVENT_PROMO_PURCHASE_RECEIVED = "promo_purchase_received";

export default class QonversionInternal implements QonversionApi {

  constructor(qonversionConfig: QonversionConfig) {
    RNQonversion.storeSDKInfo("rn", sdkVersion);
    RNQonversion.initializeSdk(
      qonversionConfig.projectKey,
      qonversionConfig.launchMode,
      qonversionConfig.environment,
      qonversionConfig.entitlementsCacheLifetime
    )

    if (qonversionConfig.entitlementsUpdateListener) {
      this.setEntitlementsUpdateListener(qonversionConfig.entitlementsUpdateListener)
    }
  }

  async purchase(productId: string): Promise<Map<string, Entitlement>> {
    return QonversionInternal.purchaseProxy(productId);
  }

  async purchaseProduct(product: Product): Promise<Map<string, Entitlement>> {
    return QonversionInternal.purchaseProxy(product.qonversionID, product.offeringId);
  }

  private static async purchaseProxy(productId: string, offeringId: string | null = null): Promise<Map<string, Entitlement>> {
    try {
      const purchasePromise = !!offeringId ?
          RNQonversion.purchaseProduct(productId, offeringId)
          :
          RNQonversion.purchase(productId);

      const entitlements = await purchasePromise;

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions = Mapper.convertEntitlements(entitlements);

      return mappedPermissions;
    } catch (e) {
      e.userCanceled = e.code === DefinedNativeErrorCodes.PURCHASE_CANCELLED_BY_USER;
      throw e;
    }
  }

  async updatePurchase(
    productId: string,
    oldProductId: string,
    prorationMode: ProrationMode | undefined
  ): Promise<Map<string, Entitlement> | null> {
    if (!isAndroid()) {
      return null;
    }

    try {
      let entitlements;
      if (!prorationMode) {
        entitlements = await RNQonversion.updatePurchase(productId, oldProductId);
      } else {
        entitlements = await RNQonversion.updatePurchaseWithProrationMode(
          productId,
          oldProductId,
          prorationMode
        );
      }

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements);

      return mappedPermissions;
    } catch (e) {
      e.userCanceled = e.code === DefinedNativeErrorCodes.PURCHASE_CANCELLED_BY_USER;
      throw e;
    }
  }

  async updatePurchaseWithProduct(
    product: Product,
    oldProductId: String,
    prorationMode: ProrationMode | undefined
  ): Promise<Map<string, Entitlement> | null> {
    if (!isAndroid()) {
      return null;
    }

    try {
      let entitlements;
      if (!prorationMode) {
        entitlements = await RNQonversion.updateProductWithId(product.qonversionID, product.offeringId, oldProductId);
      } else {
        entitlements = await RNQonversion.updateProductWithIdAndProrationMode(
          product.qonversionID,
          product.offeringId,
          oldProductId,
          prorationMode
        );
      }

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements);

      return mappedPermissions;
    } catch (e) {
      e.userCanceled = e.code === DefinedNativeErrorCodes.PURCHASE_CANCELLED_BY_USER;
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

  async checkTrialIntroEligibilityForProductIds(
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

  identify(userID: string) {
    RNQonversion.identify(userID);
  }

  logout() {
    RNQonversion.logout();
  }

  async userInfo(): Promise<User> {
    const info = await RNQonversion.userInfo();
    const mappedUserInfo: User = Mapper.convertUserInfo(info);

    return mappedUserInfo;
  }

  attribution(data: Object, provider: Provider) {
    const key = convertProviderToNativeKey(provider);

    if (key) {
      RNQonversion.addAttributionData(data, key);
    }
  }

  setProperty(property: Property, value: string) {
    const key = convertPropertyToNativeKey(property)

    if (key) {
      RNQonversion.setDefinedProperty(key, value);
    }
  }

  setUserProperty(property: string, value: string) {
    RNQonversion.setCustomProperty(property, value);
  }

  setAdvertisingID() {
    if (isIos()) {
      RNQonversion.setAdvertisingID();
    }
  }

  setAppleSearchAdsAttributionEnabled(enabled: boolean) {
    if (isIos()) {
      RNQonversion.setAppleSearchAdsAttributionEnabled(enabled);
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
}
