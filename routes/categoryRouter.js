const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const categoryController = require('../controller/categoryController')
const authMiddleware = require('../middleware/middleware')

router.post('/create', authMiddleware, categoryController.create)
router.get('/', categoryController.getAll)

module.exports = router