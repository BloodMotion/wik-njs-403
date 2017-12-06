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

    describe('When I modify a listCourse to put an item in ze cart (PUT /course-lists/items)', () => {
        it('should reject when cart item is not unique', () => {
            return request(app)
                .put('/course-lists/items')
                .send({name: 'Toto', cart: {'Tomatoes': {flag: true}}})
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
