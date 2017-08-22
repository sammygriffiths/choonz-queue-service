'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const api = require('../../src/lib/api');
const Route = require('../../src/lib/api/Route');

const app = () => ({
    post: sinon.stub()
});

describe('Route', () => {
    it('should register the correct route', () => {
        let appStub = app();
        api(appStub);

        sinon.assert.calledWith(appStub.post, '/route');
    });

    it('can be created', () => {
        const route = new Route(() => {});

        expect(route).to.have.property('handler');
        expect(route).to.have.property('validator');
    });

    describe('Validator', () => {
        it('can be created', () => {
            const route = new Route(() => {});

            expect(route.validator).to.have.property('schema');
            expect(route.validator).to.have.property('validate');
            expect(route.validator.validate).to.be.instanceof(Function);
        });
    });
});
