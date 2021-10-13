const express = require('express')
const router = express.Router()
const users = require('./users')
const tasks = require('./tasks')

router.use('/tasks', tasks)
router.use('/users', users)

module.exports = router
