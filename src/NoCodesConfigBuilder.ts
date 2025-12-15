import type {NoCodesListener} from './dto/NoCodesListener';
import type {PurchaseDelegate} from './dto/PurchaseDelegate';
import NoCodesConfig from './NoCodesConfig';

class NoCodesConfigBuilder {
  private readonly projectKey: string;
  private noCodesListener: NoCodesListener | undefined = undefined;
  private purchaseDelegate: PurchaseDelegate | undefined = undefined;
  private proxyUrl: string | undefined = undefined;

  constructor(projectKey: string) {
    this.projectKey = projectKey;
  }

  /**
   * Provide a listener to be notified about NoCodes events.
   *
   * Make sure you provide this listener for being up-to-date with the NoCodes events.
   * Else you can lose some important updates. Also, please, consider that this listener
   * should live for the whole lifetime of the application.
   *
   * @param noCodesListener listener to be called when NoCodes events occur.
   * @return builder instance for chain calls.
   */
  setNoCodesListener(noCodesListener: NoCodesListener): NoCodesConfigBuilder {
    this.noCodesListener = noCodesListener;
    return this;
  }

  /**
   * Provide a delegate for custom purchase and restore handling.
   * When this delegate is provided, it replaces the default Qonversion SDK purchase flow.
   *
   * @param purchaseDelegate delegate to handle purchase and restore operations.
   * @return builder instance for chain calls.
   */
  setPurchaseDelegate(purchaseDelegate: PurchaseDelegate): NoCodesConfigBuilder {
    this.purchaseDelegate = purchaseDelegate;
    return this;
  }

  /**
   * Set proxy URL for NoCodes SDK.
   *
   * @param proxyUrl proxy URL to use for API requests.
   * @return builder instance for chain calls.
   */
  setProxyURL(proxyUrl: string): NoCodesConfigBuilder {
    this.proxyUrl = proxyUrl;
    return this;
  }

  /**
   * Generate {@link NoCodesConfig} instance with all the provided configurations.
   *
   * @return the complete {@link NoCodesConfig} instance.
   */
  build(): NoCodesConfig {
    return new NoCodesConfig(
      this.projectKey,
      this.noCodesListener,
      this.purchaseDelegate,
      this.proxyUrl
    );
  }
}

export default NoCodesConfigBuilder;
