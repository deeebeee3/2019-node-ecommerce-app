const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//parse request bodies..
app.use(bodyParser.urlencoded({
    extended: true
}));

//serve files (read only access) from file system 
//- can have multiple static folders that will be funneled through until file found
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public2')));

//just registering some middleware - will only get called / run when requests triggered
//not when node app started up
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            //storing sequelized object in the request with new key of user
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//catch all middleware - use - handle all http methods
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem }); //inverse
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem }); //inverse


//dont use force: true in production - dont want to overwrite tables...
sequelize
    //.sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email: 'test@test.com' });
        }
        return Promise.resolve(user);
    })
    .then(user => {
        //console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });

//WHY RUNS TWICE? Your browser is making a request to the server searching for a favicon.ico file. 
//The browser initiates this request itself and triggers the middleware on our server.

//GET - url and links

//pkill node - to kill node processes (EADDRINUSE)