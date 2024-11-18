import Product from "./Product";
import {PurchaseUpdatePolicy} from "./enums";
import PromotionalOffer from './PromotionalOffer';

class PurchaseOptions {
    public readonly offerId: string | null;
    public readonly applyOffer: boolean;
    public readonly oldProduct: Product | null;
    public readonly updatePolicy: PurchaseUpdatePolicy | null;
    public readonly contextKeys: string[] | null;
    public readonly quantity: number;
    public readonly promotionalOffer: PromotionalOffer | null;

    constructor (
        offerId: string | null,
        applyOffer: boolean,
        oldProduct: Product | null,
        updatePolicy: PurchaseUpdatePolicy | null,
        contextKeys: string[] | null,
        quantity: number,
        promotionalOffer: PromotionalOffer | null
    ) {
        this.offerId = offerId;
        this.applyOffer = applyOffer;
        this.oldProduct = oldProduct;
        this.updatePolicy = updatePolicy;
        this.contextKeys = contextKeys;
        this.quantity = quantity;
        this.promotionalOffer = promotionalOffer;
    }
}

export default PurchaseOptions;
