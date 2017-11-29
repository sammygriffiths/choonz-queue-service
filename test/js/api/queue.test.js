'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const queue = require('../../../src/lib/api/routes/queue.js');

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
                let req = {
                    body: {
                        spotify_id: '6rqhFgbbKwnb9MLmUQDhG6'
                    }
                };
                const result = queue.song.add.clientInputSchema.validate(req);
                
                expect(result.error).to.equal(null);
            });
            
            it('doesn\'t validate when something other than a string is given', () => {
                let req = {
                    body: {
                        spotify_id: true
                    }
                };
                const result = queue.song.add.clientInputSchema.validate(req);
                
                expect(result.error).to.not.equal(null);
            });
            
            it('doesn\'t validate when non-alphanumeric characters are given', () => {
                let req = {
                    body: {
                        spotify_id: '6rqhFgbbKwnb9MLm_QDhG6'
                    }
                };
                const result = queue.song.add.clientInputSchema.validate(req);
                
                expect(result.error).to.not.equal(null);
            });

            it('doesn\'t validate when an empty song id is given', () => {
                let req = {
                    body: {
                        spotify_id: ''
                    }
                };
                const result = queue.song.add.clientInputSchema.validate(req);
                
                expect(result.error).to.not.equal(null);
            });

            it('doesn\'t validate when a song id shorter than 22 characters is given', () => {
                let req = {
                    body: {
                        spotify_id: '6rqhFgbbKwnb9MLmUQD'
                    }
                };
                const result = queue.song.add.clientInputSchema.validate(req);
                
                expect(result.error).to.not.equal(null);
            });

            it('doesn\'t validate when a song id greater than 22 characters is given', () => {
                let req = {
                    body: {
                        spotify_id: '6rqhFgbbKwnb9MLmUQDhG6123'
                    }
                };
                const result = queue.song.add.clientInputSchema.validate(req);
                
                expect(result.error).to.not.equal(null);
            });
        });

        describe('Handler', () => {
            it('gets the currently playing track', () => {
                const sonos = {
                    currentTrack: sinon.spy()
                };

                queue.song.add.handler(sonos)();

                sinon.assert.calledOnce(sonos.currentTrack);
            });
        });
    });
});
