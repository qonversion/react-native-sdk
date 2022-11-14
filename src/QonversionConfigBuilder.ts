import {EntitlementsCacheLifetime, Environment, LaunchMode} from './dto/enums';
import {EntitlementsUpdateListener} from './dto/EntitlementsUpdateListener';
import QonversionConfig from './QonversionConfig';

class QonversionConfigBuilder {
  readonly projectKey: string;
  readonly launchMode: LaunchMode;

  constructor(projectKey: string, launchMode: LaunchMode) {
    this.projectKey = projectKey;
    this.launchMode = launchMode;
  }

  environment: Environment = Environment.PRODUCTION;
  entitlementsCacheLifetime: EntitlementsCacheLifetime = EntitlementsCacheLifetime.MONTH;
  entitlementsUpdateListener: EntitlementsUpdateListener | undefined = undefined;

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
   */
  setEntitlementsUpdateListener(entitlementsUpdateListener: EntitlementsUpdateListener): QonversionConfigBuilder {
    this.entitlementsUpdateListener = entitlementsUpdateListener;
    return this;
  }

  /**
   * Generate {@link QonversionConfig} instance with all the provided configurations.
   *
   * @throws IllegalStateException if unacceptable configuration was provided.
   * @return the complete {@link QonversionConfig} instance.
   */
  build(): QonversionConfig {
    return new QonversionConfig(
      this.projectKey,
      this.launchMode,
      this.environment,
      this.entitlementsCacheLifetime,
      this.entitlementsUpdateListener
    )
  }
}

export default QonversionConfigBuilder;
