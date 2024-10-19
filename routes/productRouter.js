const Router = require('express')
const UserController = require('../controller/userController')
const productController = require('../controller/productController')
const authMiddleware = require('../middleware/middleware')
const router = new Router()

router.post('/create', authMiddleware, productController.create)
router.get('/:categoryId', productController.getByCategoryId)
router.get('/:id/product', productController.getById)

module.exports = router