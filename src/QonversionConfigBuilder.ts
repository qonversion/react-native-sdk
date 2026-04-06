import {EntitlementsCacheLifetime, Environment, LaunchMode} from './dto/enums';
import type {EntitlementsUpdateListener} from './dto/EntitlementsUpdateListener';
import type {DeferredPurchasesListener} from './dto/DeferredPurchasesListener';
import QonversionConfig from './QonversionConfig';

class QonversionConfigBuilder {
  private readonly projectKey: string;
  private readonly launchMode: LaunchMode;

  constructor(projectKey: string, launchMode: LaunchMode) {
    this.projectKey = projectKey;
    this.launchMode = launchMode;
  }

  private environment: Environment = Environment.PRODUCTION;
  private entitlementsCacheLifetime: EntitlementsCacheLifetime = EntitlementsCacheLifetime.MONTH;
  private entitlementsUpdateListener: EntitlementsUpdateListener | undefined = undefined;
  private deferredPurchasesListener: DeferredPurchasesListener | undefined = undefined;
  private proxyUrl: string | undefined = undefined;
  private kidsMode: boolean = false;


  /**
   * Set current application {@link Environment}. Used to distinguish sandbox and production users.
   *
   * @param environment current environment.
   * @return builder instance for chain calls.
   */
  setEnvironment(environment: Environment): QonversionConfigBuilder {
    this.environment = environment;
    return this;
  }

  /**
   * Entitlements cache is used when there are problems with the Qonversion API
   * or internet connection. If so, Qonversion will return the last successfully loaded
   * entitlements. The current method allows you to configure how long that cache may be used.
   * The default value is {@link EntitlementsCacheLifetime.MONTH}.
   *
   * @param lifetime desired entitlements cache lifetime duration
   * @return builder instance for chain calls.
   */
  setEntitlementsCacheLifetime(lifetime: EntitlementsCacheLifetime): QonversionConfigBuilder {
    this.entitlementsCacheLifetime = lifetime;
    return this;
  }

  /**
   * Provide a listener to be notified about asynchronous user entitlements updates.
   *
   * Make sure you provide this listener for being up-to-date with the user entitlements.
   * Else you can lose some important updates. Also, please, consider that this listener
   * should live for the whole lifetime of the application.
   *
   * @param entitlementsUpdateListener listener to be called when entitlements update.
   * @return builder instance for chain calls.
   * @deprecated Use {@link setDeferredPurchasesListener} instead.
   */
  setEntitlementsUpdateListener(entitlementsUpdateListener: EntitlementsUpdateListener): QonversionConfigBuilder {
    this.entitlementsUpdateListener = entitlementsUpdateListener;
    return this;
  }

  /**
   * Provide a listener to be notified about deferred purchase completions.
   *
   * Deferred purchases happen when transactions require additional steps to complete,
   * such as SCA (Strong Customer Authentication), Ask to Buy, or other pending transactions.
   * This listener will be called when such purchases are finalized.
   *
   * Make sure you provide this listener for being up-to-date with deferred purchase completions.
   * Also, please, consider that this listener should live for the whole lifetime of the application.
   *
   * @param listener listener to be called when a deferred purchase completes.
   * @return builder instance for chain calls.
   */
  setDeferredPurchasesListener(listener: DeferredPurchasesListener): QonversionConfigBuilder {
    this.deferredPurchasesListener = listener;
    return this;
  }

  /**
   * Provide a URL to your proxy server which will redirect all the requests from the app
   * to our API. Please, contact us before using this feature.
   *
   * @param url your proxy server url
   * @return builder instance for chain calls.
   * @see [The documentation](https://documentation.qonversion.io/docs/custom-proxy-server-for-sdks)
   */
  setProxyURL(url: string): QonversionConfigBuilder {
    this.proxyUrl = url;
    return this;
  }

  /**
   * Android only.
   * Use this function to enable Qonversion SDK Kids mode.
   * With this mode activated, our SDK does not collect any information that violates Google Children’s Privacy Policy.
   * @return builder instance for chain calls.
   */
  enableKidsMode(): QonversionConfigBuilder {
    this.kidsMode = true;
    return this;
  }

  /**
   * Generate {@link QonversionConfig} instance with all the provided configurations.
   *
   * @return the complete {@link QonversionConfig} instance.
   */
  build(): QonversionConfig {
    return new QonversionConfig(
      this.projectKey,
      this.launchMode,
      this.environment,
      this.entitlementsCacheLifetime,
      this.entitlementsUpdateListener,
      this.deferredPurchasesListener,
      this.proxyUrl,
      this.kidsMode,
    )
  }
}

export default QonversionConfigBuilder;
