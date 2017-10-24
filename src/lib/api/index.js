'use strict';

const Sonos = require('sonos').Sonos;
const router = require('express').Router();
const queue = require('./routes/queue');

const validateClientInput = require('../middleware/validateClientInput');

const sonos = new Sonos(process.env.SONOS_HOST || '192.168.1.8');

router.post('/song/add',
    validateClientInput(queue.song.add.clientInputSchema),
    queue.song.add.handler(sonos)
);

module.exports = router;