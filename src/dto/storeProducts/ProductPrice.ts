/**
 * Information about the Google product's price.
 */
class ProductPrice {
  /**
   * Total amount of money in micro-units,
   * where 1,000,000 micro-units equal one unit of the currency.
   */
  priceAmountMicros: number;

  /**
   * ISO 4217 currency code for price.
   */
  priceCurrencyCode: string;

  /**
   * Formatted price for the payment, including its currency sign.
   */
  formattedPrice: string;

  /**
   * True, if the price is zero. False otherwise.
   */
  isFree: boolean;

  /**
   * Price currency symbol. Null if failed to parse.
   */
  currencySymbol: string | null;

  constructor(
    priceAmountMicros: number,
    priceCurrencyCode: string,
    formattedPrice: string,
    isFree: boolean,
    currencySymbol: string | null = null
  ) {
    this.priceAmountMicros = priceAmountMicros;
    this.priceCurrencyCode = priceCurrencyCode;
    this.formattedPrice = formattedPrice;
    this.isFree = isFree;
    this.currencySymbol = currencySymbol;
  }
}

export default ProductPrice;
