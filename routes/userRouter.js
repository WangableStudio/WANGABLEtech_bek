const Router = require('express')
const UserController = require('../controller/userController')
const authMiddleware = require('../middleware/middleware')
const router = new Router()

router.post('/login', UserController.login, authMiddleware)
router.get('/', authMiddleware, UserController.getById)

module.exports = router