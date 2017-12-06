const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const {find} = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

router.put('/', (req, res, next) => {
    if (!req.body.name) {
        return next(new BadRequestError('VALIDATION', 'Missing name'))
    }

    if (!req.body.item) {
        return next(new BadRequestError('VALIDATION', 'Missing item'))
    }
    const name = req.body.name
    const item = req.body.item
    const result_list = find(courseListCollection, {name})

    // Check for uniqueness item cart
    const result_item = find(result_list['cart'], {item})
    if (result_item) {
        return next(new BadRequestError('VALIDATION', 'Item should be unique'))
    }

    const itemList = {
        item: item,
        flag: false
    }

    result_list['cart'].push(itemList)

    res.json({
        data: itemList
    })
})

module.exports = router