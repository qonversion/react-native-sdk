import type { NoCodesListener } from './dto/NoCodesListener';
import type { PurchaseDelegate } from './dto/PurchaseDelegate';

class NoCodesConfig {
  readonly projectKey: string;
  readonly noCodesListener: NoCodesListener | undefined;
  readonly purchaseDelegate: PurchaseDelegate | undefined;
  readonly proxyUrl: string | undefined;
  readonly locale: string | undefined;

  constructor(
    projectKey: string,
    noCodesListener: NoCodesListener | undefined = undefined,
    purchaseDelegate: PurchaseDelegate | undefined = undefined,
    proxyUrl: string | undefined = undefined,
    locale: string | undefined = undefined
  ) {
    this.projectKey = projectKey;
    this.noCodesListener = noCodesListener;
    this.purchaseDelegate = purchaseDelegate;
    this.proxyUrl = proxyUrl;
    this.locale = locale;
  }
}

export default NoCodesConfig;
