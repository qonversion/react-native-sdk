import {ScreenPresentationConfig} from './dto/ScreenPresentationConfig';

export default interface NoCodesApi {
  /**
   * Set the configuration of screen representation.
   * @param config a configuration to apply.
   * @param contextKey the context key of the screen, to which a config should be applied.
   *                   If not provided, the config is used for all the screens.
   */
  setScreenPresentationConfig(config: ScreenPresentationConfig, contextKey?: string): Promise<void>;

  /**
   * Show the screen using its context key.
   * @param contextKey the context key of the screen which must be shown
   * @returns promise to await for completion.
   */
  showScreen(contextKey: string): Promise<void>;

  /**
   * Close the current opened No-Code screen.
   * @returns promise to await for completion.
   */
  close(): Promise<void>;
}
