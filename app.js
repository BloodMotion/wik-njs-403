const express = require('express')
const bodyParser = require('body-parser')
const HttpError = require('./errors/http-error')
const NotFoundError = require('./errors/not-found')

const app = express()

const courselistRouter = require('./controllers/courselist-controller')
const courselisItemtRouter = require('./controllers/courselist-item-controller')
const httpErrorRouter = require('./controllers/http-error')
const { courseList } = require('./data/db')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Populate DB json file
dataBuilder = [
    { id: 1, name: 'Toto', cart: [{item: 'Tomatoes', flag: true}, {item: 'Baguette', flag: false}]},
    { id: 2, name: 'Ma liste',  cart: []},
    { id: 3, name: 'Test courses',  cart: []}
]
courseList.splice(0)
courseList.push.apply(courseList, dataBuilder)


app.use('/course-lists', courselistRouter)
app.use('/course-lists/items', courselisItemtRouter)
app.use('/http-error', httpErrorRouter)

app.use((req, res, next) => {
    return next(new NotFoundError())
})

app.use((err, req, res, next) => {
    if (!(err instanceof HttpError)) {
        console.error(err)
        err = new HttpError(err.message || 'Unknown error')
    }

    res.status(err.statusCode)
    res.json({
        error: err
    })
})

if (!module.parent) {
    app.listen(3000, () => {
        console.log('Server launched on port 3000')
    })
}

module.exports = app
