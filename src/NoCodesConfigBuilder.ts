import type {NoCodesListener} from './dto/NoCodesListener';
import type {PurchaseDelegate} from './dto/PurchaseDelegate';
import {NoCodesTheme} from './dto/enums';
import NoCodesConfig from './NoCodesConfig';

class NoCodesConfigBuilder {
  private readonly projectKey: string;
  private noCodesListener: NoCodesListener | undefined = undefined;
  private purchaseDelegate: PurchaseDelegate | undefined = undefined;
  private proxyUrl: string | undefined = undefined;
  private locale: string | undefined = undefined;
  private theme: NoCodesTheme | undefined = undefined;

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
   * Set the locale for No-Code screens.
   * Use this to override the device locale for the No-Codes SDK.
   *
   * @param locale the locale to use (e.g. "en", "de", "fr").
   * @return builder instance for chain calls.
   */
  setLocale(locale: string): NoCodesConfigBuilder {
    this.locale = locale;
    return this;
  }

  /**
   * Set the theme mode for No-Code screens.
   * Controls how screens adapt to light/dark themes.
   *
   * @param theme the desired theme mode. Use {@link NoCodesTheme.AUTO} to follow device settings,
   *              {@link NoCodesTheme.LIGHT} to force light theme, or {@link NoCodesTheme.DARK} to force dark theme.
   * @return builder instance for chain calls.
   */
  setTheme(theme: NoCodesTheme): NoCodesConfigBuilder {
    this.theme = theme;
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
      this.proxyUrl,
      this.locale,
      this.theme
    );
  }
}

export default NoCodesConfigBuilder;
