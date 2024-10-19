const Router = require('express');
const orderController = require('../controller/orderController');
const authMiddleware = require('../middleware/middleware');
const router = new Router()

router.post('/', authMiddleware, orderController.create)
router.get('/', authMiddleware, orderController.getByUser)
router.get('/:id', authMiddleware, orderController.getByID)
router.put('/:id', authMiddleware, orderController.update)
router.delete('/:id', orderController.delete)

module.exports = router