import AutomationsApi from './AutomationsApi';
import Qonversion from './Qonversion';
import AutomationsInternal from './internal/AutomationsInternal';

export default class Automations {
  private constructor() {}

  private static backingInstance: AutomationsApi | undefined = undefined

  /**
   * Use this variable to get a current initialized instance of the Qonversion SDK.
   * Please, use the property only after calling {@link Automations.initialize}.
   * Otherwise, trying to access the variable will cause an exception.
   *
   * @return Current initialized instance of the Automations SDK.
   * @throws error if the instance has not been initialized
   */
  static getSharedInstance(): AutomationsApi {
    if (!this.backingInstance) {
      throw "Automations have not been initialized. You should call " +
        "the initialize method before accessing the shared instance of Automations."
    }

    return this.backingInstance;
  }

  /**
   * An entry point to use Qonversion Automations. Call to initialize Automations.
   * Make sure you have initialized {@link Qonversion} first.
   *
   * @return Initialized instance of the Automations SDK.
   */
  static initialize(): AutomationsApi {
    try {
      Qonversion.getSharedInstance();
    } catch (e) {
      throw "Qonversion has not been initialized. " +
        "Automations initialization should be called after Qonversion is initialized."
    }

    this.backingInstance = new AutomationsInternal();
    return this.backingInstance;
  }
}
