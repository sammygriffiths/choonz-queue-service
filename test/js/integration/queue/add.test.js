'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('supertest');

const dependencies = require('../../../helpers/getMockDeps');
const app = require('../../../helpers/getMockApp')(dependencies);

describe('POST /songs', () => {
    it('should respond with JSON and a 201 status', (done) => {
        request(app)
            .post('/songs')
            .send({ spotify_id: '6rqhFgbbKwnb9MLmUQDhG6' })
            .end((err, res) => {
                expect(res.statusCode).to.equal(201)
                expect(res.type).to.equal('application/json')
                done();
            });
    });

    it('should respond with a 400 if no data is sent', (done) => {
        request(app)
            .post('/songs')
            .end((err, res) => {
                expect(res.statusCode).to.equal(400);
                done();
            });
    });
});
