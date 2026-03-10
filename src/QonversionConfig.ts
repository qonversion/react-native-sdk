import {EntitlementsCacheLifetime, Environment, LaunchMode} from './dto/enums';
import type {EntitlementsUpdateListener} from './dto/EntitlementsUpdateListener';
import type {DeferredPurchasesListener} from './dto/DeferredPurchasesListener';

class QonversionConfig {
  readonly projectKey: string;
  readonly launchMode: LaunchMode;
  readonly environment: Environment;
  readonly entitlementsCacheLifetime: EntitlementsCacheLifetime;
  /** @deprecated Use {@link deferredPurchasesListener} instead. */
  readonly entitlementsUpdateListener: EntitlementsUpdateListener | undefined;
  readonly proxyUrl: string | undefined;
  readonly kidsMode: boolean;
  readonly deferredPurchasesListener: DeferredPurchasesListener | undefined;

  constructor(
    projectKey: string,
    launchMode: LaunchMode,
    environment: Environment = Environment.PRODUCTION,
    entitlementsCacheLifetime: EntitlementsCacheLifetime = EntitlementsCacheLifetime.MONTH,
    entitlementsUpdateListener: EntitlementsUpdateListener | undefined = undefined,
    proxyUrl: string | undefined = undefined,
    kidsMode: boolean = false,
    deferredPurchasesListener: DeferredPurchasesListener | undefined = undefined,
  ) {
    this.projectKey = projectKey;
    this.launchMode = launchMode;
    this.environment = environment;
    this.entitlementsCacheLifetime = entitlementsCacheLifetime;
    this.entitlementsUpdateListener = entitlementsUpdateListener;
    this.proxyUrl = proxyUrl;
    this.kidsMode = kidsMode;
    this.deferredPurchasesListener = deferredPurchasesListener;
  }
}

export default QonversionConfig;
