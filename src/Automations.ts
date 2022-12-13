import AutomationsApi from './AutomationsApi';
import Qonversion from './Qonversion';
import AutomationsInternal from './internal/AutomationsInternal';

export default class Automations {
  private constructor() {}

  private static backingInstance: AutomationsApi | undefined;

  /**
   * Use this variable to get a current initialized instance of the Qonversion Automations.
   * Please, use Automations only after calling {@link Qonversion.initialize}.
   * Otherwise, trying to access the variable will cause an error.
   *
   * @return Current initialized instance of the Qonversion Automations.
   * @throws error if Qonversion has not been initialized.
   */
  static getSharedInstance(): AutomationsApi {
    if (!this.backingInstance) {
      try {
        Qonversion.getSharedInstance();
      } catch (e) {
        throw "Qonversion has not been initialized. " +
        "Automations should be used after Qonversion is initialized."
      }

      this.backingInstance = new AutomationsInternal();
    }

    return this.backingInstance;
  }
}
