const ApiError = require("../error/ApiError");
const { Product, Category } = require("../models/model");
const uuid = require('uuid')

class ProductController {
    async create(req, res, next) {
        try {
            if (req.user.status !== 'ADMIN') {
                return next(ApiError.forbidden('Только админ может создать продукт'))
            }
            const { name, price, description, categoryId } = req.body
            if (!name ||!price ||!description ||!categoryId) {
                return next(ApiError.badRequest('Необходимо заполнить все поля'))
            }
            const category = await Category.findByPk(categoryId)
            if (!category) {
                return next(ApiError.badRequest('Категория не найдена'))
            }
            let idName = uuid.v4().replace(/-/g, '')
            const product = await Product.create({
                id: idName,
                name,
                price,
                description,
                categoryId
            })
            res.json(product)
        } catch (err) {
            return next(ApiError.badRequest(err.message))
        }
    }
    async getByCategoryId(req,res,next){
        try {
            const { categoryId } = req.params
            const products = await Product.findAll({ where: { categoryId } })
            res.json(products)
        } catch (err) {
            return next(ApiError.badRequest(err.message))
        }
    }
}

module.exports = new ProductController();