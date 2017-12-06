const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()

const {find} = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
    beforeEach(() => {
        courseListFixture.up()
    })
    afterEach(() => {
        courseListFixture.down()
    })

    describe('When I modify a listCourse to put an item in cart (PUT /course-lists/items)', () => {
        it('should reject with a 400 when no name is given', () => {
            return request(app)
                .post('/course-lists/items')
                .send({item: 'Something'})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'Missing name'
                        }
                    })
                })
        })

        it('should reject with a 400 when no item is given', () => {
            return request(app)
                .post('/course-lists/items')
                .send({name: 'Toto'})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'Missing item'
                        }
                    })
                })
        })

        it('should reject when cart item is not unique', () => {
            return request(app)
                .post('/course-lists/items')
                .send({name: 'Toto', item: 'Tomatoes'})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'Item should be unique'
                        }
                    })
                })
        })
    })
})
