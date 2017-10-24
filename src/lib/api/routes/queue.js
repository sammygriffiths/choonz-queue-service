'use strict';

const joi = require('joi');

let queue = {
    song: {}
};

queue.song.add = {
    handler: (sonos) => (req, res, next) => {
        sonos.currentTrack((err, track) => {
            res.send(track);
        })
    },
    clientInputSchema: joi.object().keys({
        body: joi.object().keys({
            spotify_id: joi.string().alphanum().min(22).max(22).required()
        }).required()
    }).required().unknown()
};

module.exports = queue;
