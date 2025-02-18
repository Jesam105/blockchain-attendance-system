const sha256 = require("sha256"); // Import the sha256 hashing function

class Blockchain {
    constructor() {
        this.chain = []; // Initialize an empty array to store the blockchain
        this.pendingTransactions = []; // Initialize an empty array to store pending transactions
        this.createNewBlock(100, '0', '0'); // Create the genesis block with arbitrary values
    }

    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1, // Set the index of the new block
            timestamp: Date.now(), // Set the timestamp of the new block
            transactions: this.pendingTransactions, // Include all pending transactions in the new block
            nonce: nonce, // Include the nonce used to mine the new block
            hash: hash, // Include the hash of the new block
            previousBlockHash: previousBlockHash, // Include the hash of the previous block
        };

        this.pendingTransactions = []; // Reset pending transactions after creating a block
        this.chain.push(newBlock); // Add the new block to the blockchain
        return newBlock; // Return the new block
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]; // Return the last block in the blockchain
    }

    getAllTransactions() {
        let transactions = []; // Initialize an empty array to store all transactions
        this.chain.forEach(block => { // Iterate over each block in the blockchain
            block.transactions.forEach(transaction => { // Iterate over each transaction in the block
                transactions.push(transaction); // Add the transaction to the transactions array
            });
        });
        return transactions; // Return all transactions from the blockchain
    }

    createNewTransaction(studentId, name, status = "Present") {
        const newTransaction = {
            studentId: studentId, // Set the student ID for the transaction
            name: name, // Set the name for the transaction
            status: status, // Set the status for the transaction (default to 'Present')
            timestamp: new Date().toISOString(), // Set the timestamp for the transaction
        };

        this.pendingTransactions.push(newTransaction); // Add the new transaction to pending transactions
        return newTransaction; // Return the new transaction
    }

    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString =
            previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData); // Concatenate previous block hash, nonce, and current block data
        return sha256(dataAsString); // Return the SHA-256 hash of the concatenated string
    }

    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0; // Initialize nonce to 0
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce); // Calculate the hash with the initial nonce
        while (hash.substring(0, 4) !== '0000') { // Check if the hash meets the difficulty level (leading 0000)
            nonce++; // Increment the nonce
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce); // Recalculate the hash with the new nonce
        }
        return nonce; // Return the nonce that produces a hash meeting the difficulty level
    }
}

module.exports = Blockchain; // Export the Blockchain class for use in other parts of the application