'use strict';

const joi = require('joi');

let queue = {
    song: {}
};

queue.song.add = {
    handler: (req, res, next) => {
        res.send('string');
    },
    clientInputSchema: joi.object().keys({
        body: joi.object().keys({
            spotify_id: joi.string().alphanum().min(22).max(22)
        }).required()
    }).required()
};

module.exports = queue;
