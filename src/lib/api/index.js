'use strict';

const router = require('express').Router();
const queue = require('./routes/queue');

const validateClientInput = require('../middleware/validateClientInput');

module.exports = (dependencies) => {
    const { sonos, redis } = dependencies;

    router.options('/songs', (req, res, next) => {
        res.append('Access-Control-Allow-Methods', 'POST, DELETE');
        next();
    });
    router.post('/songs',
        validateClientInput(queue.songs.create.clientInputSchema),
        queue.songs.create.handler(sonos, redis)
    );
    router.delete('/songs', queue.songs.delete.handler(sonos, redis));

    router.options('/songs/recently-added', (req, res, next) => {
        res.append('Access-Control-Allow-Methods', 'DELETE');
        next();
    });
    router.delete('/songs/recently-added', queue.songs.recentlyAdded.delete.handler(redis));

    return router;
};
