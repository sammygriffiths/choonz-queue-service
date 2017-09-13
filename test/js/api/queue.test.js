'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const os = require('os');

const queue = require('../../../src/lib/api/routes/queue.js');

describe('Add route', () => {
    it('doesn\'t validate when no body is given', () => {
        const result = queue.add.clientInputSchema.validate();

        expect(result.error).to.not.equal(null);
    });
    it('doesn\'t validate when an empty body is given', () => {
        const result = queue.add.clientInputSchema.validate({});

        expect(result.error).to.not.equal(null);
    });
});
