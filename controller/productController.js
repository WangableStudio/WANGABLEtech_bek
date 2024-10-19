const ApiError = require("../error/ApiError");
const { Product, Category, Color, Image } = require("../models/model");
const uuid = require('uuid')
const path = require('path');

class ProductController {
    async create(req, res, next) {
        try {
            if (req.user.status !== 'ADMIN') {
                return next(ApiError.forbidden('Только админ может создать продукт'))
            }
            const { name, price, description, categoryId, total } = req.body
            const { image } = req.files
            let fileName = uuid.v4() + '.jpg'
            image.mv(path.resolve(__dirname, "..", "static", fileName));
            if (!name || !price || !description || !categoryId) {
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
                categoryId,
                image: fileName,
                total: total || 0
            })
            res.json(product)
        } catch (err) {

            return next(ApiError.badRequest(err.message))
        }
    }
    async getByCategoryId(req, res, next) {
        try {
            const { categoryId } = req.params;
            const products = await Product.findAll({ where: { categoryId }, include: { model: Color } });
            const url = process.env.BEKURL
            res.render('products', { products, url });
        } catch (err) {
            return next(ApiError.badRequest(err.message));
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, { include: { model: Color, include: { model: Image } } });
            console.log('====================================');
            console.log(product);
            console.log('====================================');
            if (!product) {
                return next(ApiError.notFound('Продукт не найден'))
            }
            res.json(product);
        } catch (err) { 
            return next(ApiError.badRequest(err.message));
        }
    }
}

module.exports = new ProductController();