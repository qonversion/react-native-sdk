import {TransactionEnvironment, TransactionOwnershipType, TransactionType} from "./enums";

class Transaction {
    originalTransactionId: string;
    transactionId: string;
    transactionDate: Date;
    environment: TransactionEnvironment;
    ownershipType: TransactionOwnershipType;
    type: TransactionType;
    expirationDate?: Date;
    transactionRevocationDate?: Date;
    offerCode?: string;

    constructor(
        originalTransactionId: string,
        transactionId: string,
        transactionDate: number,
        environment: TransactionEnvironment,
        ownershipType: TransactionOwnershipType,
        type: TransactionType,
        expirationDate: number | undefined,
        transactionRevocationDate: number | undefined,
        offerCode?: string | undefined,
    ) {
        this.originalTransactionId = originalTransactionId;
        this.transactionId = transactionId;
        this.transactionDate = new Date(transactionDate);
        this.environment = environment;
        this.ownershipType = ownershipType;
        this.type = type;
        this.expirationDate = expirationDate ? new Date(expirationDate) : undefined;
        this.transactionRevocationDate = transactionRevocationDate ? new Date(transactionRevocationDate) : undefined;
        this.offerCode = offerCode;
    }
}

export default Transaction;
