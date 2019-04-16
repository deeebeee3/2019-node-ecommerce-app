const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) => {
    //executed
    //(err, fileContent) => {...} callback is registered in event emitter registry
    //then finishes with function
    //fetchAll does not return anything
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    };

    save() {
        //adds a new id property to the entire product model we're working on
        this.id = Math.round((Math.random() * 10000000000)).toString();
        getProductsFromFile((products) => {
            //if don't use an arrow func, this will lose context and not refer to the class.
            products.push(this);

            //now save back to file
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(err){
                    console.log(err);
                }
            });
        });
    };

    static fetchAll(cb) {
        getProductsFromFile(cb);
    };

    static findById(id, cb){
        getProductsFromFile(products => {
            // const product = products.find(p => {
            //     return p.id === id;
            // });

            const product = products.find(p => p.id === id); //find is synchronous
            cb(product);
        });
    }

}