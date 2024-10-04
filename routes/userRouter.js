const Router = require('express')
const UserController = require('../controller/userController')
const router = new Router()

router.post('/login', UserController.login)

module.exports = router