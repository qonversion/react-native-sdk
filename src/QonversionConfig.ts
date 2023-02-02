import {EntitlementsCacheLifetime, Environment, LaunchMode} from './dto/enums';
import {EntitlementsUpdateListener} from './dto/EntitlementsUpdateListener';

class QonversionConfig {
  readonly projectKey: string;
  readonly launchMode: LaunchMode;
  readonly environment: Environment;
  readonly entitlementsCacheLifetime: EntitlementsCacheLifetime;
  readonly entitlementsUpdateListener: EntitlementsUpdateListener | undefined;
  readonly proxyUrl: string | undefined;

  constructor(
    projectKey: string,
    launchMode: LaunchMode,
    environment: Environment = Environment.PRODUCTION,
    entitlementsCacheLifetime: EntitlementsCacheLifetime = EntitlementsCacheLifetime.MONTH,
    entitlementsUpdateListener: EntitlementsUpdateListener | undefined = undefined,
    proxyUrl: string | undefined
  ) {
    this.projectKey = projectKey;
    this.launchMode = launchMode;
    this.environment = environment;
    this.entitlementsCacheLifetime = entitlementsCacheLifetime;
    this.entitlementsUpdateListener = entitlementsUpdateListener;
    this.proxyUrl = proxyUrl;
  }
}

export default QonversionConfig;
