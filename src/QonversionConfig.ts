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
  readonly deferredPurchasesListener: DeferredPurchasesListener | undefined;
  readonly proxyUrl: string | undefined;
  readonly kidsMode: boolean;

  constructor(
    projectKey: string,
    launchMode: LaunchMode,
    environment: Environment = Environment.PRODUCTION,
    entitlementsCacheLifetime: EntitlementsCacheLifetime = EntitlementsCacheLifetime.MONTH,
    entitlementsUpdateListener: EntitlementsUpdateListener | undefined = undefined,
    deferredPurchasesListener: DeferredPurchasesListener | undefined = undefined,
    proxyUrl: string | undefined = undefined,
    kidsMode: boolean = false,
  ) {
    this.projectKey = projectKey;
    this.launchMode = launchMode;
    this.environment = environment;
    this.entitlementsCacheLifetime = entitlementsCacheLifetime;
    this.entitlementsUpdateListener = entitlementsUpdateListener;
    this.deferredPurchasesListener = deferredPurchasesListener;
    this.proxyUrl = proxyUrl;
    this.kidsMode = kidsMode;
  }
}

export default QonversionConfig;
