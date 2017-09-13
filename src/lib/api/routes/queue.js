'use strict';

const joi = require('joi');

let queue = {};

queue.add = {
    handler: (req, res, next) => {
        res.send('string');
    },
    clientInputSchema: joi.object().keys({
        body: joi.object().keys({
            
        }).required()
    }).required()
};

module.exports = queue;
