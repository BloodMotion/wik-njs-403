const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const {find} = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList

// Retrieving all course lists OR specified course list by his name (parameters courseListName) if specified
router.get('/:courseListName?', (req, res, next) => {
    if (!req.params.courseListName) {
        res.json(db);
        //res.json(courseListCollection);
    }

    const name = req.params.courseListName
    const resultList = find(courseListCollection, {name})

    if (!resultList) {
        return next(new BadRequestError('VALIDATION', 'Name not found'))
    }

    res.json(resultList);
})

// Retrieving items in given cart by course list name
router.get('/:courseListName/cart', (req, res, next) => {
    if (!req.params.courseListName) {
        return next(new BadRequestError('VALIDATION', 'Missing name'))
    }

    const name = req.params.courseListName
    const resultList = find(courseListCollection, {name})

    res.json(resultList.cart);
})

// Create new course list
router.post('/', (req, res, next) => {
    if (!req.body.name) {
        return next(new BadRequestError('VALIDATION', 'Missing name'))
    }

    const name = req.body.name

    // Check for name uniqueness
    const result_name = find(courseListCollection, {name})
    if (result_name) {
        return next(new BadRequestError('VALIDATION', 'Name should be unique'))
    }

    const newCourseList = {
        id: courseListCollection.length + 1,
        name,
        cart:[]
    }

    courseListCollection.push(newCourseList)

    res.json({
        data: newCourseList
    })
})

router.delete('/', (req, res, next) => {
    if (!req.body.name) {
        return next(new BadRequestError('VALIDATION', 'Missing name'))
    }

    const name = req.body.name

    const result = find(courseListCollection, {name})
    if (!result) {
        return next(new BadRequestError('VALIDATION', 'Name not found'))
    }

    const idRealFromIdExist = courseListCollection.findIndex(c => c.id === result.id)

    courseListCollection.splice(idRealFromIdExist, 1)

    res.json(courseListCollection)
})

module.exports = router