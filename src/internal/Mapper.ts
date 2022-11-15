import {
  AutomationsEventType,
  EntitlementSource,
  IntroEligibilityStatus,
  OfferingTag,
  ProductDuration,
  ProductDurations,
  ProductType,
  ProductTypes,
  EntitlementRenewState,
  SKPeriodUnit,
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
  TrialDuration,
  TrialDurations,
} from "../dto/enums";
import IntroEligibility from "../dto/IntroEligibility";
import Offering from "../dto/Offering";
import Offerings from "../dto/Offerings";
import Entitlement from "../dto/Entitlement";
import Product from "../dto/Product";
import SKProduct from "../dto/storeProducts/SKProduct";
import SKProductDiscount from "../dto/storeProducts/SKProductDiscount";
import SKSubscriptionPeriod from "../dto/storeProducts/SKSubscriptionPeriod";
import SkuDetails from "../dto/storeProducts/SkuDetails";
import ActionResult from "../dto/ActionResult";
import QonversionError from "../dto/QonversionError";
import AutomationsEvent from "../dto/AutomationsEvent";
import User from '../dto/User';

type QProduct = {
  id: string;
  storeId: string;
  type: keyof typeof ProductType;
  duration: keyof typeof ProductDuration;
  skuDetails?: QSkuDetails | null; // android
  skProduct?: QSKProduct | null // iOS
  prettyPrice?: string;
  trialDuration: keyof typeof TrialDuration | null;
  offeringId: string | null;
};

type QSkuDetails = {
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
};

type QSKProduct = {
  subscriptionPeriod: null | QSubscriptionPeriod;
  introductoryPrice: QProductDiscount | null;
  discounts: Array<QProductDiscount> | null;
  localizedDescription: string | undefined;
  localizedTitle: string | undefined;
  price: string;
  priceLocale: QLocale;
  productIdentifier: string | undefined;
  isDownloadable: boolean | undefined;
  downloadContentVersion: string | undefined;
  downloadContentLengths: number[] | undefined;
  productDiscount: SKProductDiscount | undefined;
  subscriptionGroupIdentifier: string | undefined;
  isFamilyShareable: boolean | undefined;
};

type QSubscriptionPeriod = {
  numberOfUnits: number;
  unit: keyof typeof SKPeriodUnit;
};

type QProductDiscount = {
  subscriptionPeriod: null | QSubscriptionPeriod;
  price: string;
  numberOfPeriods: number;
  paymentMode: keyof typeof SKProductDiscountPaymentMode;
  identifier?: string;
  type: keyof typeof SKProductDiscountType;
  priceLocale: QLocale;
};

type QLocale = {
  currencySymbol: string | null;
  currencyCode: string | null;
  localeIdentifier: string;
};

type QEntitlement = {
  id: string;
  productId: string;
  active: boolean;
  renewState: string;
  source: string;
  startedTimestamp: number;
  expirationTimestamp: number;
};

type QOfferings = {
  availableOfferings?: Array<QOffering>;
  main: QOffering;
};

type QOffering = {
  id: string;
  tag: keyof typeof OfferingTag;
  products: Array<QProduct>;
};

type QAutomationsEvent = {
  type: AutomationsEventType;
  timestamp: number;
};

type QUser = {
  qonversionId: string;
  identityId: string;
};

const skuDetailsPriceRatio = 1000000;

class Mapper {
  static convertEntitlements(
    entitlements: Record<string, QEntitlement>
  ): Map<string, Entitlement> {
    let mappedPermissions = new Map();

    for (const [key, entitlement] of Object.entries(entitlements)) {
      let renewState: EntitlementRenewState;
      switch (entitlement.renewState) {
        case EntitlementRenewState.NON_RENEWABLE:
          renewState = EntitlementRenewState.NON_RENEWABLE;
          break;
        case EntitlementRenewState.WILL_RENEW:
          renewState = EntitlementRenewState.WILL_RENEW;
          break;
        case EntitlementRenewState.CANCELED:
          renewState = EntitlementRenewState.CANCELED;
          break;
        case EntitlementRenewState.BILLING_ISSUE:
          renewState = EntitlementRenewState.BILLING_ISSUE;
          break;
        default:
          renewState = EntitlementRenewState.UNKNOWN;
          break;
      }

      const entitlementSource = this.convertEntitlementSource(entitlement.source);

      const mappedPermission = new Entitlement(
        entitlement.id,
        entitlement.productId,
        entitlement.active,
        renewState,
        entitlementSource,
        entitlement.startedTimestamp,
        entitlement.expirationTimestamp
      );
      mappedPermissions.set(key, mappedPermission);
    }

    return mappedPermissions;
  }

