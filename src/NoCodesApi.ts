import ScreenPresentationConfig from './dto/ScreenPresentationConfig';
import type { NoCodesTheme } from './dto/enums';

export default interface NoCodesApi {
  /**
   * Set the configuration of screen representation.
   * @param config a configuration to apply.
   * @param contextKey the context key of the screen, to which a config should be applied.
   *                   If not provided, the config is used for all the screens.
   */
  setScreenPresentationConfig(config: ScreenPresentationConfig, contextKey?: string): void;

  /**
   * Show the screen using its context key.
   * @param contextKey the context key of the screen which must be shown.
   * @param customVariables optional map of custom variables that will be injected
   *                        into the screen's JavaScript context. Variables are scoped
   *                        to the provided contextKey and only applied to that screen.
   */
  showScreen(contextKey: string, customVariables?: Record<string, string>): void;

  /**
   * Close the current opened No-Code screen.
   */
  close(): void;

  /**
   * Set the locale for No-Code screens.
   * Use this to override the device locale for the No-Codes SDK.
   * Pass null to reset to the device default locale.
   *
   * @param locale the locale to use (e.g. "en", "de", "fr"), or null to reset to device default.
   */
  setLocale(locale: string | null): void;

  /**
   * Set the theme mode for No-Code screens.
   * Controls how screens adapt to light/dark themes.
   *
   * @param theme the desired theme mode. Use {@link NoCodesTheme.AUTO} to follow device settings,
   *              {@link NoCodesTheme.LIGHT} to force light theme, or {@link NoCodesTheme.DARK} to force dark theme.
   */
  setTheme(theme: NoCodesTheme): void;
}
