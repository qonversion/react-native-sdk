import { OfferingTags } from "./enums";
import Product from "./Product";

class Offering {
  id: string;
  tag: OfferingTags;
  products: Array<Product>;

  constructor(id: string, tag: OfferingTags, products: Product[]) {
    this.id = id;
    this.tag = tag;
    this.products = products;
  }

  productForIdentifier(identifier: string): Product | undefined {
    return this.products.find((object) => object.qonversionID === identifier);
  }
}

export default Offering;
