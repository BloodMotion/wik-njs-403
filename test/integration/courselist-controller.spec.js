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

    describe('When I create a courseList (POST /course-lists)', () => {
        it('should reject with a 400 when no name is given', () => {
            return request(app)
                .post('/course-lists')
                .send({cart: {'Tomatoes': {flag: true}}})
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

        it('should reject with a 400 when no cart is given', () => {
            return request(app)
                .post('/course-lists')
                .send({name: 'New list test'})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'Missing cart'
                        }
                    })
                })
        })

        it('should  succesfuly create a courseList', () => {
            const mockName = 'My New List'
            const mockCart = 'Tomatoes'

            return request(app)
                .post('/course-lists')
                .send({name: mockName, cart: mockCart})
                .then((res) => {
                    res.status.should.equal(200)
                    expect(res.body.data).to.be.an('object')
                    res.body.data.name.should.equal(mockName)

                    const result = find(db.courseList, {name: mockName})
                    result.should.not.be.empty
                    result.should.eql({
                        id: res.body.data.id,
                        name: res.body.data.name,
                        cart: res.body.data.cart
                    })
                })
        })
    })
})
