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


        console.log("in getBlockByIndex this.currentBlockHeight is: " + this.blockChain.getBlockHeight());
        this.app.get("/api/block/:height?", (req, res) => {
            let height = parseInt(req.params.height, 10);
            console.log("in getBlockByIndex height requested is: " + height);
            this.blockChain.getBlockHeight().then((blockHeight) => {


                console.log("in getBlockByIndex and blockHeight is: " + blockHeight);
                console.log("in getBlockByIndex and height is: " + height);
                let notNumber = isNaN(height);
                console.log("boolean test : " + notNumber);
                if ((height > blockHeight) || (height < 0) || notNumber) {
                    console.log(" in getBlockByIndex and blockHeight is: " + blockHeight + " height is: " + height);
                    res.status(404).send("Block height parameter is out of bounds or NaN");
                } else {

                    this.blockChain.getBlock(height).then((block) => {
                        if (block) { //  verify here if the block exist if not return 404
                            return res.status(200).json(block);
                        } else {
                            return res.status(404).send("Block Not Found!");
                        }
                    })

                }
            })
        })

    }

    /*
    
    console.log("in getBlockByIndex this.currentBlockHeight is: " + this.blockChain.getBlockHeight());
    this.app.get("/api/block/:height?", (req, res) => {
        let height = parseInt(req.params.height, 10);
        console.log("in getBlockByIndex height requested is: " + height);
        let blockHeight = this.blockChain.getBlockHeight();
        
        console.log("in getBlockByIndex and currentBlockHeight is: " + blockHeight);
        if (height > blockHeight || height < blockHeight || NaN) {
            res.status(404).send("Block height parameter is out of bounds or NaN");
           
        };
        if (req.params.height) {//Verify here if the parameter is correct
            const height = req.params.height;
            this.blockChain.getBlock(height).then((block) => {
                if (block) { //  verify here if the block exist if not return 404
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block Not Found!");
                }
            }).catch((error) => { return res.status(500).send("Something went wrong!   " + error); })
        } else {
            return res.status(404).send("Block Not Found!");
        }
 
    });
    */




    /**
    * Implement a POST Endpoint to add a new Block, url: "/api/block"
    */

    postNewBlock() {
        this.app.post("/api/block/:data?", (req, res) => {
            console.log("what is req.params.data: " + req.params.data);
            if (req.params.data) {
                let newBlock = new BlockClass.Block(req.params.data);
                this.blockChain.addBlock(newBlock).then((addedBlock) => {
                    if (addedBlock) {
                        return res.status(200).json(addedBlock);
                    } else {
                        return res.status(500).send("Something went wrong block was NOT added");
                    }
                }).catch((error) => {
                    return res.status(500).send("Something went wrong! " + error);
                    //console.log(error);
                })
            } else {
                res.status(403).send("Forbidden to persist block without content");

            }
        });
    }
}






//let myBlockChain = new BlockChain.Blockchain();

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }