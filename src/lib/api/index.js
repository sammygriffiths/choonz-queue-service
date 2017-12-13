'use strict';

const router = require('express').Router();
const queue = require('./routes/queue');

const validateClientInput = require('../middleware/validateClientInput');

module.exports = (dependencies) => {
    const { sonos, redis } = dependencies;

    router.post('/song/add',
        validateClientInput(queue.song.add.clientInputSchema),
        queue.song.add.handler(sonos, redis)
    );

    return router;
};
