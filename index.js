// @ts-ignore
import { NativeModules, Platform } from 'react-native';

const { RNQonversion } = NativeModules;

export default class Qonversion {

    static async launchWithKey(key: string, observerMode: Boolean = false): Promise<LaunchResult> {
        const response: Object = await RNQonversion.launchWithKey(key, observerMode);
        const launchResult: LaunchResult = Mapper.convertLaunchResult(response);

        return launchResult;
    }

    static setProperty(property: Property, value: string) {
        RNQonversion.setProperty(property, value);
    }

    static setUserProperty(property: string, value: string) {
        RNQonversion.setUserProperty(property, value);
    }

    static setUserId(userId: string) {
        RNQonversion.setUserId(userId);
    }

    static addAttributionData(data: Object, provider: Provider) {
        RNQonversion.addAttributionData(data, provider);
    }

    static async checkPermissions(): Promise<Map<string, Permission>> {
        const permissions = await RNQonversion.checkPermissions();
        const mappedPermissions: Map<string, Permission> = Mapper.convertPermissions(permissions);

        return mappedPermissions;
    }

    static async purchase(productId: string): Promise<Map<string, Permission>> {
        const permissions = await RNQonversion.purchase(productId);

        const mappedPermissions: Map<string, Permission> = Mapper.convertPermissions(permissions);

        return mappedPermissions;
    }

    static async updatePurchase(productId: string, oldProductId: string, prorationMode: ProrationMode = null): Promise<Map<string, Permission>> {
        if (Platform.OS === 'ios') {
            return null;
        }

        let permissions;
        if (prorationMode == null) {
            permissions = await RNQonversion.updatePurchase(productId, oldProductId);
        } else {
            permissions = await RNQonversion.updatePurchaseWithProrationMode(productId, oldProductId, prorationMode);
        }

        const mappedPermissions: Map<string, Permission> = Mapper.convertPermissions(permissions);

        return mappedPermissions;
    }

    static async products(): Promise<Map<string, Product>> {
        let products = await RNQonversion.products();
        const mappedProducts: Map<string, Product> = Mapper.convertProducts(products);

        return mappedProducts
    }

    static async offerings(): Promise<Offerings> {
        let offerings = await RNQonversion.offerings();
        const mappedOfferings: Offerings = Mapper.convertOfferings(offerings);

        return mappedOfferings
    }

    static async restore(): Promise<Map<string, Permission>> {
        const permissions = await RNQonversion.restore();

        const mappedPermissions: Map<string, Permission> = Mapper.convertPermissions(permissions);

        return mappedPermissions;
    }

    static async checkTrialIntroEligibilityForProductIds(ids: string[]): Promise<Map<string, Permission>> {
        const eligibilityInfo = await RNQonversion.checkTrialIntroEligibilityForProductIds(ids);

        const mappedEligibility: Map<string, IntroEligibility> = Mapper.convertEligibility(eligibilityInfo);

        return mappedEligibility;
    }

    static async experiments(): Promise<Map<string, ExperimentInfo>> {
        const experiments = await RNQonversion.experiments();

        const mappedExperiments: Map<string, ExperimentInfo> = Mapper.convertExperimentInfo(experiments);

        return mappedExperiments;
    }

    static syncPurchases() {
        if (Platform.OS === 'ios') {
            return;
        }

        RNQonversion.syncPurchases();
    }

    static setDebugMode() {
        RNQonversion.setDebugMode();
    }
}

// Mapper

class Mapper {
    static convertLaunchResult(launchResult: Object): LaunchResult {
        const products: Map<string, Product> = this.convertProducts(launchResult.products);
        const permissions: Map<string, Permission> = this.convertPermissions(launchResult.permissions);
        const userProducts: Map<string, Product> = this.convertProducts(launchResult.user_products);
        return new LaunchResult(launchResult.uid, launchResult.timestamp, products, permissions, userProducts);
    }

