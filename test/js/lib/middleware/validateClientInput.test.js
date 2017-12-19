'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const joi = require('joi');

const validateClientInput = require('../../../../src/lib/middleware/validateClientInput');
const ClientValidationError = require('../../../../src/lib/errors/ClientValidationError');

describe('validateClientInput', () => {
    it('calls next with a ClientValidationError if validation fails', () => {
        const next = sinon.spy();
        const schema = joi.object().keys({
            string: joi.string().required()
        });
        const middleware = validateClientInput(schema);

        middleware({}, {}, next);
        
        sinon.assert.calledOnce(next);
        sinon.assert.calledWithExactly(next, sinon.match.instanceOf(ClientValidationError));
    });

    it('calls next with no error if validation passes', () => {
        const next = sinon.spy();
        const schema = joi.object().keys({
            string: joi.string().required()
        });
        const middleware = validateClientInput(schema);
        middleware({string: 'string'}, {}, next);

        sinon.assert.calledOnce(next);
        sinon.assert.neverCalledWith(next, sinon.match.instanceOf(ClientValidationError));
    });
});
