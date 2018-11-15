// JavaScript source code Blockchain.js

const LevelDatabase = require('./LevelDatabase.js');

//const level = require('level');
//const chainDB = './chaindata';
//const db = level(chainDB);

class Blockchain {
    constructor() {
        //verify Genesis block and create if necessary
        this.db = new LevelDatabase.LevelDatabase();
        this.verifyGenesisBlock();
    }

    async verifyGenesisBlock() {
        console.log("in verifyGenesisBlock - trying to verify the genesis block");
        const height = await this.getBlockHeight();
        console.log("in verifyGenesisBlock - BlockHeight is: " + height);
        if (height === (-1)) {
            let genesisBlock = new Block("First Block - Genesis Block")
            // UTC timestamp
            genesisBlock.time = new Date().getTime().toString().slice(0, -3);
            // create a Hash
            genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
            // Add to LevelDB

            await addDataToLevelDB(genesisBlock);
        }
    }

    // Add new block to blockchain
    async addBlock(newBlock) {
        // Block height
        let prevBlockHeight = await this.getBlockHeight();
        newBlock.height = prevBlockHeight + 1;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (newBlock.height > 0) {
            let prevBlock = await this.getBlock(prevBlockHeight);
            newBlock.previousBlockHash = prevBlock.hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Adding block object to chain

        await addDataToLevelDB(newBlock); // add the new block
    }


    // Find the height of the last block per submission requirements
    getBlockHeight() {
        return new Promise((resolve, reject) => {
            let i = -1;
            // Read the entire blockchain and count the blocks
            console.log("in getBlockHeight about to read the stream and i is: " + i);
            try {
                console.log("in getBlockHeight and db is: " + this.db);

                const db = this.db
                //console.log("in getBlockHeight and db is: " + db);
                db.createReadStream()
                    .on('data', data => {
                        i++;
                    })
                    .on('error', err => reject(err))
                    .on('close', () => {
                        console.log("in getBlockHeight and closing i is: " + i);
                        resolve(i);
                    });
            }
            catch (err) { console.log("in getBlockHeight and had catch error : " + err); }
        });
    }


    // Return a requested block from the blockchain using blockHeight as the key in the database
    async getBlock(blockHeight) {
        try {
            // wait for requested block to arrive and then return
            return await getLevelDBData(blockHeight);
        } catch (err) {
            console.log(err);
        }
    }


    // validate block
    async validateBlock(key) {
        // get block object
        let block = await this.getBlock(key);
        console.log("validateBlock block #" + key + " block is: " + JSON.stringify(block));
        // get block hash
        let blockHash = block.hash;
        console.log("validateBlock# " + key + " and the hash is: " + blockHash);
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
            console.log("block: " + key + " has valid hash is: " + blockHash);
            return true;
        } else {
            console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            return false;
        }
    }


    // Validate blockchain
    async validateChain() {
        // save errors in array
        let errorLog = [];
        let lastBlockHeight = await this.getBlockHeight();
        console.log("validateChain number of blocks are: " + (lastBlockHeight + 1));
        let i = 0;
        do {
            // validate block
            let validBlock = await this.validateBlock(i);
            if (!validBlock) errorLog.push(i);
            // Retrieve current block and nextBlock then compare hash and previousHash to validate chain
            let block = await this.getBlock(i);
            let blockHash = block.hash;
            let nextBlock = await this.getBlock(i + 1);
            let previousHash = nextBlock.previousBlockHash;
            console.log("in validateChain and blockHash block: " + i + " is: " + blockHash);
            console.log("in validateChain and previousHash for block: " + (i + 1) + " is: " + previousHash);
            i++;
            // verify current blockHash in the current block is same as previousHash in nextBlock
            if (blockHash !== previousHash) {
                errorLog.push(i);
            }
        } while (i < lastBlockHeight);
        //validate last block does not have next block to validate previous hash
        let validBlock = await this.validateBlock(i);
        if (!validBlock) errorLog.push(i);
        // if errors detected send to console
        if (errorLog.length > 0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: ' + errorLog);
            return false;
        } else {
            console.log('No errors detected');
            return true;
        }
    }
}

module.exports.Blockchain = Blockchain;