    static convertPermissions(permissions: Object[]): Map<string, Permission> {
        let mappedPermissions = new Map();

        for (const [key, permission] of Object.entries(permissions)) {
            let renewState: RenewState = RenewState.UNKNOWN;

            switch (permission.renew_state) {
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

            const mappedPermission = new Permission(permission.id, permission.associated_product, !!permission.active, renewState, Date(permission.started_timestamp), Date(permission.expiration_timestamp))
            mappedPermissions.set(key, mappedPermission);
        }

        return mappedPermissions;
    }

    static convertProducts(products: Object[]): Map<string, Product> {
        let mappedProducts = new Map();

        for (const [key, product] of Object.entries(products)) {
            const mappedProduct = this.convertProduct(product);
            mappedProducts.set(key, mappedProduct);
        }

        return mappedProducts;
    }

    static convertProduct(product: Object): Product {
        const productType: ProductType = ProductType[product.type];
        const productDuration: ProductDuration = ProductDuration[product.duration];
        const trialDuration: TrialDuration = TrialDuration[product.trialDuration];

        let skProduct: SKProduct | null = null;
        let skuDetails: SkuDetails | null = null;
        let price: number | undefined;
        let currencyCode: string | undefined;

        if (product.storeProduct != null) {
            if (Platform.OS === 'ios') {
                skProduct = Mapper.convertSKProduct(product.storeProduct);
                price = parseFloat(skProduct.price);
                currencyCode = skProduct.currencyCode;
            } else {
                skuDetails = Mapper.convertSkuDetails(product.storeProduct);
                price = skuDetails.priceAmountMicros / 1000000;
                currencyCode = skuDetails.priceCurrencyCode;
            }
        }

        const mappedProduct = new Product(product.id, product.store_id, productType, productDuration, skuDetails, skProduct, product.prettyPrice, trialDuration, price, currencyCode);

        return mappedProduct;
    }

    static convertOfferings(offerings: Object): Offerings {
        if (!Array.isArray(offerings.availableOfferings) || offerings.availableOfferings.length === 0) {
            return null;
        }

        let mainOffering: Offering | null = null;
        if (offerings.main) {
            mainOffering = this.convertOffering(offerings.main);
        }

        let availableOfferings = [];

        offerings.availableOfferings.forEach(offering => {
            const mappedOffering: Offering = this.convertOffering(offering);

            availableOfferings.push(mappedOffering);
        });

        return new Offerings(mainOffering, availableOfferings);
    }

    static convertOffering(offering: Object): Offering {
        let products = [];
        offering.products.forEach(product => {
            const mappedProduct = this.convertProduct(product);

            products.push(mappedProduct);
        });

        let tag: OfferingTag = OfferingTag[offering.tag];
        if (tag == null) {
            tag = OfferingTag["0"];
        }

        return new Offering(offering.id, tag, products);
    }

    static convertSkuDetails(skuDetails: Object): SkuDetails {
        return new SkuDetails(skuDetails.description,
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
            skuDetails.toString);
    }

    static convertSKProduct(skProduct: Object): SKProduct {
        let subscriptionPeriod: SKSubscriptionPeriod;
        if (skProduct.subscriptionPeriod != null) {
            subscriptionPeriod = this.convertSubscriptionPeriod(skProduct.subscriptionPeriod);
        }

        let discount: SKProductDiscount;
        if (skProduct.introductoryPrice) {
            discount = this.convertProductDiscount(skProduct.introductoryPrice);
        }

        let discounts: SKProductDiscount[];
        if (Array.isArray(skProduct.discounts) && skProduct.discounts.length) {
            discounts = this.convertDiscounts(skProduct.discounts);
        }

        return new SKProduct(
            skProduct.localizedDescription,
            skProduct.localizedTitle,
            skProduct.price,
            skProduct.localeIdentifier,
            skProduct.productIdentifier,
            !!skProduct.isDownloadable,
            skProduct.downloadContentVersion,
            skProduct.downloadContentLengths,
            subscriptionPeriod,
            discount,
            discounts,
            skProduct.subscriptionGroupIdentifier,
            skProduct.isFamilyShareable,
            skProduct.currencyCode
        );
    }

    static convertSubscriptionPeriod(subscriptionPeriod: Object): SKSubscriptionPeriod {
        return new SKSubscriptionPeriod(subscriptionPeriod.numberOfUnits, SKPeriodUnit[subscriptionPeriod.unit]);
    }

    static convertProductDiscount(discount: Object): SKProductDiscount {
        let subscriptionPeriod: SKSubscriptionPeriod;
        if (discount.subscriptionPeriod != null) {
            subscriptionPeriod = this.convertSubscriptionPeriod(discount.subscriptionPeriod);
        }
        return new SKProductDiscount(
            discount.price,
            discount.localeIdentifier,
            discount.numberOfPeriods,
            subscriptionPeriod,
            SKProductDiscountPaymentMode[discount.paymentMode],
            discount.identifier,
            SKProductDiscountType[discount.type]
        );
    }

    static convertDiscounts(discounts: Object[]): SKProductDiscount[] {
        const mappedDiscounts: SKProductDiscount[] = discounts.map((discount) => {
            return this.convertProductDiscount(discount);
        });
    }

    static convertEligibility(eligibilityInfo: Object[]): Map<string, IntroEligibility> {
        let mappedEligibility = new Map();

        for (const info of eligibilityInfo) {
            const productId = info.productId;
            const status = Mapper.convertEligibilityStatus(info.status);

            const eligibilityInfo = new IntroEligibility(status);
            mappedEligibility.set(productId, eligibilityInfo);
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

    static convertExperimentInfo(experimentInfo: Object[]): ExperimentInfo {
        let mappedExperimentInfo = new Map();

        for (const info of experimentInfo) {
            const groupType = info.group.type === 1 ? ExperimentGroupType.GROUP_TYPE_B : ExperimentGroupType.GROUP_TYPE_A;
            const group = new ExperimentGroup(groupType);

            const experiment = new ExperimentInfo(info.id, group);
            mappedExperimentInfo.set(experiment.identifier, experiment);
        }

        return mappedExperimentInfo;
    }
}

// Entities

export const ProductType = Object.freeze({"0":"TRIAL", "1":"DIRECT_SUBSCRIPTION", "2":"ONE_TIME"})

export const ProductDuration = Object.freeze({
    0:"WEEKLY",
    1:"MONTHLY",
    2:"3_MONTHS",
    3:"6_MONTHS",
    4:"ANNUAL",
    5:"LIFETIME"
})

export const TrialDuration = Object.freeze({
    "-1":"NOT_AVAILABLE",
    "1":"THREE_DAYS",
    "2":"WEEK",
    "3":"TWO_WEEKS",
    "4":"MONTH",
    "5":"TWO_MONTHS",
    "6":"THREE_MONTHS",
    "7":"SIX_MONTHS",
    "8":"YEAR",
    "9":"OTHER"
})

export const RenewState = Object.freeze({
    "NON_RENEWABLE":-1,
    "UNKNOWN":0,
    "WILL_RENEW":1,
    "CANCELED":2,
    "BILLING_ISSUE":3
})

export const Property = Object.freeze({
    "EMAIL":0,
    "NAME":1,
    "APPS_FLYER_USER_ID":2,
    "ADJUST_USER_ID":3,
    "KOCHAVA_DEVICE_ID":4,
    "CUSTOM_USER_ID":5,
    "FACEBOOK_ATTRIBUTION":6
})

export const Provider = Object.freeze({
    "APPSFLYER":0,
    "BRANCH":1,
    "ADJUST":2,
    "APPLE":3
})

export const ProrationMode = Object.freeze({
    "UNKNOWN_SUBSCRIPTION_UPGRADE_DOWNGRADE_POLICY":0,
    "IMMEDIATE_WITH_TIME_PRORATION":1,
    "IMMEDIATE_AND_CHARGE_PRORATED_PRICE":2,
    "IMMEDIATE_WITHOUT_PRORATION":3,
    "DEFERRED":4
})

export const SKPeriodUnit = Object.freeze({
    0:"DAY",
    1:"WEEK",
    2:"MONTH",
    3:"YEAR"
})

export const SKProductDiscountType = Object.freeze({
    0:"INTRODUCTORY",
    1:"SUBSCRIPTION"
})

export const SKProductDiscountPaymentMode = Object.freeze({
    0:"PAY_AS_YOU_GO",
    1:"PAY_UP_FRONT",
    2:"FREE_TRIAL"
})

export const OfferingTag = Object.freeze({
    0:"NONE",
    1:"MAIN"
})

export const IntroEligibilityStatus = Object.freeze({
    UNKNOWN:"unknown",
    NON_INTRO_OR_TRIAL_PRODUCT:"non_intro_or_trial_product",
    ELIGIBLE:"intro_or_trial_eligible",
    INELIGIBLE:"intro_or_trial_ineligible"
})

export const ExperimentGroupType = Object.freeze({
    GROUP_TYPE_A: 0,
    GROUP_TYPE_B: 1
})

export class LaunchResult {
    constructor(uid: string, timestamp: number, products: Map<string, Product>, permissions: Map<string, Permission>, userProducts: Map<string, Product>) {
        this.uid = uid;
        this.timestamp = timestamp;
        this.products = products;
        this.permissions = permissions;
        this.userProducts = userProducts;
    }
}

export class Product {
    constructor(qonversionID: string,
                storeID: string,
                type: ProductType,
                duration: ProductDuration,
                skuDetails: SkuDetails | null,
                skProduct: SKProduct | null,
                prettyPrice: string | undefined,
                trialDuration: TrialDuration | undefined,
                price: number | undefined,
                currencyCode: string | undefined) {
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

export class Permission {
    constructor(permissionID: string,
                productID: string,
                isActive: boolean,
                renewState: RenewState,
                startedDate: Date,
                expirationDate: Date | undefined) {
        this.permissionID = permissionID;
        this.productID = productID;
        this.isActive = isActive;
        this.renewState = renewState;
        this.startedDate = startedDate;
        this.expirationDate = expirationDate;
    }
}

export class Offerings {
    constructor(main: Offering | null, availableOfferings: Offering[]) {
        this.main = main;
        this.availableOffering = availableOfferings;
    }

    offeringForIdentifier(identifier: string): Offering | undefined {
        return this.availableOffering.find(object => object.id === identifier);
    }
}

export class Offering {
    constructor(id: string, tag: OfferingTag, products: Product[]) {
        this.id = id;
        this.tag = tag;
        this.products = products;
    }

    productForIdentifier(identifier: string): Product | undefined {
        return this.products.find(object => object.qonversionID === identifier);
    }
}

export class IntroEligibility {
    constructor(status: IntroEligibilityStatus | undefined) {
        this.status = status;
    }
}

export class ExperimentInfo {
    constructor(identifier: string, group: ExperimentGroup) {
        this.identifier = identifier;
        this.group = group;
    }
}

export class ExperimentGroup {
    constructor(type: ExperimentGroupType) {
        this.type = type;
    }
}

// Store products

export class SkuDetails {
    constructor(description: string,
                freeTrialPeriod: string,
                iconUrl: string,
                introductoryPrice: string,
                introductoryPriceAmountMicros: number,
                introductoryPriceCycles: number,
                introductoryPricePeriod: string,
                originalJson: string,
                originalPrice: string,
                originalPriceAmountMicros: number,
                price: string,
                priceAmountMicros: number,
                priceCurrencyCode: string,
                sku: string,
                subscriptionPeriod: string,
                title: string,
                type: string,
                hashCode: number,
                toString: string) {
        this.description = description;
        this.freeTrialPeriod = freeTrialPeriod;
        this.iconUrl = iconUrl;
        this.introductoryPrice = introductoryPrice;
        this.introductoryPriceAmountMicros = introductoryPriceAmountMicros;
        this.introductoryPriceCycles = introductoryPriceCycles;
        this.introductoryPricePeriod = introductoryPricePeriod;
        this.originalJson = originalJson;
        this.originalPrice = originalPrice;
        this.originalPriceAmountMicros = originalPriceAmountMicros;
        this.price = price;
        this.priceAmountMicros = priceAmountMicros;
        this.priceCurrencyCode = priceCurrencyCode;
        this.sku = sku;
        this.subscriptionPeriod = subscriptionPeriod;
        this.title = title;
        this.type = type;
        this.hashCode = hashCode;
        this.toString = toString;
    }
}

export class SKProduct {
    constructor(localizedDescription: string | undefined,
                localizedTitle: string | undefined,
                price: string,
                localeIdentifier: string | undefined,
                productIdentifier: string | undefined,
                isDownloadable: boolean,
                downloadContentVersion: string | undefined,
                downloadContentLengths: number[] | undefined,
                subscriptionPeriod: SKSubscriptionPeriod | undefined,
                productDiscount: SKProductDiscount | undefined,
                discounts: SKProductDiscount[] | undefined,
                subscriptionGroupIdentifier: string | undefined,
                isFamilyShareable: boolean | undefined,
                currencyCode: string) {
        this.localizedDescription = localizedDescription;
        this.localizedTitle = localizedTitle;
        this.price = price;
        this.localeIdentifier = localeIdentifier;
        this.productIdentifier = productIdentifier;
        this.isDownloadable = isDownloadable;
        this.downloadContentVersion = downloadContentVersion;
        this.downloadContentLengths = downloadContentLengths;
        this.subscriptionPeriod = subscriptionPeriod;
        this.productDiscount = productDiscount;
        this.discounts = discounts;
        this.subscriptionGroupIdentifier = subscriptionGroupIdentifier;
        this.isFamilyShareable = isFamilyShareable;
        this.currencyCode = currencyCode;
    }
}

export class SKSubscriptionPeriod {
    constructor(numberOfUnits: number, unit: SKPeriodUnit) {
        this.numberOfUnits = numberOfUnits;
        this.unit = unit;
    }
}

export class SKProductDiscount {
    constructor(price: string,
                localeIdentifier: string | undefined,
                numberOfPeriods: number,
                subscriptionPeriod: SKSubscriptionPeriod | undefined,
                paymentMode: SKProductDiscountPaymentMode,
                identifier: string | undefined,
                type: SKProductDiscountType) {
        this.price = price;
        this.localeIdentifier = localeIdentifier;
        this.numberOfPeriods = numberOfPeriods;
        this.subscriptionPeriod = subscriptionPeriod;
        this.paymentMode = paymentMode;
        this.identifier = identifier;
        this.type = type;
    }
}
