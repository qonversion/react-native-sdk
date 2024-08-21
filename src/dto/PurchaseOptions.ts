import Product from "./Product";
import {PurchaseUpdatePolicy} from "./enums";
import ProductOfferDetails from "./storeProducts/ProductOfferDetails";

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

class PurchaseOptionsBuilder {
    private offerId: string | null = null;
    private applyOffer: boolean = true;
    private oldProduct: Product | null = null;
    private updatePolicy: PurchaseUpdatePolicy | null = null;
    private contextKeys: string[] | null = null;
    private quantity: number = 1;

    /**
     * iOS only.
     * Set quantity of product purchasing. Use for consumable in-app products.
     * @param quantity of product purchasing.
     * @return builder instance for chain calls.
     */
    setQuantity(quantity: number): PurchaseOptionsBuilder {
        this.quantity = quantity;
        return this;
    }

    /**
     * Set offer for the purchase.
     * @param offer concrete offer which you'd like to purchase.
     * @return builder instance for chain calls.
     */
    setOffer(offer: ProductOfferDetails) {
        this.offerId = offer.offerId;
        return this;
    }

    /**
     * Set the offer Id to the purchase.
     * If [offerId] is not specified, then the default offer will be applied. To know how we choose
     * the default offer, see [QProductStoreDetails.defaultSubscriptionOfferDetails].
     * @param offerId concrete offer Id which you'd like to purchase.
     * @return builder instance for chain calls.
     */
    setOfferId(offerId: string): PurchaseOptionsBuilder {
        this.offerId = offerId;
        return this;
    }

    /**
     * Call this function to remove any intro/trial offer from the purchase (use only a bare base plan).
     * @return builder instance for chain calls.
     */
    removeOffer(): PurchaseOptionsBuilder {
        this.applyOffer = false;
        return this;
    }

    /**
     * Set context keys associated with a purchase.
     *
     * @param oldProduct Qonversion product from which the upgrade/downgrade
     * will be initialized.
     * @return builder instance for chain calls.
     */
    setOldProduct(oldProduct: Product): PurchaseOptionsBuilder {
        this.oldProduct = oldProduct;
        return this;
    }

    /**
     * Set the update policy for the purchase.
     * If the [updatePolicy] is not provided, then default one
     * will be selected - [QPurchaseUpdatePolicy.WithTimeProration].
     * @param updatePolicy update policy for the purchase.
     * @return builder instance for chain calls.
     */
    setUpdatePolicy(updatePolicy: PurchaseUpdatePolicy): PurchaseOptionsBuilder {
        this.updatePolicy = updatePolicy;
        return this;
    }

    /**
     * Set the context keys associated with a purchase.
     *
     * @param contextKeys context keys for the purchase.
     * @return builder instance for chain calls.
     */
    setContextKeys(contextKeys: string[]): PurchaseOptionsBuilder {
        this.contextKeys = contextKeys;
        return this;
    }

    /**
     * Generate [PurchaseOptions] instance with all the provided options.
     * @return the complete [PurchaseOptions] instance.
     */
    build(): PurchaseOptions {
        return new PurchaseOptions(this.offerId, this.applyOffer, this.oldProduct, this.updatePolicy, this.contextKeys, this.quantity)
    }

}

export default PurchaseOptions;
