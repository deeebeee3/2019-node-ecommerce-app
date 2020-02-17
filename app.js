const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoconnect = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public2')));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         //storing sequelized object in the request with new key of user
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

//pass callback func to mongoConnect
mongoconnect(() => {
    app.listen(3000);
});