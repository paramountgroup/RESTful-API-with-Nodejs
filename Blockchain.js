// JavaScript source code Blockchain.js
const SHA256 = require('crypto-js/sha256');
const LevelDatabase = require('./LevelDatabase.js');
const Block = require('./Block.js');
const level = require('level');

//const level = require('level');
//const chainDB = './chaindata';
//const db = level(chainDB);

class Blockchain {
    constructor() {
        //verify Genesis block and create if necessary
        this.db = new LevelDatabase.LevelDatabase();
        console.log("in class Blockchain constructor this.db is: " + this.db);
        console.log("in Blockchain constructor property names of this.db are: " + Object.getOwnPropertyNames(this.db));
        console.log("in class Blockchain constructor this.db.db is: " + this.db.db);
        this.verifyGenesisBlock();

    }

    async verifyGenesisBlock() {
        console.log("in verifyGenesisBlock - trying to verify the genesis block");
        const height = await this.getBlockHeight();
        console.log("in verifyGenesisBlock - BlockHeight is: " + height);
        if (height === (-1)) {
            console.log(" in verifyGenesisBlock and creating the block");
            let genesisBlock = new Block.Block("First Block - Genesis Block");
            // UTC timestamp
            genesisBlock.time = new Date().getTime().toString().slice(0, -3);
            // create a Hash
            genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
            // Add to LevelDB

            await this.db.addDataToLevelDB(genesisBlock);
            console.log("in verifyGenesisBlock finished adding genesis block");
            this.db.db.get(0, function (err, value) {
                if (err) return console.log('Ooops!', err);
                console.log("value is: " + value);// likely the key was not found
                console.log("no error is first value");
                //  return value;
            });
        } else { console.log("in verifyGenesisBlock there is a genesis block blockHeight is:  " + height); };

    }

    // Add new block to blockchain
    async addBlock(newBlock) {
        console.log("in addBlock block sent is: " + JSON.stringify(newBlock));
        // Block height
        let prevBlockHeight = await this.getBlockHeight();
        console.log("in addBlock and prevBlockHeight is: ")
        newBlock.height = prevBlockHeight + 1;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (newBlock.height > 0) {
            let prevBlock = await this.getBlock(prevBlockHeight);
            //prevBlock = JSON.parse(prevBlock);
            console.log("in addBlock prevBlock is: " + prevBlock);
            console.log("in addBlock prevBlock.hash is: " + prevBlock.hash);
            console.log("in addBlock prevBlock.height is: " + prevBlock.height);
            newBlock.previousBlockHash = prevBlock.hash;
            console.log("in addBlock and previousBlockHash is: " + newBlock.peviousBlockHash);
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            console.log("in addBlock height > 0 newBlock to be added is: " + JSON.stringify(newBlock));

            let addedBlock = await this.db.addDataToLevelDB(newBlock); // add the new block
            console.log(" in addBlock and sending back addedBlock: " + addedBlock);
            return JSON.parse(addedBlock);
        }
        // Block hash with SHA256 using newBlock and converting to a string
        
        // Adding block object to chain

       

    }


    // Find the height of the last block per submission requirements
    async getBlockHeight() {
        console.log("in getBlockHeight this.db.db is: " + this.db.db);
        let blockHeight = await asyncIsAPain(this.db.db)
        
        console.log("in getBlockHeight blockHeight is: " + blockHeight);
        return blockHeight;
    }


    // Return a requested block from the blockchain using blockHeight as the key in the database
    getBlock(blockHeight) {

        /*
        console.log("in getBlock starting blockHeight is: " + blockHeight);
        this.db.db.get(blockHeight, function (err, value) {
            if (err) return console.log('Ooops!', err);
            console.log("value is: " + value);// likely the key was not found
            console.log("no error is first value");
            return value;
        });
*/

        let self = this.db;
        console.log("in getBlock check this.db.db " + this.db.db);

        let promise2 = (async function () {
            let promise1 = await new Promise((resolve, reject) => {
                console.log(" in getBlock starting get");
                self.db.get(blockHeight, async function (err, value) {
                    if (err) {
                        console.log(" in getBlock and encountered error: " + err);
                        return console.log('Not found!', err);
                        reject(err);
                    }
                    console.log("in getBlock resolving promise value is: " + value);
                    let block = await JSON.parse(value);
                    resolve(block);

                });
               
            });
            let returnBlock = await promise1;
            console.log(" returnBlock is: " + returnBlock);
            return returnBlock;


        })();
        console.log("in getBlock before await promise2: " + promise2);
        let promise3 = promise2;
        console.log("in getBlock after await assigning promise2: " + promise2);
        console.log("in getBlock and returning promise3: " + promise3);
        
        return promise3;




        //let returnBlock = await promise;
        //console.log(" in getBlock returnBlock is: " + returnBlock);
        //return returnBlock;
    }

    /*
    async getBlock(blockHeight) {
        try {
            console.log("in getBlock blockHeight is: " + blockHeight);
            // wait for requested block to arrive and then return
            return await this.db.getLevelDBData(blockHeight);
        } catch (err) {
            console.log(err);
        }
    }
    */

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
async function asyncIsAPain(db) {
    console.log(" in asyncIsAPain and db is: " + db);
    let promise = new Promise((resolve, reject) => {
        let i = -1;
        // Read the entire blockchain and count the blocks
        console.log("in getBlockHeight about to read the stream and i is: " + i);

        try {
            console.log("in asyncIsAPain starting try db is: " + db);


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
        catch (err) { console.log("in asyncIsAPain and had catch error : " + err); }
    });
    return returnHeight = await promise;
    console.log("in getBlockHeight and returnHeight is: this should not print " + returnHeight);
    
}

module.exports.Blockchain = Blockchain;
