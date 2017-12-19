'use strict';

const sinon = require('sinon');

module.exports = {
    sonos: {
        currentTrackAsync: sinon.stub().resolves({
            queuePosition: 1
        }),
        queueAsync: sinon.stub().resolves(),
        flushAsync: sinon.stub().resolves()
    },
    redis: {
        getAsync: sinon.stub().resolves(2),
        setAsync: sinon.stub().resolves(),
        delAsync: sinon.stub().resolves()
    }
};
