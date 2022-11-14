class SkuDetails {
  description: string;
  freeTrialPeriod: string;
  iconUrl: string;
  introductoryPrice: string;
  introductoryPriceAmountMicros: number;
  introductoryPriceCycles: number;
  introductoryPricePeriod: string;
  originalJson: string;
  originalPrice: string;
  originalPriceAmountMicros: number;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  sku: string;
  subscriptionPeriod: string;
  title: string;
  type: string;
  hashCode: number;
  toString: string;

  constructor(
    description: string,
    freeTrialPeriod: string,
    iconUrl: string,
    introductoryPrice: string,
    introductoryPriceAmountMicros: number,
    introductoryPriceCycles: number,
    introductoryPricePeriod: string,
    originalJson: string,
    originalPrice: string,
    originalPriceAmountMicros: number,
    price: string,
    priceAmountMicros: number,
    priceCurrencyCode: string,
    sku: string,
    subscriptionPeriod: string,
    title: string,
    type: string,
    hashCode: number,
    toString: string
  ) {
    this.description = description;
    this.freeTrialPeriod = freeTrialPeriod;
    this.iconUrl = iconUrl;
    this.introductoryPrice = introductoryPrice;
    this.introductoryPriceAmountMicros = introductoryPriceAmountMicros;
    this.introductoryPriceCycles = introductoryPriceCycles;
    this.introductoryPricePeriod = introductoryPricePeriod;
    this.originalJson = originalJson;
    this.originalPrice = originalPrice;
    this.originalPriceAmountMicros = originalPriceAmountMicros;
    this.price = price;
    this.priceAmountMicros = priceAmountMicros;
    this.priceCurrencyCode = priceCurrencyCode;
    this.sku = sku;
    this.subscriptionPeriod = subscriptionPeriod;
    this.title = title;
    this.type = type;
    this.hashCode = hashCode;
    this.toString = toString;
  }
}

export default SkuDetails;
