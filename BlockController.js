const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js')

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
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/api/block/:index", (req, res) => {
            console.log("in getBlockByIndex");
           //res.send('Hello World with nodemon');
           console.log("in getBlockByIndex and index is: " + req.params.index);
           // res.send(req.params.index);
            res.send(this.blocks[req.params.index]);
            // Add your code here
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block/:data", (req, res) => {
            //console.log(" in postNewBlock and req.params.data is: " + newBlock.body);
            let newBlock = new BlockClass.Block(req.params.data);
            console.log(" in postNewBlock and newBlock.body is: " + newBlock.body);
           newBlock.height = this.blocks.length;
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                this.blocks.push(newBlock);
                res.send(newBlock);

            
            // Add your code here
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
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

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}