const Router = require('express')
const UserController = require('../controller/userController')
const authMiddleware = require('../middleware/middleware')
const router = new Router()

router.post('/login', UserController.login)
router.post('/auth', UserController.auth)
router.put('/update', authMiddleware, UserController.update)
router.get('/', authMiddleware, UserController.getById)

module.exports = router