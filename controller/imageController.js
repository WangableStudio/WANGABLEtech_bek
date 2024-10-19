const path = require("path");
const ApiError = require("../error/ApiError");
const { Color, Image } = require("../models/model");
const uuid = require('uuid')

class ImageController {
    async create(req, res, next) {
        try {
            console.log('====================================');
            console.log(req.user);
            console.log('====================================');
            if (req.user.status !== 'ADMIN') {
                return next(ApiError.forbidden("Только админ может создать изображение"));
            }
            const { colorId } = req.body
            const { imageUrl } = req.files
            const idName = uuid.v4().replace(/-/g, '')
            let fileName = uuid.v4() + '.jpg'
            imageUrl.mv(path.resolve(__dirname, "..", "static", "product", fileName));
            if (!colorId) {
                return next(ApiError.badRequest("Необходимо указать colorId"));
            }
            const color = await Color.findByPk(colorId)
            if (!color) {
                return next(ApiError.badRequest("Цвет не найден"));
            }

            const newImage = await Image.create({
                id: idName,
                imageUrl: `/product/${fileName}`,
                colorId,
            })
            res.json(newImage);
        } catch (err) {
            return next(ApiError.internal(err.message));
        }
    }

    async getByColorId(req,res,next){
        try {
            const { colorId } = req.params;
            const images = await Image.findAll({
                where: {
                    colorId,
                },
            });
            res.json(images);
        } catch (err) {
            return next(ApiError.internal(err.message));
        }
    }

    async getAll(req,res,next){
        try {
            const image = await Image.findAll();
            res.json(image);
        } catch (err) {
            return next(ApiError.internal(err.message));
        }
    }
}

module.exports = new ImageController();