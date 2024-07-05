import ProductPricingPhase from "./ProductPricingPhase";
import ProductInstallmentPlanDetails from './ProductInstallmentPlanDetails';

/**
 * This class contains all the information about the Google subscription offer details.
 * It might be either a plain base plan details or a base plan with the concrete offer details.
 */
class ProductOfferDetails {
  /**
   * The identifier of the current base plan.
   */
  basePlanId: string;

  /**
   * The identifier of the concrete offer, to which these details belong.
   * Null, if these are plain base plan details.
   */
  offerId: string | null;

  /**
   * A token to purchase the current offer.
   */
  offerToken: string;

  /**
   * List of tags set for the current offer.
   */
  tags: string[];

  /**
   * A time-ordered list of pricing phases for the current offer.
   */
  pricingPhases: ProductPricingPhase[];

  /**
   * A base plan phase details.
   */
  basePlan: ProductPricingPhase | null;

  /**
   * Additional details of an installment plan, if exists.
   */
  installmentPlanDetails: ProductInstallmentPlanDetails | null;

  /**
   * A trial phase details, if exists.
   */
  introPhase: ProductPricingPhase | null;

  /**
   * An intro phase details, if exists.
   * The intro phase is one of single or recurrent discounted payments.
   */
  trialPhase: ProductPricingPhase | null;

  /**
   * True, if there is a trial phase in the current offer. False otherwise.
   */
  hasTrial: boolean;

  /**
   * True, if there is any intro phase in the current offer. False otherwise.
   * The intro phase is one of single or recurrent discounted payments.
   */
  hasIntro: boolean;

  /**
   * True, if there is any trial or intro phase in the current offer. False otherwise.
   * The intro phase is one of single or recurrent discounted payments.
   */
  hasTrialOrIntro: boolean;

  constructor(
    basePlanId: string,
    offerId: string | null,
    offerToken: string,
    tags: string[],
    pricingPhases: ProductPricingPhase[],
    basePlan: ProductPricingPhase | null,
    installmentPlanDetails: ProductInstallmentPlanDetails | null,
    introPhase: ProductPricingPhase | null,
    trialPhase: ProductPricingPhase | null,
    hasTrial: boolean,
    hasIntro: boolean,
    hasTrialOrIntro: boolean,
  ) {
    this.basePlanId = basePlanId;
    this.offerId = offerId;
    this.offerToken = offerToken;
    this.tags = tags;
    this.pricingPhases = pricingPhases;
    this.basePlan = basePlan;
    this.installmentPlanDetails = installmentPlanDetails;
    this.introPhase = introPhase;
    this.trialPhase = trialPhase;
    this.hasTrial = hasTrial;
    this.hasIntro = hasIntro;
    this.hasTrialOrIntro = hasTrialOrIntro;
  }
}

export default ProductOfferDetails;
