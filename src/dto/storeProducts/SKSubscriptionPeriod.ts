import { SKPeriodUnits } from "../enums";

class SKSubscriptionPeriod {
  numberOfUnits: number;
  unit: SKPeriodUnits;

  constructor(numberOfUnits: number, unit: SKPeriodUnits) {
    this.numberOfUnits = numberOfUnits;
    this.unit = unit;
  }
}

export default SKSubscriptionPeriod;
