const ApiError = require("../error/ApiError");
const { Cart, Product, User, Color } = require("../models/model");
const uuid = require('uuid')

class CartController {
    async create(req, res, next) {
        try {
            const { productId, productColor, quantity } = req.body;
            const userId = req.user.id
            if (!userId || !productId) {
                return next(ApiError.badRequest('Необходимо указать userId и productId'));
            }
            const color = await Color.findOne({ where: { color: productColor } });
            if (!color) {
                return next(ApiError.badRequest('Цвет не найден'));
            }
            const checkUser = await User.findByPk(userId);
            if (!checkUser) {
                return next(ApiError.badRequest('Пользователь не найден'));
            }
            const checkProduct = await Product.findByPk(productId);
            if (!checkProduct) {
                return next(ApiError.badRequest('Товар не найден'));
            }
            const checkCart = await Cart.findOne({
                where: { userId, productId },
            });
            if (checkCart) {
                return next(ApiError.conflict('Товар уже ждет вас в корзине!'))
            }
            const idName = uuid.v4().replace(/-/g, '')
            const cart = await Cart.create({
                id: idName,
                userId,
                productId,
                productColor: color.color,
                productImage: color.preview,
                quantity
            });
            res.json(cart);
        } catch (err) {
            next(ApiError.internal('Ошибка добавлении товара в корзину', err));
        }
    }
    async getByUserId(req, res, next) {
        try {
            const userId = req.user.id;
            console.log(userId);
            if (!userId) {
                return next(ApiError.badRequest('Необходимо указать userId'));
            }
            const carts = await Cart.findAll({
                where: { userId },
                include: [{ model: Product }],
            });
            const url = process.env.BEKURL
            res.render('carts', { carts, url });
        } catch (err) {
            next(ApiError.internal('Ошибка получения корзины пользователя', err));
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            if (!userId || !id) {
                return next(ApiError.badRequest('Необходимо указать userId и id'));
            }
            const cart = await Cart.findByPk(id);
            if (!cart) {
                return next(ApiError.badRequest('Корзина не найдена'));
            }
            if (cart.userId !== userId) {
                return next(ApiError.forbidden('Недостаточно прав для удаления корзины'));
            }
            await cart.destroy();
            res.json({ message: 'Корзина удалена' });
        } catch (err) {
            next(ApiError.internal('Ошибка удаления корзины', err));
        }
    }
}

module.exports = new CartController();