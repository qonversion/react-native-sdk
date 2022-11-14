import SKProductDiscount from "./SKProductDiscount";
import SKSubscriptionPeriod from "./SKSubscriptionPeriod";

class SKProduct {
  localizedDescription?: string;
  localizedTitle?: string;
  price: string;
  localeIdentifier?: string;
  productIdentifier?: string;
  isDownloadable: boolean;
  downloadContentVersion?: string;
  downloadContentLengths?: Array<number>;
  subscriptionPeriod?: SKSubscriptionPeriod;
  productDiscount?: SKProductDiscount;
  discounts?: Array<SKProductDiscount>;
  subscriptionGroupIdentifier?: string;
  isFamilyShareable?: boolean;
  currencyCode: string;

  constructor(
    localizedDescription: string | undefined,
    localizedTitle: string | undefined,
    price: string,
    localeIdentifier: string | undefined,
    productIdentifier: string | undefined,
    isDownloadable: boolean,
    downloadContentVersion: string | undefined,
    downloadContentLengths: number[] | undefined,
    subscriptionPeriod: SKSubscriptionPeriod | undefined,
    productDiscount: SKProductDiscount | undefined,
    discounts: SKProductDiscount[] | undefined,
    subscriptionGroupIdentifier: string | undefined,
    isFamilyShareable: boolean | undefined,
    currencyCode: string
  ) {
    this.localizedDescription = localizedDescription;
    this.localizedTitle = localizedTitle;
    this.price = price;
    this.localeIdentifier = localeIdentifier;
    this.productIdentifier = productIdentifier;
    this.isDownloadable = isDownloadable;
    this.downloadContentVersion = downloadContentVersion;
    this.downloadContentLengths = downloadContentLengths;
    this.subscriptionPeriod = subscriptionPeriod;
    this.productDiscount = productDiscount;
    this.discounts = discounts;
    this.subscriptionGroupIdentifier = subscriptionGroupIdentifier;
    this.isFamilyShareable = isFamilyShareable;
    this.currencyCode = currencyCode;
  }
}

export default SKProduct;
