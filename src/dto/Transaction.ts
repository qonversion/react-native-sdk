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
        transactionTimestamp: number,
        environment: TransactionEnvironment,
        ownershipType: TransactionOwnershipType,
        type: TransactionType,
        expirationTimestamp: number | undefined,
        transactionRevocationTimestamp: number | undefined,
        offerCode: string | undefined,
    ) {
        this.originalTransactionId = originalTransactionId;
        this.transactionId = transactionId;
        this.transactionDate = new Date(transactionTimestamp);
        this.environment = environment;
        this.ownershipType = ownershipType;
        this.type = type;
        this.expirationDate = expirationTimestamp ? new Date(expirationTimestamp) : undefined;
        this.transactionRevocationDate = transactionRevocationTimestamp ? new Date(transactionRevocationTimestamp) : undefined;
        this.offerCode = offerCode;
    }
}

export default Transaction;
