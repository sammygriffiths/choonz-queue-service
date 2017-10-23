'use strict';

const router = require('express').Router();
const queue = require('./routes/queue');

const validateClientInput = require('../middleware/validateClientInput');

router.post('/song/add',
    validateClientInput(queue.song.add.clientInputSchema),
    queue.song.add.handler
);

module.exports = router;