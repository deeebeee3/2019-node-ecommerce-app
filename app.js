const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//parse request bodies..
app.use(bodyParser.urlencoded({
    extended: true
}));

//serve files (read only access) from file system 
//- can have multiple static folders that will be funneled through until file found
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public2')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

//catch all middleware - use - handle all http methods
app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '',
    });
});

app.listen(3000);

//WHY RUNS TWICE? Your browser is making a request to the server searching for a favicon.ico file. 
//The browser initiates this request itself and triggers the middleware on our server.

//GET - url and links

//pkill node - to kill node processes (EADDRINUSE)