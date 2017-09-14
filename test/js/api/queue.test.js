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

            it('doesn\'t validate when an invalid song id is given', () => {
                let req = {
                    body: {
                        spotify_id: 'invalid'
                    }
                };
                const result = queue.song.add.clientInputSchema.validate(req);
                
                expect(result.error).to.not.equal(null);
            });
        })
    });
});
