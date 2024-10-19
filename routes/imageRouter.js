const Router = require('express')
const imageController = require('../controller/imageController')
const authMiddleware = require('../middleware/middleware')
const router = new Router()

router.post('/create', authMiddleware, imageController.create)
router.get('/:colorId', imageController.getByColorId)
router.get('/', imageController.getAll)

module.exports = router