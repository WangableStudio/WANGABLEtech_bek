const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const { Product } = require('../models/model');
const path = require('path');

class ColorController {
    async create(req, res, next) {
        try {
            if (req.user.status !== 'ADMIN') {
                return next(ApiError.forbidden("Только админ может создать цвета"))
            }
            const { color, color_ru, colorHex, productId } = req.body
            const { preview } = req.files
            let previewName = uuid.v4() + '.jpg'
            preview.mv(path.resolve(__dirname, "..", "static", "product", previewName));
            const idName = uuid.v4().replace(/-/g, '')
            if (!color || !color_ru || !colorHex || !productId) {
                return next(ApiError.badRequest('Необходимо заполнить все поля'))
            }
            const product = await Product.findByPk(productId)
            if (!product) {
                return next(ApiError.badRequest('Продукт не найден'))
            }
            const colorJson = await product.createColor({
                id: idName,
                color,
                color_ru,
                colorHex,
                preview: `/product/${previewName}`,
                productId
            })
            res.json(colorJson)
        } catch (err) {
            return next(ApiError.badRequest(err))
        }
    }
}

module.exports = new ColorController();