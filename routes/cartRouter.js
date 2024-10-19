const Router = require('express')
const router = new Router()
const cartController = require('../controller/cartController')
const authMiddleware = require('../middleware/middleware')

router.post('/', authMiddleware, cartController.create)
router.get('/', authMiddleware, cartController.getByUserId)
router.delete('/:id', authMiddleware, cartController.delete)

module.exports = router