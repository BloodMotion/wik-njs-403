const {courseList} = require('../../data/db')

mockData = [
    { id: 1, name: 'Toto', cart: {'Tomatoes': {flag: true}, 'Baguette': {flag: false}}},
    { id: 2, name: 'Ma liste',  cart: {}},
    { id: 3, name: 'Test courses',  cart: {}}
]

module.exports = {
    up: () => {
        courseList.splice(0)
        courseList.push.apply(courseList, mockData)
    },

    down: () => {
        courseList.splice(0)
    }
}