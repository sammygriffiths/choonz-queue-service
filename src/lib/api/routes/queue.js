'use strict';

const joi = require('joi');
const promisifyAll = require('bluebird').promisifyAll;
const sonosHelper = require('../../helpers/sonos');

const redisLastPositionKey = 'lastAddedPosition';

let queue = {
    songs: {
        recentlyAdded: {}
    }
};

queue.songs.create = {
    handler: (sonos, redis) => async (req, res, next) => {
        try {
            sonos = promisifyAll(sonos);
            redis = promisifyAll(redis);

            let track = await sonos.currentTrackAsync();
            let currentQueuePosition = track.queuePosition;
            let lastAddedPosition = await redis.getAsync(redisLastPositionKey) || 0;
            let newQueuePosition = await sonosHelper.calculateNewQueuePosition(
                currentQueuePosition,
                lastAddedPosition
            );

            await sonos.queueAsync('spotify:track:' + req.body.spotify_id, newQueuePosition);

            await redis.setAsync(redisLastPositionKey, newQueuePosition);

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

queue.songs.delete = {
    handler: (sonos, redis) => async (req, res, next) => {
        sonos = promisifyAll(sonos);
        redis = promisifyAll(redis);

        sonos.flushAsync().catch((e) => {
            console.log(e);
            next(e);
        });

        redis.delAsync(redisLastPositionKey).catch((e) => {
            console.log(e);
            next(e);
        });

        res.json([]);
    }
};

queue.songs.recentlyAdded.delete = {
    handler: (redis) => (req, res, next) => {
        redis = promisifyAll(redis);

        redis.delAsync(redisLastPositionKey).catch((e) => {
            console.log(e);
            next(e);
        });
    }
};

module.exports = queue;
