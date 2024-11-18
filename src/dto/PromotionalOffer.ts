import SKProductDiscount from './storeProducts/SKProductDiscount';
import SKPaymentDiscount from './storeProducts/SKPaymentDiscount';

class PromotionalOffer {
    public readonly productDiscount: SKProductDiscount;
    public readonly paymentDiscount: SKPaymentDiscount;

    constructor (
        productDiscount: SKProductDiscount,
        paymentDiscount: SKPaymentDiscount
    ) {
        this.productDiscount = productDiscount;
        this.paymentDiscount = paymentDiscount;
    }
}

export default PromotionalOffer;
