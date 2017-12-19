'use strict';

const app = require('express')();
const bodyParser = require('body-parser');

const api = require('../../src/lib/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

module.exports = (dependencies) => {
    app.use('/', api(dependencies));

    return app;
};
