import { NoCodesListener } from './NoCodesListener';

class NoCodesConfig {
  readonly projectKey: string;
  readonly noCodesListener: NoCodesListener | undefined;

  constructor(
    projectKey: string,
    noCodesListener: NoCodesListener | undefined = undefined
  ) {
    this.projectKey = projectKey;
    this.noCodesListener = noCodesListener;
  }
}

export default NoCodesConfig; 