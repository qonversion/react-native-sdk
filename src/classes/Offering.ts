import { OfferingTag } from "../entities";
import Product from "./Product";

class Offering {
  id: string;
  tag: OfferingTag;
  products: Array<Product>;

  constructor(id: string, tag: OfferingTag, products: Product[]) {
    this.id = id;
    this.tag = tag;
    this.products = products;
  }

  productForIdentifier(identifier: string): Product | undefined {
    return this.products.find((object) => object.qonversionID === identifier);
  }
}

export default Offering;
