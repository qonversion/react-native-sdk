import ProductPrice from "./ProductPrice";

/**
 * This class contains all the information about the Google in-app product details.
 */
class ProductInAppDetails {
  /**
   * The price of the in-app product.
   */
  price: ProductPrice;

  constructor(price: ProductPrice) {
    this.price = price;
  }
}

export default ProductInAppDetails;
