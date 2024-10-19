const ApiError = require("../error/ApiError");
const { Color, Product, User, Order, Cart } = require("../models/model");
const { bot } = require('../bot');
const jwt = require('jsonwebtoken');


class OrderController {
    async create(req, res, next) {
        try {
            const { productId, name, phone, address, geo, total, productColor, productImage } = req.body;
            const userId = req.user.id;

            if (!productId || !name || !phone || !address) {
                return next(ApiError.badRequest('Необходимо указать userId, productId, name, phone, address, geo, total и status'));
            }

            const checkColor = await Color.findOne({ where: { color: productColor } });
            if (!checkColor) {
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

            const checkCart = await Cart.findOne({ where: { productId: productId } });
            if (!checkCart) {
                return next(ApiError.badRequest('Товар не добавлен в корзину'));
            }

            const price = checkProduct.price * total;
            const orderNumber = Math.floor(1000000000 + Math.random() * 9000000000);

            const order = await Order.create({
                id: orderNumber,
                productId,
                userId,
                name,
                phone,
                address,
                geo,
                total,
                productColor,
                productImage,
                price: price
            });

            checkCart.destroy()

            const successMessage = `🎉 Ваш заказ успешно оформлен! Спасибо за покупку!` +
                `\n\n💬 Ожидайте сообщения от нашего оператора для подтверждения деталей и расчёта времени доставки.` +
                `\n\n📦 Номер вашего заказа: <b>${orderNumber}</b>` +
                `\n\n📍 Пункт выдачи: <b>${address}</b>` +
                `\n\n🚚 Время доставки будет уточнено после отправки заказа курьером.` +
                `\n\n👍 Спасибо, что выбрали нас! Если у вас возникнут вопросы, мы всегда рады помочь. 💬`;

            // Отправляем сообщение об успешном заказе
            await bot.sendMessage(process.env.ADMIN_TELEGRAM_ID, successMessage, { parse_mode: 'HTML' });

            // Объединяем количество и цену с правильным форматированием
            const formattedPrice = `${total} ✖️ ${Number(checkProduct.price).toLocaleString()} = ${(total * checkProduct.price).toLocaleString()} сум`;

            // Сообщение с деталями заказа
            const productMessage = `🛒 <b>Детали заказа:</b>` +
                `\n\n━━━━━━━━━━━━━━━━━━━` +
                `\n📦 <b>Товар:</b> ${checkProduct.name}` +
                `\n\n🎨 <b>Цвет:</b> ${checkColor.color_ru}` +
                `\n\n💵 <b>Количество и цена: ${formattedPrice}</b>` +
                `\n━━━━━━━━━━━━━━━━━━━` +
                `\n\n🛑 <b>Статус заказа:</b> ${order.status}` +
                `\n\n📝 <b>Описание:</b> ${checkProduct.description}`;

            const options = {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Отменить заказ', callback_data: `cancel_order:${orderNumber}` }
                        ],
                        [
                            { text: 'Изменить пункт выдачи', callback_data: `change_location:${orderNumber}` }
                        ],
                        [
                            { text: 'Связаться с оператором', callback_data: `contact_operator:${orderNumber}` }
                        ],
                        [
                            { text: 'Оставить отзыв', callback_data: `leave_feedback:${orderNumber}` }
                        ],
                        [
                            { text: 'Узнать статус доставки', callback_data: `track_delivery:${orderNumber}` }
                        ],
                        [
                            { text: 'Получить чек', callback_data: `get_receipt:${orderNumber}` }
                        ]
                    ]
                }
            };

            // Отправляем сообщение с деталями заказа
            await bot.sendMessage(process.env.ADMIN_TELEGRAM_ID, productMessage, options);
            // await bot.sendPhoto(process.env.ADMIN_TELEGRAM_ID, 'http://localhost:4000' + productImage, {
            //     caption: productMessage,
            //     parse_mode: 'HTML',
            //     reply_markup: {
            //         inline_keyboard: [
            //             [
            //                 { text: 'Отменить заказ', callback_data: `cancel_order:${orderNumber}` }
            //             ],
            //             [
            //                 { text: 'Связаться с оператором', callback_data: `contact_operator:${orderNumber}` }
            //             ]
            //         ]
            //     }
            // })
            console.log('Заказ успешно оформлен', order);
            return res.json(order);
        } catch (err) {
            console.error('Ошибка:', err);
            return next(ApiError.badRequest('Ошибка создания заказа: ' + err.message));
        }
    }

    async getByUser(req, res, next) {
        try {
            const userId = req.user.id;
            const orders = await Order.findAll({ where: { userId }, include: [{ model: Product }] });
            if (!orders) {
                return next(ApiError.badRequest('Заказы не найдены'));
            }
            const colorPromises = orders.map(async (order) => {
                const color = await Color.findOne({ where: { color: order.productColor } });
                order.productColor = color ? color.color_ru : 'Неизвестный цвет';
            });

            await Promise.all(colorPromises);
            return res.render('orders', { orders });
        } catch (err) {
            console.error('Ошибка:', err);
            return next(ApiError.badRequest('Ошибка при получении заказов'));
        }
    }

    async getByID(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const order = await Order.findByPk(id, { include: [{ model: Product }] });
            if (order.userId !== userId) {
                return next(ApiError.forbidden('Вы не можете получить заказ другого пользователя'));
            }
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }
            const color = await Color.findOne({ where: { color: order.productColor } });
            order.productColor = color ? color.color_ru : 'Неизвестный цвет';
            return res.json(order);
        } catch (err) {
            console.error('Ошибка:', err);
            return next(ApiError.badRequest('Ошибка при получении заказа'));
        }
    }

    async update(req, res, next) {
        try {
            const { name, phone, address, geo, total, productColor, productImage, status } = req.body
            const { id } = req.params;
            const userId = req.user.id;
            const order = await Order.findByPk(id)
            if (!order) {
                return next(ApiError.badRequest('Заказ не найден'));
            }

            const user = await User.findByPk(userId);
            if (user.status === 'ADMIN') {
                order.status = status;
            } else if (status) {
                return next(ApiError.forbidden('Только администратор может изменять статус заказа'));
            }

            order.name = name || order.name;
            order.phone = phone || order.phone;
            order.address = address || order.address;
            order.geo = geo || order.geo;
            order.total = total || order.total;
            order.productColor = productColor || order.productColor;

            await order.save()

            return res.json(order);
        } catch (err) {
            console.error('Ошибка:', err); // Логирование ошибки
            return next(ApiError.badRequest('Ошибка обновления заказа: ' + err.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { secretkey } = req.body
            const { id } = req.params;
            const order = await Order.findByPk(id)
            if (secretkey) {
                if (secretkey !== process.env.SECRET_KEY) {
                    return next(ApiError.forbidden('Неверный секретный ключ'));
                }
            } else {
                const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовков
                if (!token) {
                    return next(ApiError.badRequest('Токен не предоставлен'));
                }

                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                req.user = decoded;

                const userId = req.user.id;
                if (order.userId !== userId) {
                    return next(ApiError.forbidden('У вас недостаточно прав для удаления заказа'));
                }
            }

            await order.destroy()
            console.log('Заказ успешно удален', order);
            return res.json(order);
        } catch (err) {
            console.error('Ошибка:', err);
            return next(ApiError.badRequest('Ошибка удаления заказа: ' + err.message));
        }
    }
}

module.exports = new OrderController();