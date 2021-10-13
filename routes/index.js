const express = require('express')
const router = express.Router()
const users = require('./users')
const tasks = require('./tasks')
const api = require('./api')
const request = require('./request')

// router.use('/tasks', tasks)
// router.use('/users', users)
router.use('/api', api)
// router.use('/request', request)

router.get( '/*', (req, res) => {
    res.render( 'errors', {code: 404, response: null})
})

router.post( '/*', (req, res) => {
    res.render( 'errors', {code: 404, response: null})
})

module.exports = router
