import ProductPrice from "./ProductPrice";

class ProductInAppDetails {
    price: ProductPrice;

    constructor(
        price: ProductPrice
    ) {
        this.price = price;
    }
}

export default ProductInAppDetails;