  static convertEntitlementSource(sourceKey: string): EntitlementSource {
    switch (sourceKey) {
      case "Unknown":
        return EntitlementSource.UNKNOWN;
      case "AppStore":
        return EntitlementSource.APP_STORE;
      case "PlayStore":
        return EntitlementSource.PLAY_STORE;
      case "Stripe":
        return EntitlementSource.STRIPE;
      case "Manual":
        return EntitlementSource.MANUAL;
    }

    return EntitlementSource.UNKNOWN;
  }

  static convertProducts(products: Record<string, QProduct>): Map<string, Product> {
    let mappedProducts = new Map();

    for (const [key, product] of Object.entries(products)) {
      const mappedProduct = this.convertProduct(product);
      mappedProducts.set(key, mappedProduct);
    }

    return mappedProducts;
  }

  static convertProduct(product: QProduct): Product {
    const productType: ProductTypes = ProductType[product.type];
    const productDuration: ProductDurations = ProductDuration[product.duration];
    const trialDuration: TrialDurations | undefined = product.trialDuration == null ? undefined : TrialDuration[product.trialDuration];
    const offeringId: string | null = product.offeringId;

    let skProduct: SKProduct | null = null;
    let skuDetails: SkuDetails | null = null;
    let price: number | undefined;
    let currencyCode: string | undefined;
    let storeTitle: string | undefined;
    let storeDescription: string | undefined;
    let prettyIntroductoryPrice: string | undefined;

    if (!!product.skProduct) {
      skProduct = Mapper.convertSKProduct(product.skProduct as QSKProduct);
      price = parseFloat(skProduct.price);
      currencyCode = skProduct.currencyCode;
      storeTitle = skProduct.localizedTitle;
      storeDescription = skProduct.localizedDescription;

      if (skProduct.productDiscount) {
        prettyIntroductoryPrice = skProduct.productDiscount.currencySymbol + skProduct.productDiscount.price;
      }
    } else if (!!product.skuDetails) {
      skuDetails = Mapper.convertSkuDetails(product.skuDetails as QSkuDetails);
      price = skuDetails.priceAmountMicros / skuDetailsPriceRatio;
      currencyCode = skuDetails.priceCurrencyCode;
      storeTitle = skuDetails.title;
      storeDescription = skuDetails.description;

      if (skuDetails.introductoryPrice.length > 0) {
        prettyIntroductoryPrice = skuDetails.introductoryPrice;
      }
    }

    const mappedProduct = new Product(
      product.id,
      product.storeId,
      productType,
      productDuration,
      skuDetails,
      skProduct,
      product.prettyPrice,
      trialDuration,
      price,
      currencyCode,
      storeTitle,
      storeDescription,
      prettyIntroductoryPrice,
      offeringId
    );

    return mappedProduct;
  }

  static convertOfferings(offerings: QOfferings): Offerings | null {
    if (
      !Array.isArray(offerings.availableOfferings) ||
      offerings.availableOfferings.length === 0
    ) {
      return null;
    }

    let mainOffering: Offering | null = null;
    if (offerings.main) {
      mainOffering = this.convertOffering(offerings.main);
    }

    const availableOfferings: Array<Offering> = [];

    offerings.availableOfferings.forEach((offering) => {
      const mappedOffering = this.convertOffering(offering);

      availableOfferings.push(mappedOffering);
    });

    return new Offerings(mainOffering, availableOfferings);
  }

  static convertOffering(offering: QOffering): Offering {
    const products: Array<Product> = [];
    offering.products.forEach((product) => {
      const mappedProduct = this.convertProduct(product);

      products.push(mappedProduct);
    });

    const tag = OfferingTag[offering.tag] ?? OfferingTag[0];

    return new Offering(offering.id, tag, products);
  }

  static convertSkuDetails(skuDetails: QSkuDetails): SkuDetails {
    return new SkuDetails(
      skuDetails.description,
      skuDetails.freeTrialPeriod,
      skuDetails.iconUrl,
      skuDetails.introductoryPrice,
      skuDetails.introductoryPriceAmountMicros,
      skuDetails.introductoryPriceCycles,
      skuDetails.introductoryPricePeriod,
      skuDetails.originalJson,
      skuDetails.originalPrice,
      skuDetails.originalPriceAmountMicros,
      skuDetails.price,
      skuDetails.priceAmountMicros,
      skuDetails.priceCurrencyCode,
      skuDetails.sku,
      skuDetails.subscriptionPeriod,
      skuDetails.title,
      skuDetails.type,
      skuDetails.hashCode,
      skuDetails.toString
    );
  }

