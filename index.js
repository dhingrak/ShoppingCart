const express = require('express');
const app = express();
const config = require('config');
require('./startup/db');
const user = require('./routers/user'); 
const userProfile = require('./routers/userProfile');
const products = require('./routers/product');
const notification = require('./routers/notification');
const userCart = require('./routers/userCart');
const error = require('./middleware/error');
const logger = require('./utils/logger');

try {
    config.get('jwtPrivateKey')
}
catch(ex) {
    logger.error(ex.stack);
}

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Routers
app.use('/user', user);
app.use('/user/me', userProfile);
app.use('/products', products);
app.use('/notifications', notification);
app.use('/userCart', userCart);

app.use(error);




const PORT = process.env.PORT || 4000;

app.listen(PORT, (req, res) => {
    console.log(`Server is up on port ${PORT} `);
})