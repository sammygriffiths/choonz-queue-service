'use strict';

const router = require('express').Router();
const queue = require('./routes/queue');

router.get('/add', queue.add.handler);

module.exports = router;