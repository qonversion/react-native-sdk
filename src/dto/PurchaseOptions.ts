import Product from "./Product";
import {PurchaseUpdatePolicy} from "./enums";

class PurchaseOptions {
    public readonly offerId: string | null = null;
    public readonly applyOffer: boolean | null;
    public readonly oldProduct: Product | null = null;
    public readonly updatePolicy: PurchaseUpdatePolicy | null = null;
    public readonly contextKeys: string[] | null = null;
    public readonly quantity: number;

    constructor (
        offerId: string | null,
        applyOffer: boolean | null,
        oldProduct: Product | null,
        updatePolicy: PurchaseUpdatePolicy | null,
        contextKeys: string[] | null,
        quantity: number
    ) {
        this.offerId = offerId;
        this.applyOffer = applyOffer;
        this.oldProduct = oldProduct;
        this.updatePolicy = updatePolicy;
        this.contextKeys = contextKeys;
        this.quantity = quantity;
    }
}

export default PurchaseOptions;
