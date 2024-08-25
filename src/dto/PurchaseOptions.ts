import Product from "./Product";
import {PurchaseUpdatePolicy} from "./enums";

class PurchaseOptions {
    public readonly offerId: string | null;
    public readonly applyOffer: boolean;
    public readonly oldProduct: Product | null;
    public readonly updatePolicy: PurchaseUpdatePolicy | null;
    public readonly contextKeys: string[] | null;
    public readonly quantity: number;

    constructor (
        offerId: string | null,
        applyOffer: boolean,
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
