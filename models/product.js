const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

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
    constructor(id, title, imageUrl, price, description) {
        this.id = id; //will be null for a new product
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    };

    save() {
        getProductsFromFile((products) => {
            if(this.id){
                //Replace an existing product in array with updated product
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;

                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            }else{
                //Create a new product
                //adds a new id property to the entire product model we're working on
                this.id = Math.round((Math.random() * 10000000000)).toString();

                //if don't use an arrow func, this will lose context and not refer to the class.
                products.push(this);
    
                //now save back to file
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            }
        });
    };

    static deleteById(id){
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            
            //creates an array filled with all array elements that pass a test
            //keep all products i dont want to delete
            const updatedProducts = products.filter(prod => prod.id !== id); //filter is synchronous

            //save all products except for the one i want to delete back to the file
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if(!err){
                    // now delete product from cart...
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

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