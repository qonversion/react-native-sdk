import {
  ActionResultType,
  AutomationsEventType,
  ExperimentGroupType,
  IntroEligibilityStatus,
  OfferingTag,
  PermissionSource,
  ProductDuration,
  ProductDurations,
  ProductType,
  ProductTypes,
  RenewState,
  SKPeriodUnit,
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
  TrialDuration,
  TrialDurations,
} from "../enums";
import ExperimentGroup from "./ExperimentGroup";
import ExperimentInfo from "./ExperimentInfo";
import IntroEligibility from "./IntroEligibility";
import LaunchResult from "./LaunchResult";
import Offering from "./Offering";
import Offerings from "./Offerings";
import Permission from "./Permission";
import Product from "./Product";
import SKProduct from "./storeProducts/SKProduct";
import SKProductDiscount from "./storeProducts/SKProductDiscount";
import SKSubscriptionPeriod from "./storeProducts/SKSubscriptionPeriod";
import SkuDetails from "./storeProducts/SkuDetails";
import ActionResult from "./ActionResult";
import QonversionError from "./QonversionError";
import AutomationsEvent from "./AutomationsEvent";

type QLaunchResult = {
  products: Record<string, QProduct>;
  userProducts: Record<string, QProduct>;
  permissions: Record<string, QPermission>;
  uid: string;
  timestamp: number;
};

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

type QPermission = {
  id: string;
  associatedProduct: string;
  active: boolean;
  renewState: number;
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

type QActionResult = {
  type: ActionResultType;
  value: Map<string, string | undefined> | undefined;
  error: QError | undefined;
};

type QError = {
  code: string;
  domain?: string; // ios only
  description: string;
  additionalMessage: string;
};

type QAutomationsEvent = {
  type: AutomationsEventType;
  timestamp: number;
};

const skuDetailsPriceRatio = 1000000;

class Mapper {
  static convertLaunchResult(launchResult: QLaunchResult | null | undefined): LaunchResult {
    if (!launchResult) {
      return {
        uid: '',
        timestamp: new Date().getTime(),
        products: new Map<string, Product>(),
        permissions: new Map<string, Permission>(),
        userProducts: new Map<string, Product>(),
      };
    }

    const products: Map<string, Product> = this.convertProducts(
      launchResult.products
    );
    const permissions: Map<string, Permission> = this.convertPermissions(
      launchResult.permissions
    );
    const userProducts: Map<string, Product> = this.convertProducts(
      launchResult.userProducts
    );
    return new LaunchResult(
      launchResult.uid,
      launchResult.timestamp,
      products,
      permissions,
      userProducts
    );
  }

  static convertPermissions(
    permissions: Record<string, QPermission> | null | undefined
  ): Map<string, Permission> {
    let mappedPermissions = new Map();

    if (!permissions) {
      return mappedPermissions;
    }

    for (const [key, permission] of Object.entries(permissions)) {
      let renewState: RenewState = RenewState.UNKNOWN;

      switch (permission.renewState) {
        case -1:
          renewState = RenewState.NON_RENEWABLE;
          break;
        case 1:
          renewState = RenewState.WILL_RENEW;
          break;
        case 2:
          renewState = RenewState.CANCELED;
          break;
        case 3:
          renewState = RenewState.BILLING_ISSUE;
          break;
      }

      const permissionSource = this.convertPermissionSource(permission.source);

      const mappedPermission = new Permission(
        permission.id,
        permission.associatedProduct,
        permission.active,
        renewState,
        permissionSource,
        permission.startedTimestamp,
        permission.expirationTimestamp
      );
      mappedPermissions.set(key, mappedPermission);
    }

    return mappedPermissions;
  }

  static convertPermissionSource(sourceKey: string): PermissionSource {
    switch (sourceKey) {
      case "Unknown":
        return PermissionSource.UNKNOWN;
      case "AppStore":
        return PermissionSource.APP_STORE;
      case "PlayStore":
        return PermissionSource.PLAY_STORE;
      case "Stripe":
        return PermissionSource.STRIPE;
      case "Manual":
        return PermissionSource.MANUAL;
    }

    return PermissionSource.UNKNOWN;
  }

  static convertProducts(products: Record<string, QProduct> | null | undefined): Map<string, Product> {
    let mappedProducts = new Map();

    if (!products) {
      return mappedProducts;
    }

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

  static convertOfferings(offerings: QOfferings | null | undefined): Offerings | null {
    if (!offerings) {
      return null;
    }

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
    }>  | null | undefined
  ): Map<string, IntroEligibility> {
    let mappedEligibility = new Map<string, IntroEligibility>();

    if (!eligibilityMap) {
      return mappedEligibility;
    }

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

  static convertExperimentInfo(
    experimentInfo: Record<string, { id: string; group: { type: number } }> | null | undefined
  ): Map<string, ExperimentInfo> {
    const mappedExperimentInfo = new Map<string, ExperimentInfo>();

    if (!experimentInfo) {
      return mappedExperimentInfo;
    }

    for (const [key, value] of Object.entries(experimentInfo)) {
      const groupType =
        value.group.type === 1
          ? ExperimentGroupType.GROUP_TYPE_B
          : ExperimentGroupType.GROUP_TYPE_A;
      const group = new ExperimentGroup(groupType);

      const experiment = new ExperimentInfo(value.id, group);
      mappedExperimentInfo.set(key, experiment);
    }

    return mappedExperimentInfo;
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
}

export default Mapper;
