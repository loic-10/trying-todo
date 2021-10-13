const express = require('express')
const router = express.Router()
const {
    userGetOne,
    userCreate,
    userGetAll,
    userDelete,
    userGetOneAndPopulateTasks
} = require('../../../controllers/api/users.controller')

router.get('/get/:code', userGetOne)
router.get('/userGetOneAndPopulateTask/:code', userGetOneAndPopulateTasks)
router.post('/create', userCreate)
router.put('/getAll', userGetAll)
router.delete('/delete/:code', userDelete)

module.exports = router
