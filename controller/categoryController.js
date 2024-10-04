const uuid = require('uuid');
const { Category, Product } = require('../models/model');
const ApiError = require('../error/ApiError');
const path = require('path');
const { model } = require('../db');

class CategoryController {
    async create(req, res, next) {
        if (req.user.status !== 'ADMIN') {
            return next(ApiError.forbidden("Только админ может создать категорию"))
        }

        const { name } = req.body
        const { image } = req.files;
        let fileName = uuid.v4() + '.jpg';
        image.mv(path.resolve(__dirname, "..", "static", fileName));
        let idName = uuid.v4().replace(/-/g, '')
        const category = await Category.create({
            id: idName,
            name,
            image: fileName
        })
        res.json(category)
    }
    async getAll(req, res, next) {
        try {
            const category = await Category.findAll({ include: { model: Product } });
            res.json(category)
        } catch (err) {
            return next(ApiError.badRequest(err.message))
        }
    }
}

module.exports = new CategoryController();