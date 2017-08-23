const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;
let queue = require('../../src/lib/queue');

describe('Queue', function(){
  describe('Add', function(){
    it('has an add method', function(){
      assert.equal(typeof queue, 'object');
      assert.equal(typeof queue.add, 'function');
    });

    it('accepts a valid spotify ID', function(){
      let spotify_id = '6rqhFgbbKwnb9MLmUQDhG6';
      return assert.isFulfilled(queue.add(spotify_id));
    });

    it('rejects an invalid spotify ID', function(){
      let spotify_id = 'INVALID';
      return assert.isRejected(queue.add(spotify_id), Error);
    });
  })
});
