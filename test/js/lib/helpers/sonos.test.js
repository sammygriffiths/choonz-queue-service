'use strict';

const expect = require('chai').use(require('chai-as-promised')).expect;
const sinon = require('sinon');
const sonosHelper = require('../../../../src/lib/helpers/sonos');

describe('Sonos helper', () => {
    describe('calculateNewQueuePosition()', () => {
        it('returns a promise with the correct position if the currently playing song is before the last added song', async () => {
            let position = await sonosHelper.calculateNewQueuePosition(1, 6);

            expect(position).to.equal(7);
        });

        it('returns a promise with the correct position if the currently playing song is after the last added song', async () => {
            let position = await sonosHelper.calculateNewQueuePosition(12, 4);

            expect(position).to.equal(13);
        });
        
        it('returns a rejected promise if the passed positions aren\'t the correct types', (done) => {
            let position = sonosHelper.calculateNewQueuePosition({}, 'test');

            expect(position).to.eventually.be.rejectedWith('currentQueuePosition and lastAddedPosition should be positive integers').and.notify(done);
        });
        
        it('returns a rejected promise if the passed positions are negative', (done) => {
            let position = sonosHelper.calculateNewQueuePosition(-1, -2);

            expect(position).to.eventually.be.rejectedWith('currentQueuePosition and lastAddedPosition should be positive integers').and.notify(done);
        });
    });
});
