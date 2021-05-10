import {
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
} from "../../enums";
import SKSubscriptionPeriod from "./SKSubscriptionPeriod";

class SKProductDiscount {
  price: string;
  localeIdentifier?: string;
  numberOfPeriods: number;
  subscriptionPeriod?: SKSubscriptionPeriod;
  paymentMode: SKProductDiscountPaymentMode;
  identifier?: string;
  type: SKProductDiscountType;

  constructor(
    price: string,
    localeIdentifier: string | undefined,
    numberOfPeriods: number,
    subscriptionPeriod: SKSubscriptionPeriod | undefined,
    paymentMode: SKProductDiscountPaymentMode,
    identifier: string | undefined,
    type: SKProductDiscountType
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
