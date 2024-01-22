import SubscriptionPeriod from "../SubscriptionPeriod";
import ProductPrice from "./ProductPrice";
import {PricingPhaseRecurrenceMode, PricingPhaseType} from "../enums";

/**
 * This class represents a pricing phase, describing how a user pays at a point in time.
 */
class ProductPricingPhase {
  /**
   * Price for the current phase.
   */
  price: ProductPrice;

  /**
   * The billing period for which the given price applies.
   */
  billingPeriod: SubscriptionPeriod;

  /**
   * Number of cycles for which the billing period is applied.
   */
  billingCycleCount: number;

  /**
   * Recurrence mode for the pricing phase.
   */
  recurrenceMode: PricingPhaseRecurrenceMode;

  /**
   * Type of the pricing phase.
   */
  type: PricingPhaseType;

  /**
   * True, if the current phase is a trial period. False otherwise.
   */
  isTrial: boolean;

  /**
   * True, if the current phase is an intro period. False otherwise.
   * The intro phase is one of single or recurrent discounted payments.
   */
  isIntro: boolean;

  /**
   * True, if the current phase represents the base plan. False otherwise.
   */
  isBasePlan: boolean;

  constructor(
    price: ProductPrice,
    billingPeriod: SubscriptionPeriod,
    billingCycleCount: number,
    recurrenceMode: PricingPhaseRecurrenceMode,
    type: PricingPhaseType,
    isTrial: boolean,
    isIntro: boolean,
    isBasePlan: boolean,
  ) {
    this.price = price;
    this.billingPeriod = billingPeriod;
    this.billingCycleCount = billingCycleCount;
    this.recurrenceMode = recurrenceMode;
    this.type = type;
    this.isTrial = isTrial;
    this.isIntro = isIntro;
    this.isBasePlan = isBasePlan;
  }
}

export default ProductPricingPhase;
