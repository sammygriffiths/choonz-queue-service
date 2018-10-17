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
            redis = promisifyAll(redis);

            let track = await sonos.currentTrack();
            let currentQueuePosition = track.queuePosition;
            let lastAddedPosition = await redis.getAsync(redisLastPositionKey) || 0;
            let newQueuePosition = await sonosHelper.calculateNewQueuePosition(
                currentQueuePosition,
                lastAddedPosition
            );

            await sonos.queue('spotify:track:' + req.body.spotify_id, newQueuePosition);

            await redis.setAsync(redisLastPositionKey, newQueuePosition);

            res.status(201);
            res.json({
                queuePosition: newQueuePosition,
                nowPlaying: currentQueuePosition
            });
        } catch(e) {
            console.error(e);
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
        redis = promisifyAll(redis);
        
        sonos.flush().catch((e) => {
            console.error(e);
            return next(e);
        });
        
        redis.delAsync(redisLastPositionKey).catch((e) => {
            console.error(e);
            return next(e);
        });
        
        res.status(204);
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

        res.status(204);
        res.json([]);
    }
};

module.exports = queue;
