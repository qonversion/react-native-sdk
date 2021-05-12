import {
  SKProductDiscountPaymentModes,
  SKProductDiscountTypes,
} from "../../enums";
import SKSubscriptionPeriod from "./SKSubscriptionPeriod";

class SKProductDiscount {
  price: string;
  localeIdentifier?: string;
  numberOfPeriods: number;
  subscriptionPeriod?: SKSubscriptionPeriod;
  paymentMode: SKProductDiscountPaymentModes;
  identifier?: string;
  type: SKProductDiscountTypes;

  constructor(
    price: string,
    localeIdentifier: string | undefined,
    numberOfPeriods: number,
    subscriptionPeriod: SKSubscriptionPeriod | undefined,
    paymentMode: SKProductDiscountPaymentModes,
    identifier: string | undefined,
    type: SKProductDiscountTypes
  ) {
    this.price = price;
    this.localeIdentifier = localeIdentifier;
    this.numberOfPeriods = numberOfPeriods;
    this.subscriptionPeriod = subscriptionPeriod;
    this.paymentMode = paymentMode;
    this.identifier = identifier;
    this.type = type;
  }
}

export default SKProductDiscount;
