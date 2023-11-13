class ProductPrice {
    currencySymbol: string | null;
    formattedPrice: string;
    isFree: boolean;
    priceAmountMicros: number;
    priceCurrencyCode: string;

    constructor(
        formattedPrice: string,
        isFree: boolean,
        priceAmountMicros: number,
        priceCurrencyCode: string,
        currencySymbol: string | null = null
    ) {
        this.formattedPrice = formattedPrice;
        this.isFree = isFree;
        this.priceAmountMicros = priceAmountMicros;
        this.priceCurrencyCode = priceCurrencyCode;
        this.currencySymbol = currencySymbol;
    }
}

export default ProductPrice;
