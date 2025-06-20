import {NoCodesListener} from './dto/NoCodesListener';
import NoCodesConfig from './NoCodesConfig';

class NoCodesConfigBuilder {
  private readonly projectKey: string;
  private noCodesListener: NoCodesListener | undefined = undefined;

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
   * Generate {@link NoCodesConfig} instance with all the provided configurations.
   *
   * @return the complete {@link NoCodesConfig} instance.
   */
  build(): NoCodesConfig {
    return new NoCodesConfig(
      this.projectKey,
      this.noCodesListener
    );
  }
}

export default NoCodesConfigBuilder;
