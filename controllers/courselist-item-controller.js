const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const {find} = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

// Create new item in ze cart for list course given
router.post('/', (req, res, next) => {
    if (!req.body.name) {
        return next(new BadRequestError('VALIDATION', 'Missing name'))
    }

    if (!req.body.item) {
        return next(new BadRequestError('VALIDATION', 'Missing item'))
    }

    const name = req.body.name
    const item = req.body.item
    const resultList = find(courseListCollection, {name})

    // Check for uniqueness item cart
    const resultItem = find(resultList['cart'], {item})
    if (resultItem) {
        return next(new BadRequestError('VALIDATION', 'Item should be unique'))
    }

    const itemList = {
        item: item,
        flag: false
    }

    resultList['cart'].push(itemList)

    res.json({
        data: itemList
    })
})

// Modify item flag (true = bought & false = not bought)
router.put('/', (req, res, next) => {
    if (typeof req.body.name === 'undefined' || req.body.name === null) {
        return next(new BadRequestError('VALIDATION', 'Missing name'))
    }

    if (typeof req.body.item === 'undefined' || req.body.item === null) {
        return next(new BadRequestError('VALIDATION', 'Missing item'))
    }

    if (typeof req.body.flag === 'undefined' || req.body.flag === null) {
        return next(new BadRequestError('VALIDATION', 'Missing flag'))
    }

    const name = req.body.name
    const item = req.body.item
    const flag = req.body.flag

    // Check if list exist
    const resultList = find(courseListCollection, {name})
    if (!resultList) {
        return next(new BadRequestError('VALIDATION', 'List does not exist'))
    }

    // Check if item exist
    const resultItem = find(resultList['cart'], {item})
    if (!resultItem) {
        return next(new BadRequestError('VALIDATION', 'Item does not exist'))
    }

    // Update flag
    resultItem.flag = flag

    res.json({
        data: resultItem
    })
})

module.exports = router