  static convertSKProduct(skProduct: QSKProduct): SKProduct {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined;
    if (skProduct.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSubscriptionPeriod(
        skProduct.subscriptionPeriod
      );
    }

    let discount: SKProductDiscount | undefined;
    if (skProduct.introductoryPrice) {
      discount = this.convertProductDiscount(skProduct.introductoryPrice);
    }

    let discounts: SKProductDiscount[] | undefined;
    if (Array.isArray(skProduct.discounts) && skProduct.discounts.length) {
      discounts = this.convertDiscounts(skProduct.discounts);
    }

    return new SKProduct(
      skProduct.localizedDescription,
      skProduct.localizedTitle,
      skProduct.price,
      skProduct.priceLocale.localeIdentifier,
      skProduct.productIdentifier,
      !!skProduct.isDownloadable,
      skProduct.downloadContentVersion,
      skProduct.downloadContentLengths,
      subscriptionPeriod,
      discount,
      discounts,
      skProduct.subscriptionGroupIdentifier,
      skProduct.isFamilyShareable,
      skProduct.priceLocale.currencyCode ?? ""
    );
  }

  static convertSubscriptionPeriod(
    subscriptionPeriod: QSubscriptionPeriod
  ): SKSubscriptionPeriod {
    return new SKSubscriptionPeriod(
      subscriptionPeriod.numberOfUnits,
      SKPeriodUnit[subscriptionPeriod.unit]
    );
  }

  static convertProductDiscount(discount: QProductDiscount): SKProductDiscount {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined = undefined;
    if (discount.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSubscriptionPeriod(
        discount.subscriptionPeriod
      );
    }
    return new SKProductDiscount(
      discount.price,
      discount.priceLocale.localeIdentifier,
      discount.numberOfPeriods,
      subscriptionPeriod,
      SKProductDiscountPaymentMode[discount.paymentMode],
      discount.identifier,
      SKProductDiscountType[discount.type],
      discount.priceLocale.currencySymbol ?? ""
    );
  }

  static convertDiscounts(
    discounts: Array<QProductDiscount>
  ): SKProductDiscount[] {
    const mappedDiscounts: SKProductDiscount[] = discounts.map((discount) => {
      return this.convertProductDiscount(discount);
    });
    return mappedDiscounts;
  }

  static convertEligibility(
    eligibilityMap: Record<string, {
      status:
        | "non_intro_or_trial_product"
        | "intro_or_trial_eligible"
        | "intro_or_trial_ineligible";
    }>
  ): Map<string, IntroEligibility> {
    let mappedEligibility = new Map<string, IntroEligibility>();

    for (const [key, value] of Object.entries(eligibilityMap)) {
      const status = Mapper.convertEligibilityStatus(value.status);

      const eligibilityInfo = new IntroEligibility(status);
      mappedEligibility.set(key, eligibilityInfo);
    }

    return mappedEligibility;
  }

  static convertEligibilityStatus(status: string): IntroEligibilityStatus {
    switch (status) {
      case "non_intro_or_trial_product":
        return IntroEligibilityStatus.NON_INTRO_OR_TRIAL_PRODUCT;
      case "intro_or_trial_eligible":
        return IntroEligibilityStatus.ELIGIBLE;
      case "intro_or_trial_ineligible":
        return IntroEligibilityStatus.INELIGIBLE;
      default:
        return IntroEligibilityStatus.UNKNOWN;
    }
  }

  static convertActionResult(
    payload: Record<string, any>
  ): ActionResult {
    return new ActionResult(
      payload["type"],
      payload["value"],
      this.convertQonversionError(payload["error"])
    )
  }

  static convertQonversionError(
    payload: Record<string, string> | undefined
  ): QonversionError | undefined {
    return payload ? new QonversionError(
      payload["code"],
      payload["description"],
      payload["additionalMessage"],
      payload["domain"],
    ) : undefined;
  }

  static convertAutomationsEvent(
    automationsEvent: QAutomationsEvent
  ): AutomationsEvent {
    return new AutomationsEvent(
      automationsEvent.type,
      automationsEvent.timestamp
    )
  }

  static convertUserInfo(user: QUser) {
    return new User(user.qonversionId, user.identityId);
  }
}

export default Mapper;
