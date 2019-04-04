const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(t){
        this.title = t;
    };

    save() {
        const p = path.join(
            path.dirname(process.mainModule.filename), 
            'data', 
            'products.json'
        );

        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if(!err){
                products = JSON.parse(fileContent);
            }

            //if don't use an arrow func, this will lose context and not refer to the class.
            products.push(this);

            //now save back to file
            fs.writeFile(p, JSON.stringify(products), (err) =>{
                console.log(err);
            });
        });
    };

    static fetchAll(cb) {
        //executed
        const p = path.join(
            path.dirname(process.mainModule.filename), 
            'data', 
            'products.json'
        );

        //executed
        //(err, fileContent) => {...} callback is registered in event emitter registry
        //then finishes with function
        //fetchAll does not return anything
        fs.readFile(p, (err, fileContent) => {
            if(err){
                cb([]);
            }
            cb(JSON.parse(fileContent));
        });
    };

}