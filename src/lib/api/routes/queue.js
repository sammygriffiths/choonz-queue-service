'use strict';

const joi = require('joi');
const promisifyAll = require('bluebird').promisifyAll;
const sonosHelper = require('../../helpers/sonos');

let queue = {
    song: {}
};

queue.song.add = {
    handler: (sonos, redis) => async (req, res, next) => {
        try {
            sonos = promisifyAll(sonos);
            redis = promisifyAll(redis);

            let track = await sonos.currentTrackAsync();
            let currentQueuePosition = track.queuePosition;
            let lastAddedPosition = await redis.getAsync('lastAddedPosition') || 0;
            let newQueuePosition = await sonosHelper.calculateNewQueuePosition(
                currentQueuePosition,
                lastAddedPosition
            );

            await sonos.queueAsync('spotify:track:' + req.body.spotify_id, newQueuePosition);

            await redis.setAsync('lastAddedPosition', newQueuePosition);

            res.json({
                queuePosition: newQueuePosition
            });
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

queue.clear = {
    handler: (sonos, redis) => async (req, res, next) => {
        sonos = promisifyAll(sonos);
        redis = promisifyAll(redis);

        sonos.flushAsync().catch((e) => {
            console.log(e);
            next(e);
        });

        redis.delAsync('lastAddedPosition').catch((e) => {
            console.log(e);
            next(e);
        });

        res.json([]);
    }
};

module.exports = queue;
