'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const api = require('../../src/lib/api');
const Route = require('../../src/lib/api/Route');
const joi = require('joi');
const routeStub = new Route(() => {});

const app = () => ({
    post: sinon.stub()
});

describe('Route', () => {
    it('registers the correct route', () => {
        let appStub = app();
        api(appStub);

        sinon.assert.calledWith(appStub.post, '/route');
    });

    it('can be created', () => {
        expect(routeStub).to.have.property('handler');
        expect(routeStub).to.have.property('validator');
    });
    
    it('requires a handler', () => {
        expect(() => {new Route()}).throws();
    });

    describe('Validator', () => {
        it('lives in a route class', () => {
            expect(routeStub.validator).to.have.property('schema');
            expect(routeStub.validator).to.have.property('validate');
            expect(routeStub.validator.validate).to.be.instanceof(Function);
        });
        
        it('has a joi schema', () => {
            expect(routeStub.validator.schema.validate).to.be.instanceof(Function);
        });
        
        it('uses the schema when the validate function is called', () => {       
            sinon.spy(routeStub.validator.schema, 'validate');

            routeStub.validator.validate({}, {}, () => {});

            sinon.assert.calledOnce(routeStub.validator.schema.validate);
        });

        it('calls the next function after validating', () => {
            const next = sinon.stub();

            routeStub.validator.validate({}, {}, next);
            sinon.assert.calledOnce(next);
        });

        it('errors on validation fail', () => {
            const route = new Route(() => {});
            route.validator.schema = joi.object().keys({
                property: joi.string().required()
            }).required();

            const next = sinon.stub();

            route.validator.validate({}, {}, next);

            sinon.assert.calledOnce(next);
            sinon.assert.calledWith(next, sinon.match.instanceOf(Error));
        });
    });
});
