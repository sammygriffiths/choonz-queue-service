'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const queue = require('../../../src/lib/api/routes/queue.js');

let sonos;
let redis;
let req;

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
            beforeEach(() => {
                sonos = {
                    currentTrackAsync: sinon.stub().resolves({
                        queuePosition: 1
                    }),
                    queueAsync: sinon.spy()
                };
                redis = {
                    getAsync: sinon.stub().resolves(2),
                    setAsync: sinon.spy()
                };
                req = {
                    body: {
                        spotify_id: '6rqhFgbbKwnb9MLmUQDhG6'
                    }
                };
            });

            it('gets the currently playing track', async () => {
                await queue.song.add.handler(sonos, redis)(req, {}, () => {});

                sinon.assert.calledOnce(sonos.currentTrackAsync);
            });
            
            it('gets the last added song', async () => {
                await queue.song.add.handler(sonos, redis)(req, {}, () => {});

                sinon.assert.calledWith(redis.getAsync, 'lastAddedPosition');
            });

            it('sends the correct song info to sonos', async () => {
                await queue.song.add.handler(sonos, redis)(req, {}, () => {});

                sinon.assert.calledWith(sonos.queueAsync, 'spotify:track:' + req.body.spotify_id, 3);
            });

            it('sends the correct place in the queue to redis', async () => {
                await queue.song.add.handler(sonos, redis)(req, {}, () => {});

                sinon.assert.calledWith(redis.setAsync, 'lastAddedPosition', 3);
            });
        });
    });
});
