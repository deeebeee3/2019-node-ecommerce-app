const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');

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

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//catch all middleware - use - handle all http methods
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

//dont use force: true in production - dont want to overwrite tables...
sequelize.sync({ force: true }).then(result => {
    // console.log(result);
}).catch(err => {
    console.log(err);
});

app.listen(4000);

//WHY RUNS TWICE? Your browser is making a request to the server searching for a favicon.ico file. 
//The browser initiates this request itself and triggers the middleware on our server.

//GET - url and links

//pkill node - to kill node processes (EADDRINUSE)