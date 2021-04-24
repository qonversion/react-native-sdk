import { SKPeriodUnit } from "../../enums";

class SKSubscriptionPeriod {
  numberOfUnits: number;
  unit: SKPeriodUnit;

  constructor(numberOfUnits: number, unit: SKPeriodUnit) {
    this.numberOfUnits = numberOfUnits;
    this.unit = unit;
  }
}

export default SKSubscriptionPeriod;
