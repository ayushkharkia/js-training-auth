require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 8084;
const MONGODB_URI = `mongodb://${process.env.MONGODB_HOST_NAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`;

const indexRoutes = require('./routes/index');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/auth', indexRoutes);

app.use((err, req, res, next) => {
    console.log("Error---------->", err);
    res.json({ "message": "error", "statusCode": 500 })
})

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        if (process.env.NODE_ENV == 'development') {
            mongoose.set('debug', true);
        }
    })
    .catch(err => {
        console.log(err);
    });

app.listen(PORT, () => {
    console.log('SERVER RUNNING ON PORT', PORT);
});