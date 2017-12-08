const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()

const {find} = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistItemController', () => {
    beforeEach(() => {
        courseListFixture.up()
    })
    afterEach(() => {
        courseListFixture.down()
    })

    describe('When I modify a listCourse to add an item in cart (POST /course-lists/items)', () => {
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

        it('should successfully add an item in ze cart for given courseList name', () => {
            return request(app)
                .post('/course-lists/items')
                .send({name: 'Toto', item: 'Potatoes'})
                .then((res) => {
                    res.status.should.equal(200)
                    res.body.should.eql({
                        data: {
                            item: 'Potatoes',
                            flag: false
                        }
                    })
                })
        })

    })

    describe('When I modify an item in listCourse cart (PUT /course-lists/items)', () => {
        it('should reject when courseList name is not specified', () => {
            return request(app)
                .put('/course-lists/items')
                .send({item: 'Baguette', flag: true})
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

        it('should reject when item in courseList is not specified', () => {
            return request(app)
                .put('/course-lists/items')
                .send({name: 'Toto', flag: true})
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

        it('should reject when flag for item in courseList is not specified', () => {
            return request(app)
                .put('/course-lists/items')
                .send({name: 'Toto', item: 'Baguette'})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'Missing flag'
                        }
                    })
                })
        })

        it('should reject when courseList does not exist', () => {
            return request(app)
                .put('/course-lists/items')
                .send({name: 'Nonexistant list', item: 'Baguette', flag: true})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'List does not exist'
                        }
                    })
                })
        })

        it('should reject when item for giving courseList does not exist', () => {
            return request(app)
                .put('/course-lists/items')
                .send({name: 'Toto', item: 'Spaghetti', flag: true})
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'Item does not exist'
                        }
                    })
                })
        })

        it('should successfully update a flag for a specified item in a given cart for a listCourse', () => {
            return request(app)
                .put('/course-lists/items')
                .send({name: 'Toto', item: 'Baguette', flag: true})
                .then((res) => {
                    res.status.should.equal(200)
                    const resultCourse = find(db.courseList, {name: 'Toto'})
                    const resultItem = find(resultCourse['cart'], {item: 'Baguette'})
                    resultItem.flag.should.be.true;
                })
        })
    })
})
