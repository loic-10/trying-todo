const express = require('express')
const router = express.Router()
const {
    taskCreate,
    taskUpdate,
    taskDelete,
    taskGetOne,
    taskGetOneAndPopulateUser
} = require('../../../controllers/api/tasks.controller')

router.get('/get/:code', taskGetOne)
router.get('/taskGetOneAndPopulateUser/:code', taskGetOneAndPopulateUser)
router.post('/create', taskCreate)
router.put('/update/:code', taskUpdate)
router.delete('/delete/:code', taskDelete)

module.exports = router
