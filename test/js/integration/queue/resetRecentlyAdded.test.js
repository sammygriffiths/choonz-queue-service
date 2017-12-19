'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');

const dependencies = require('../../../helpers/getMockDeps');
const app = require('../../../helpers/getMockApp')(dependencies);

describe('DELETE /songs/recently-added', () => {
    it('should respond with a 204 status', (done) => {
        request(app)
            .delete('/songs/recently-added')
            .end((err, res) => {
                expect(res.statusCode).to.equal(204)
                done();
            });
    });

    it('should have an empty body', (done) => {
        request(app)
            .delete('/songs/recently-added')
            .end((err, res) => {
                expect(res.body).to.be.an('object').that.is.empty;
                done();
            });
    });
});
