const Router = require('express')
const messageController = require('../controller/messageController')
const router = new Router()

router.post('/error', messageController.error)

module.exports = router