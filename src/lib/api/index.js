'use strict';

const router = require('express').Router();
const queue = require('./routes/queue');

const validateClientInput = require('../middleware/validateClientInput');

module.exports = (dependencies) => {
    const { sonos, redis } = dependencies;

    router.post('/songs',
        validateClientInput(queue.songs.create.clientInputSchema),
        queue.songs.create.handler(sonos, redis)
    );

    router.delete('/songs', queue.songs.delete.handler(sonos, redis));

    router.delete('/songs/recently-added', queue.songs.recentlyAdded.delete.handler(redis));

    return router;
};
