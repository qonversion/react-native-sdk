import { ProductDuration, ProductType, TrialDuration } from "../enums";
import SKProduct from "./storeProducts/SKProduct";
import SkuDetails from "./storeProducts/SkuDetails";

class Product {
  qonversionID: string;
  storeID: string;
  type: ProductType;
  duration: ProductDuration;
  skuDetails: SkuDetails | null;
  skProduct: SKProduct | null;
  prettyPrice?: string;
  trialDuration?: TrialDuration;
  price?: number;
  currencyCode?: string;

  constructor(
    qonversionID: string,
    storeID: string,
    type: ProductType,
    duration: ProductDuration,
    skuDetails: SkuDetails | null,
    skProduct: SKProduct | null,
    prettyPrice: string | undefined,
    trialDuration: TrialDuration | undefined,
    price: number | undefined,
    currencyCode: string | undefined
  ) {
    this.qonversionID = qonversionID;
    this.storeID = storeID;
    this.type = type;
    this.duration = duration;
    this.skuDetails = skuDetails;
    this.skProduct = skProduct;
    this.prettyPrice = prettyPrice;
    this.trialDuration = trialDuration;
    this.price = price;
    this.currencyCode = currencyCode;
  }
}

export default Product;
