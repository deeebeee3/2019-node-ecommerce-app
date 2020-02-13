const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findByPk(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart() //magic method
        .then(cart => {
            return cart
                .getProducts() //added by sequelize as a magic method because of associations in app.js
                .then(products => {
                    res.render('shop/cart', {
                        pageTitle: 'Your Cart',
                        path: '/cart',
                        products: products
                    });
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;  //need to access the cart further down

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            let newQuantity = 1;

            //is product in the cart?
            if (products.length > 0) {
                product = products[0];
            }

            //if product is in cart then increase quantity
            if (product) {
                //... increase quantity
            }

            //otherwise add new product to cart
            return Product.findByPk(prodId)
                .then(product => {
                    //add quantity to every entry in CartItem (inbetween) table
                    //set quantity field to newquantity in CartItem table
                    return fetchedCart.addProduct(product, {
                        through: { quantity: newQuantity }
                    });
                })
                .catch(err => console.log(err));
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postCartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}