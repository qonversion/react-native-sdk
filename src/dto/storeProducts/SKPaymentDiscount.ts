class SKPaymentDiscount {
    identifier: string;
    keyIdentifier: string;
    nonce: string;
    signature: string;
    timestamp: number;

    constructor (
        identifier: string,
        keyIdentifier: string,
        nonce: string,
        signature: string,
        timestamp: number,
    ) {
        this.identifier = identifier;
        this.keyIdentifier = keyIdentifier;
        this.nonce = nonce;
        this.signature = signature;
        this.timestamp = timestamp;
    }
}

export default SKPaymentDiscount;
