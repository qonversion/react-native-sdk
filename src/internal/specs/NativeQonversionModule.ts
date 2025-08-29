import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
import type { QPromotionalOffer, QOfferings, QUser, QUserProperties, QRemoteConfig, QRemoteConfigList } from '../Mapper';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export type QPromoOfferDetails = {
  productDiscountId: string | undefined,
  keyIdentifier: string | undefined,
  nonce: string | undefined,
  signature: string | undefined,
  timestamp: number | undefined,
}

export interface Spec extends TurboModule {
  storeSDKInfo(sdkName: string, sdkVersion: string): void;
  initializeSdk(
    projectKey: string,
    launchMode: string,
    environment: string,
    entitlementsCacheLifetime: string,
    proxyUrl: string | undefined,
    kidsMode: boolean
  ): void;
  syncHistoricalData(): void;
  syncStoreKit2Purchases(): void;
  isFallbackFileAccessible(): Promise<{success: boolean}>;
  getPromotionalOffer(product: string, discount: string | undefined): Promise<QPromotionalOffer | null>;
  purchase(
    productId: string,
    quantity: number, // iOS only
    contextKeys: string[] | null | undefined,
    promoOffer: QPromoOfferDetails | undefined, // iOS only
    offerId: string | null | undefined, // Android only
    applyOffer: boolean, // Android only
    oldProductId: string | null | undefined, // Android only
    updatePolicyKey: string | null | undefined, // Android only
  ): Promise<Object | null | undefined>; // Record<string, QEntitlement
  updatePurchase(
    productId: string,
    offerId: string | null | undefined,
    applyOffer: boolean,
    oldProductId: string | null | undefined,
    updatePolicyKey: string | null | undefined,
  ): Promise<Object>; // Android only // Record<string, QEntitlement>
  promoPurchase(productId: string): Promise<Object>; // iOS only / Record<string, QEntitlement
  products(): Promise<Object>; // Record<string, QProduct
  offerings(): Promise<QOfferings | null>;
  checkTrialIntroEligibilityForProductIds(ids: string[]): Promise<Object>; // Record<string, QEligibilityInfo>
  checkEntitlements(): Promise<Object>; // Record<string, QEntitlement>
  restore(): Promise<Object>; // Record<string, QEntitlement>
  syncPurchases(): void;
  identify(userID: string): Promise<QUser>;
  logout(): void;
  userInfo(): Promise<QUser>;
  addAttributionData(data: Object, provider: string): void;
  setDefinedProperty(property: string, value: string): void;
  setCustomProperty(property: string, value: string): void;
  userProperties(): Promise<QUserProperties>;
  collectAdvertisingId(): void; // iOS only
  collectAppleSearchAdsAttribution(): void; // iOS only
  presentCodeRedemptionSheet(): void; // iOS only
  remoteConfig(contextKey: string | undefined): Promise<QRemoteConfig>;
  remoteConfigList(): Promise<QRemoteConfigList>;
  remoteConfigListForContextKeys(contextKeys: string[], includeEmptyContextKey: boolean): Promise<QRemoteConfigList>;
  attachUserToExperiment(experimentId: string, groupId: string): Promise<void>;
  detachUserFromExperiment(experimentId: string): Promise<void>;
  attachUserToRemoteConfiguration(remoteConfigurationId: string): Promise<void>;
  detachUserFromRemoteConfiguration(remoteConfigurationId: string): Promise<void>;

  readonly onEntitlementsUpdated: EventEmitter<Object>; // Record<string, QEntitlement>
  readonly onPromoPurchaseReceived: EventEmitter<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNQonversion');
