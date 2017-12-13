'use strict';

const joi = require('joi');
const promisifyAll = require('bluebird').promisifyAll;
const sonosHelper = require('../../helpers/sonos');

let queue = {
    song: {}
};

queue.song.add = {
    handler: (sonos, redis) => async (req, res, next) => {
        sonos = promisifyAll(sonos);
        redis = promisifyAll(redis);

        try {
            let track = await sonos.currentTrackAsync();
            let currentQueuePosition = track.queuePosition;
            let lastAddedPosition = await redis.getAsync('lastAddedPosition');

            let newQueuePosition = await sonosHelper.calculateNewQueuePosition(
                currentQueuePosition,
                lastAddedPosition
            );

            sonos.queueAsync('spotify:track:' + req.body.spotify_id, newQueuePosition);

            redis.setAsync('lastAddedPosition', newQueuePosition);

        } catch(e) {
            console.log(e);
            next(e);
        }
    },
    clientInputSchema: joi.object().keys({
        body: joi.object().keys({
            spotify_id: joi.string().alphanum().min(22).max(22).required()
        }).required()
    }).required().unknown()
};

module.exports = queue;
