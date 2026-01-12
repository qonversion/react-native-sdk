import type { NoCodesListener } from './dto/NoCodesListener';
import type { PurchaseDelegate } from './dto/PurchaseDelegate';

class NoCodesConfig {
  readonly projectKey: string;
  readonly noCodesListener: NoCodesListener | undefined;
  readonly purchaseDelegate: PurchaseDelegate | undefined;
  readonly proxyUrl: string | undefined;

  constructor(
    projectKey: string,
    noCodesListener: NoCodesListener | undefined = undefined,
    purchaseDelegate: PurchaseDelegate | undefined = undefined,
    proxyUrl: string | undefined = undefined
  ) {
    this.projectKey = projectKey;
    this.noCodesListener = noCodesListener;
    this.purchaseDelegate = purchaseDelegate;
    this.proxyUrl = proxyUrl;
  }
}

export default NoCodesConfig;
