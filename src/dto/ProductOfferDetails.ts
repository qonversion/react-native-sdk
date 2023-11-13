import ProductPricingPhase from "./ProductPricingPhase";

class ProductOfferDetails {
    basePlanId: string;
    hasIntro: boolean;
    hasTrial: boolean;
    hasTrialOrIntro: boolean;
    introPhase: ProductPricingPhase | null;
    pricingPhases: ProductPricingPhase[];
    offerId: string | null;
    offerToken: string;
    tags: string[];
    trialPhase: ProductPricingPhase | null;

    constructor(
        basePlanId: string,
        hasIntro: boolean,
        hasTrial: boolean,
        hasTrialOrIntro: boolean,
        introPhase: ProductPricingPhase | null,
        pricingPhases: ProductPricingPhase[],
        offerId: string | null,
        offerToken: string,
        tags: string[],
        trialPhase: ProductPricingPhase | null
    ) {
        this.basePlanId = basePlanId;
        this.hasIntro = hasIntro;
        this.hasTrial = hasTrial;
        this.hasTrialOrIntro = hasTrialOrIntro;
        this.introPhase = introPhase;
        this.pricingPhases = pricingPhases;
        this.offerId = offerId;
        this.offerToken = offerToken;
        this.tags = tags;
        this.trialPhase = trialPhase;
    }
}

export default ProductOfferDetails;
