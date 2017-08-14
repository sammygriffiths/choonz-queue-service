let assert = require('assert');
let queue = require('../src/app/queue');

describe('Queue', function(){
    it('should have an add method', function(){
      assert.equal(typeof queue, 'object');
      assert.equal(typeof queue.add, 'function');
    });
});
