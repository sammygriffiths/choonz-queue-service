'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const queue = require('../../../src/lib/api/routes/queue.js');

let error = new Error('This is a mock error');

let sonos;
let redis;
let req;
let res;

describe('Queue route', () => {
    beforeEach(() => {
        sonos = {
            currentTrackAsync: sinon.stub().resolves({
                queuePosition: 1
            }),
            queueAsync: sinon.stub().resolves(), 
            flushAsync: sinon.stub().resolves()
        };
        redis = {
            getAsync: sinon.stub().resolves(2),
            setAsync: sinon.stub().resolves(),
            delAsync: sinon.stub().resolves()
        };
        req = {
            body: {
                spotify_id: '6rqhFgbbKwnb9MLmUQDhG6'
            }
        };
        res = {
            json: sinon.stub()
        }
    });
    describe('Song route', () => {
        describe('Add', () => {
            it('doesn\'t validate when no object is given', () => {
                const result = queue.song.add.clientInputSchema.validate();
    
                expect(result.error).to.not.equal(null);
            });
            it('doesn\'t validate when an empty object is given', () => {
                const result = queue.song.add.clientInputSchema.validate({});
    
                expect(result.error).to.not.equal(null);
            });
            it('doesn\'t validate when an empty body is given', () => {
                const result = queue.song.add.clientInputSchema.validate({
                    body: {}
                });
    
                expect(result.error).to.not.equal(null);
            });
    
            describe('Spotify', () => {
                it('accepts a spotify_id param', () => {
                    req = {
                        body: {
                            spotify_id: '6rqhFgbbKwnb9MLmUQDhG6'
                        }
                    };
                    const result = queue.song.add.clientInputSchema.validate(req);
                    
                    expect(result.error).to.equal(null);
                });
                
                it('doesn\'t validate when something other than a string is given', () => {
                    req = {
                        body: {
                            spotify_id: true
                        }
                    };
                    const result = queue.song.add.clientInputSchema.validate(req);
                    
                    expect(result.error).to.not.equal(null);
                });
                
                it('doesn\'t validate when non-alphanumeric characters are given', () => {
                    req = {
                        body: {
                            spotify_id: '6rqhFgbbKwnb9MLm_QDhG6'
                        }
                    };
                    const result = queue.song.add.clientInputSchema.validate(req);
                    
                    expect(result.error).to.not.equal(null);
                });
    
                it('doesn\'t validate when an empty song id is given', () => {
                    req = {
                        body: {
                            spotify_id: ''
                        }
                    };
                    const result = queue.song.add.clientInputSchema.validate(req);
                    
                    expect(result.error).to.not.equal(null);
                });
    
                it('doesn\'t validate when a song id shorter than 22 characters is given', () => {
                    req = {
                        body: {
                            spotify_id: '6rqhFgbbKwnb9MLmUQD'
                        }
                    };
                    const result = queue.song.add.clientInputSchema.validate(req);
                    
                    expect(result.error).to.not.equal(null);
                });
    
                it('doesn\'t validate when a song id greater than 22 characters is given', () => {
                    req = {
                        body: {
                            spotify_id: '6rqhFgbbKwnb9MLmUQDhG6123'
                        }
                    };
                    const result = queue.song.add.clientInputSchema.validate(req);
                    
                    expect(result.error).to.not.equal(null);
                });
            });
    
            describe('Handler', () => {
                it('gets the currently playing track', async () => {
                    await queue.song.add.handler(sonos, redis)(req, res, () => {});
    
                    sinon.assert.calledOnce(sonos.currentTrackAsync);
                });
                
                it('gets the last added song', async () => {
                    await queue.song.add.handler(sonos, redis)(req, res, () => {});
    
                    sinon.assert.calledWith(redis.getAsync, 'lastAddedPosition');
                });
    
                it('sends the correct song info to sonos', async () => {
                    await queue.song.add.handler(sonos, redis)(req, res, () => {});
    
                    sinon.assert.calledWith(sonos.queueAsync, 'spotify:track:' + req.body.spotify_id, 3);
                });
    
                it('sends the correct place in the queue to redis', async () => {
                    await queue.song.add.handler(sonos, redis)(req, res, () => {});
    
                    sinon.assert.calledWith(redis.setAsync, 'lastAddedPosition', 3);
                });
    
                it('doesn\'t send anything to redis unless adding to sonos was successful', async () => {
                    sonos.queueAsync = sinon.stub().rejects(error);
                    await queue.song.add.handler(sonos, redis)(req, res, () => {});
    
                    sinon.assert.notCalled(redis.setAsync);
                });

                it('calls next with an error if there is an error', async () => {
                    let error = new Error('This is an error');
                    sonos.currentTrackAsync = sinon.stub().rejects(error);
                    let next = sinon.spy();

                    await queue.song.add.handler(sonos, redis)(req, res, next);

                    sinon.assert.calledWith(next, error);
                });
            });
        });
    });
    describe('Clear', () => {
        describe('Handler', () => {
            it('clears the sonos queue', async () => {
                await queue.clear.handler(sonos, redis)(req, res, () => {});
                
                sinon.assert.calledOnce(sonos.flushAsync);
            });
            
            it('resets most recent in redis', async () => {
                await queue.clear.handler(sonos, redis)(req, res, () => {});
                
                sinon.assert.calledWith(redis.delAsync, 'lastAddedPosition');
            });

            it('calls next with an error if there is an error', async () => {
                sonos.flushAsync = sinon.stub().rejects(error);
                let next = sinon.spy();

                await queue.clear.handler(sonos, redis)(req, res, next);

                sinon.assert.calledWith(next, error);
            });
        });
    });
    describe('Reset most recent', () => {
        describe('Handler', () => {
            it('resets most recent in redis', () => {
                queue.mostRecent.reset.handler(redis)(req, res, () => {});

                sinon.assert.calledWith(redis.delAsync, 'lastAddedPosition');
            });

            it('calls next with an error if there is an error', async () => {
                redis.delAsync = sinon.stub().rejects(error);
                let next = sinon.spy();

                await queue.mostRecent.reset.handler(redis)(req, res, next);

                sinon.assert.calledWith(next, error);
            });
        });
    });
});
