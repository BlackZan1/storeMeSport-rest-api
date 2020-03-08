if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Tools
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const multer = require('multer')().single('productImage');

// middlewares and config
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer);

// import routes
const productsRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const cartRoute = require('./routes/cart');

// Access config
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }

    next();
});

//routes
app.use('/api/products', productsRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/cart', cartRoute);

// handle requests 
app.use(function (req, res, next) {
    const error = new Error('Not found!');
    error.status = 404;

    next(error);
})

// Error handler
app.use(function(error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

try {
    // MongoDB connection
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log('DATABASE is connected!')
    })
    .then(() => {
        // server
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })

        mongoose.Promise = global.Promise;
    })
}
catch(err) {
    console.log('Error with connection to database')
}