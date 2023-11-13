import ProductPeriod from "./ProductPeriod";
import ProductPrice from "./ProductPrice";
import {PricingPhaseRecurrenceMode, PricingPhaseType} from "./enums";

class ProductPricingPhase {
    billingCycleCount: number;
    billingPeriod: ProductPeriod;
    isBasePlan: boolean;
    isIntro: boolean;
    isTrial: boolean;
    price: ProductPrice;
    recurrenceMode: PricingPhaseRecurrenceMode;
    type: PricingPhaseType;

    constructor(
        billingCycleCount: number,
        billingPeriod: ProductPeriod,
        isBasePlan: boolean,
        isIntro: boolean,
        isTrial: boolean,
        price: ProductPrice,
        recurrenceMode: PricingPhaseRecurrenceMode,
        type: PricingPhaseType
    ) {
        this.billingCycleCount = billingCycleCount;
        this.billingPeriod = billingPeriod;
        this.isBasePlan = isBasePlan;
        this.isIntro = isIntro;
        this.isTrial = isTrial;
        this.price = price;
        this.recurrenceMode = recurrenceMode;
        this.type = type;
    }
}

export default ProductPricingPhase;
