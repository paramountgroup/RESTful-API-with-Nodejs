// JavaScript source code LevelDb.js

const level = require('level');
const chainDB = './chaindata';
//const db = level(chainDB);
//console.log("in LevelDatabase db is: " + Object.getOwnPropertyNames(db));

class LevelDatabase {
    constructor() {
        console.log("in class LevelDatabase constructor ");
       this.db = level(chainDB);
       console.log("in class LevelDatabase constructor this.db is: " + this.db);
   //     console.log(Object.getOwnPropertyNames(this.db));
   //     return this.db;
       
    }

    //Add your other methods


    /*============================================================================================
    * getLevelDBData returns the requested block object using blockheight as the key for lookup
    =============================================================================================*/

    getLevelDBData(key) {
        return new Promise((resolve, reject) => {
            this.db.get(key, function (err, value) {
                if (err) {
                    console.log("Not found!", err);
                    reject(err);
                } else {
                    resolve(JSON.parse(value));
                }
            });
        });
    }



    /*============================================================
    // addDataToLevelDB will Add block object 'value' to levelDB 
    =============================================================*/

     addDataToLevelDB(value) {
        //Determine blockHeight and add next block
        console.log("in addDataToLevelDB and value is: " + JSON.stringify(value));
        console.log("in addDataToLevelDB and value.body is: " + value.body);
        let i = 0;
        console.log("in addDataToLevelDB and this.db is: " + this.db);
        console.log("in addDataToLevelDB about to createReadStream");
         let self = this.db;
         return new Promise(function (resolve, reject) {

             self.createReadStream().on('data', function (data) {
                 console.log(" in addDataToLevelDb and reading stream i is: " + i);
                 i++;
             }).on('error', function (err) {
                 console.log(" i deteted an error");
                 reject(err);
             }).on('close', function () {
                 console.log(" in addDataToLevelDB close i is: " + i + " value is: " + value);
                 console.log(" in addDataToLevelDB close and about to put this.db is: " + this.db);
                 // this.addLevelDBData(i, value);
                 console.log(" in addDataToLevelDB self is: " + self);
                 self.put(i, JSON.stringify(value), function (err) {
                     if (err) return console.log('Block ' + key + ' submission failed', err);   
                 });
                 resolve(JSON.stringify(value));
                 });
                 
                 
         });
        
    }


    /*=============================================================
    // Add data to levelDB with key/value pair
    ===============================================================*/

    addLevelDBData(key, value) {
        //place new block in Level db using blockHeight as key and JSON.stringify the block object
        this.db.put(key, JSON.stringify(value), function (err) {
            if (err) return console.log('Block ' + key + ' submission failed', err);
        });
    }
}
module.exports.LevelDatabase = LevelDatabase;
