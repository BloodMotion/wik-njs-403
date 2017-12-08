const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')


// Simulate an error 500 like server broken
router.get('/', (req, res, next) => {
    next(res.status(500))
})

module.exports = router