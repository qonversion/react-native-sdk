import { ProductDurations, ProductTypes, TrialDurations } from "../enums";
import SKProduct from "./storeProducts/SKProduct";
import SkuDetails from "./storeProducts/SkuDetails";

class Product {
  qonversionID: string;
  storeID: string;
  type: ProductTypes;
  duration: ProductDurations;
  skuDetails: SkuDetails | null;
  skProduct: SKProduct | null;
  prettyPrice?: string;
  trialDuration?: TrialDurations;
  price?: number;
  currencyCode?: string;

  constructor(
    qonversionID: string,
    storeID: string,
    type: ProductTypes,
    duration: ProductDurations,
    skuDetails: SkuDetails | null,
    skProduct: SKProduct | null,
    prettyPrice: string | undefined,
    trialDuration: TrialDurations | undefined,
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
