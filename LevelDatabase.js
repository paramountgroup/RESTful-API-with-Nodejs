// JavaScript source code LevelDb.js

const level = require('level');
const chainDB = './chaindata';

class LevelDatabase {
    constructor() {
        this.db = level(chainDB);
    }

    //Add your other methods


    /*============================================================================================
    * getLevelDBData returns the requested block object using blockheight as the key for lookup
    =============================================================================================*/

    getLevelDBData(key) {
        return new Promise((resolve, reject) => {
            db.get(key, function (err, value) {
                if (err) {
                    console.log("Not found!", err);
                    reject(err);
                } else {
                    resolve(JSON.parse(value));
                }
            });
        });
    }

    /*=============================================================
    // Add data to levelDB with key/value pair
    ===============================================================*/

    addLevelDBData(key, value) {
        //place new block in Level db using blockHeight as key and JSON.stringify the block object
        db.put(key, JSON.stringify(value), function (err) {
            if (err) return console.log('Block ' + key + ' submission failed', err);
        });
    }


    /*============================================================
    // addDataToLevelDB will Add block object 'value' to levelDB 
    =============================================================*/

    addDataToLevelDB(value) {
        //Determine blockHeight and add next block
        let i = 0;
        db.createReadStream().on('data', function (data) {
            i++;
        }).on('error', function (err) {
            return console.log('Unable to read data stream!', err);
        }).on('close', function () {
            addLevelDBData(i, value);
        });
    }
}
module.exports.LevelDatabase = LevelDatabase;
