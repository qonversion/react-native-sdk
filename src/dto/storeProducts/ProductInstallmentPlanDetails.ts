/**
 * This class represents the details about the installment plan for a subscription product.
 */
class ProductInstallmentPlanDetails {
  /**
   * Committed payments count after a user signs up for this subscription plan.
   */
  commitmentPaymentsCount: number;

  /**
   * Subsequent committed payments count after this subscription plan renews.
   *
   * Returns 0 if the installment plan doesn't have any subsequent commitment,
   * which means this subscription plan will fall back to a normal
   * non-installment monthly plan when the plan renews.
   */
  subsequentCommitmentPaymentsCount: number;

  constructor(
    commitmentPaymentsCount: number,
    subsequentCommitmentPaymentsCount: number
  ) {
    this.commitmentPaymentsCount = commitmentPaymentsCount;
    this.subsequentCommitmentPaymentsCount = subsequentCommitmentPaymentsCount;
  }
}

export default ProductInstallmentPlanDetails;
