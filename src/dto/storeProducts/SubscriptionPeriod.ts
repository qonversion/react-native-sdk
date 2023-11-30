import {SubscriptionPeriodUnit} from "../enums";

/**
 * A class describing a subscription period
 */
class SubscriptionPeriod {
  /**
   * A count of subsequent intervals.
   */
  unitCount: number;

  /**
   * Interval unit.
   */
  unit: SubscriptionPeriodUnit;

  /**
   * ISO 8601 representation of the period.
   */
  iso: string;

  constructor(
    unitCount: number,
    unit: SubscriptionPeriodUnit,
    iso: string,
  ) {
    this.unitCount = unitCount;
    this.unit = unit;
    this.iso = iso;
  }
}

export default SubscriptionPeriod;
