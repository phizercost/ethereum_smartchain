class TransactionQueue {
    constructor(){
        this.transactionMap = {};
    }

    add(transaction){
        this.transactionMap[transaction.id] = transaction;
    }

    //List of transaction in Ethereum are series
    getTransactionSeries(){
        return Object.values(this.transactionMap);
    }
}

module.exports = TransactionQueue;