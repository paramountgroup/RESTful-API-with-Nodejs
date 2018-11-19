const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js')
let blockHeight = 0;

/**
 * Controller Definition to encapsulate routes to work with blocks
 */

class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */

    constructor(app) {
        console.log("in BlockController constructor");
        this.app = app;
        //this.blocks = [];
        //  this.initializeMockData();
        this.blockChain = new BlockChain.Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
        console.log("finished BlockController constructor");

    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */

    getBlockByIndex() {
        let heightok = false;
        console.log("in getBlockByIndex this.currentBlockHeight is: " + blockHeight);
        this.app.get("/api/block/:height", (req, res) => {
            let height = parseInt(req.params.height, 10);
            console.log("in getBlockByIndex height is: " + height);
            console.log("in getBlockByIndex and currentBlockHeight is: " + blockHeight);
            if (height > blockHeight || height < blockHeight || NaN) {
                res.status(404).send("Block height parameter is out of bounds or NaN");
                heightok = true;
            };
            if (req.params.height) {//Verify here if the parameter is correct
                const height = req.params.height;
                this.blockChain.getBlock(height).then((block) => {
                    if (block) { //  verify here if the block exist if not return 404
                        return res.status(200).json(block);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                }).catch((error) => { return res.status(500).send("Something went wrong!"); })
            } else {
                return res.status(404).send("Block Not Found!");
            }

        });
    }


    /**
    * Implement a POST Endpoint to add a new Block, url: "/api/block"
    */

    postNewBlock() {
        this.app.post("/api/block/:data", (req, res) => {
            /*
            //console.log(" in postNewBlock and req.params.data is: " + newBlock.body);
            let newBlock = new BlockClass.Block(req.params.data);
            console.log(" in postNewBlock and newBlock.body is: " + newBlock.body);
            newBlock.height = this.blocks.length;
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            this.blocks.push(newBlock);
            */
            let self = this.blockChain;
            setTimeout(async function () {
                console.log("in postNewBlock and the body data is: " + req.params.data);
                let newBlock = new BlockClass.Block(req.params.data);
                let blockAdded = await self.addBlock(newBlock);
                console.log("in postNewBlock and sending back blockAdded: " + blockAdded);
                res.send(blockAdded);
            }, 1000);

            /*
            console.log("in postNewBlock and the body data is: " + req.params.data);
            let newBlock = new BlockClass.Block(req.params.data);
            let blockAdded = this.blockChain.addBlock(newBlock);
            console.log("in postNewBlock and sending back blockAdded: " + blockAdded);
            res.send(blockAdded);
            */

            // Add your code here
        });
    }










}



/*
 * 
 getBlockByIndex() {
    
    let i = 0;
        this.app.get("/api/block/:index", (req, res) => {
            console.log("in getBlockByIndex");
            //res.send('Hello World with nodemon');
            console.log("in getBlockByIndex and index is: " + req.params.index);
            //let fetchedBlockchain = new BlockChain.Blockchain();
            //let fetchedBlock = fetchedBlockchain.getBlock(0);
            //let fetchedBlock = myBlockChain.getBlock(0)
            console.log(" in getBlockByIndex and about to assign fetchedBlock");
            let fetchedBlock = await returnBlock();
            console.log("in getBlockByIndex fetchedBlock is: " + fetchedBlock);
            console.log("in getBlockByIndex fetchedBlock is: " + fetchedBlock);
            console.log("in getBlockByIndex fetchedBlock is: " + fetchedBlock);
            console.log("in getBlockByIndex fetchedBlock is: " + fetchedBlock);
 
            // res.send(req.params.index);
            //res.send(this.blocks[req.params.index]);
            res.send(fetchedBlock);
            // Add your code here
        });
    })();
}
 
*/




/*
         * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
        
        initializeMockData() {
            if(this.blocks.length === 0){
                for (let index = 0; index < 10; index++) {
                    console.log("in initializeMockData index is: " + index);
                    let blockAux = new BlockClass.Block(`Test Data #${index}`);
                    blockAux.height = index;
                    blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                    this.blocks.push(blockAux);
                }
            }
        }  
        
        */



/*
async function returnBlock() {
    let returnBlock = await myBlockChain.getBlock(0);
    return returnBlock;
};
*/
//let myBlockChain = new BlockChain.Blockchain();

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }