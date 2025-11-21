import type { NoCodesListener } from './dto/NoCodesListener';

class NoCodesConfig {
  readonly projectKey: string;
  readonly noCodesListener: NoCodesListener | undefined;
  readonly proxyUrl: string | undefined;

  constructor(
    projectKey: string,
    noCodesListener: NoCodesListener | undefined = undefined,
    proxyUrl: string | undefined = undefined
  ) {
    this.projectKey = projectKey;
    this.noCodesListener = noCodesListener;
    this.proxyUrl = proxyUrl;
  }
}

export default NoCodesConfig;
