'use strict';

const router = require('express').Router();
const queue = require('./routes/queue');

router.get('/song/add', queue.song.add.handler);

module.exports = router;