const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const {find} = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList


router.get('/', (req, res, next) => {
    res.json(db);

    /*
    db.forEach(function(item){
        console.log(item);
    });
    */
})

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

    const listToDelete = result.id-1
    courseListCollection.splice(listToDelete, 1)

    res.json(courseListCollection)
})

module.exports = router