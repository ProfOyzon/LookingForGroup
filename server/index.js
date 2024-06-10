const path = require('path');
const express = require('express');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config.js');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3001;

mongoose.connect(config.connections.mongo)
    .then(() => { console.log("Connected to mongoDB database!\n") });

const app = express();

app.use(morgan("tiny"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

router(app);

app.listen(port, (err) => {
    if (err) { throw err; }
    console.log(`Listening on port ${port}`);
});
