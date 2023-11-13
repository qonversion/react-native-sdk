import {ProductTypes} from "./enums";
import ProductOfferDetails from "./ProductOfferDetails";
import ProductInAppDetails from "./ProductInAppDetails";

class ProductStoreDetails {
    basePlanId: string | null;
    defaultOfferDetails: ProductOfferDetails | null;
    description: string;
    hasIntroOffer: boolean;
    hasTrialOffer: boolean;
    hasTrialOrIntroOffer: boolean;
    inAppOfferDetails: ProductInAppDetails | null;
    name: string;
    productId: string;
    productType: ProductTypes;
    subscriptionOfferDetails: ProductOfferDetails[] | null;
    title: string;

    constructor(
        basePlanId: string | null,
        defaultOfferDetails: ProductOfferDetails | null,
        description: string,
        hasIntroOffer: boolean,
        hasTrialOffer: boolean,
        hasTrialOrIntroOffer: boolean,
        inAppOfferDetails: ProductInAppDetails | null,
        name: string,
        productId: string,
        productType: ProductTypes,
        subscriptionOfferDetails: ProductOfferDetails[] | null,
        title: string
    ) {
        this.basePlanId = basePlanId;
        this.defaultOfferDetails = defaultOfferDetails;
        this.description = description;
        this.hasIntroOffer = hasIntroOffer;
        this.hasTrialOffer = hasTrialOffer;
        this.hasTrialOrIntroOffer = hasTrialOrIntroOffer;
        this.inAppOfferDetails = inAppOfferDetails;
        this.name = name;
        this.productId = productId;
        this.productType = productType;
        this.subscriptionOfferDetails = subscriptionOfferDetails;
        this.title = title;
    }
}

export default ProductStoreDetails;
