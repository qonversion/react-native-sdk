import NoCodesApi from "./NoCodesApi";
import NoCodesConfig from "./NoCodesConfig";
import NoCodesInternal from "./internal/NoCodesInternal";

export default class NoCodes {
  private constructor() {}

  private static backingInstance: NoCodesApi | undefined;

  /**
   * Use this variable to get a current initialized instance of the NoCodes SDK.
   * Please, use the property only after calling {@link NoCodes.initialize}.
   * Otherwise, trying to access the variable will cause an exception.
   *
   * @return Current initialized instance of the NoCodes SDK.
   * @throws error if the instance has not been initialized
   */
  static getSharedInstance(): NoCodesApi {
    if (!this.backingInstance) {
      throw "No-Codes has not been initialized. You should call " +
        "the initialize method before accessing the shared instance of NoCodes."
    }

    return this.backingInstance;
  }

  /**
   * An entry point to use No-Codes SDK. Call to initialize No-Codes SDK with required configs.
   *
   * @param config a config that contains key SDK settings.
   * @return Initialized instance of the No-Codes SDK.
   */
  static initialize(config: NoCodesConfig): NoCodesApi {
    this.backingInstance = new NoCodesInternal(config);
    return this.backingInstance;
  }
}
