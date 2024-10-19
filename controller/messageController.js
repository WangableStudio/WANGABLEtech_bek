// const { bot } = require('../bot');
// const ApiError = require('../error/ApiError');

class MessageController {
    async error(req, res, next) {
        try {
            const { userId, message, error } = req.body

            if (!userId || !message) {
                return next(ApiError.badRequest('Необходимо указать userId и message'));
            }

            const errorMessageCompact = `⚠️ Ошибка от пользователя: \n - User ID: ${userId} \n - Сообщение: ${message} \n - Детали ошибки: ${error ? error.message : 'Нет деталей'}`;

            // bot.sendMessage(process.env.ADMIN_TELEGRAM_ID, errorMessageCompact)

            return res.json('Сообщение об ошибке отправлено, в скором времени все исправят')
        } catch (err) {
            return next(ApiError.badRequest(err.message))
        }
    }
}

module.exports = new MessageController();