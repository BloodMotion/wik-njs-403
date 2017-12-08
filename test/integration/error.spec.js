const request = require('supertest')
require('chai').should()

const app = require('../../app')

describe('Errors', () => {
    describe('when route does not exist', () => {
        it('should return a 404', () => {
            return request(app).get('/i-know-this-path-doesn-exist').then((res) => {
                res.status.should.equal(404)
                res.body.should.eql({
                    error: {
                        code: 'NOT_FOUND',
                        message: 'Page not found'
                    }
                })
            })
        })
    })

    describe('when server goes wrong', () => {
        it('should return a 500', () => {
            return request(app).get('/http-error').then((res) => {
                res.status.should.equal(500)
                res.body.should.eql({
                    error: {
                        code: 'ServerError',
                        message: 'Unknown error'
                    }
                })
            })
        })
    })
})