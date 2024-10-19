const Router = require('express')
const authMiddleware = require('../middleware/middleware')
const colorController = require('../controller/colorController')
const router = new Router()

router.post('/create', authMiddleware, colorController.create )

module.exports = router