import { IntroEligibilityStatus } from "../entities";

class IntroEligibility {
  status?: IntroEligibilityStatus;

  constructor(status: IntroEligibilityStatus | undefined) {
    this.status = status;
  }
}

export default IntroEligibility;
