// bot.js
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Вставьте сюда токен, который вы получили от BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Начальная клавиатура для выбора языка
const languageKeyboard = {
    reply_markup: {
        keyboard: [
            [
                { text: '🇷🇺 Русский' },
                { text: '🇺🇿 Узбекский' }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

// Клавиатура для русского языка
const russianKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: '🛍 Каталог' }],
            [{ text: 'Изменить язык' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

// Клавиатура для узбекского языка
const uzbekKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: `🛍 Katalog` }],
            [{ text: `Tilni o'zgartirish` }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

const webAppRussianKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Открыть каталог 🛒',
                    web_app: { url: 'https://your-web-app-url.com' } // Замените на URL вашего веб-приложения
                }
            ]
        ]
    }
};

const webAppUzbekKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: 'Katalogni ochish 🛒',
                    web_app: { url: 'https://your-web-app-url.com' } // Замените на URL вашего веб-приложения
                }
            ]
        ]
    }
}

const startBot = () => {
    // Ответ на команду /start
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, '👋 Пожалуйста, выберите язык из кнопок ниже.', languageKeyboard);
    });

    // Обработка выбора языка
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === '🇷🇺 Русский') {
            bot.sendMessage(chatId, 'Чтобы ознакомиться с товарами и начать покупки, перейдите в раздел "🛍 Каталог".', russianKeyboard);
        } else if (text === '🇺🇿 Узбекский') {
            bot.sendMessage(chatId, `Tovarlar bilan tanishish va xarid qilish uchun "🛍 Katalog" bo'limiga o'ting.`, uzbekKeyboard);
        } else if (text === 'Изменить язык') {
            // Вернемся к выбору языка для русского
            bot.sendMessage(chatId, 'Выберите язык:', languageKeyboard);
        } else if (text === `Tilni o'zgartirish`) {
            // Вернемся к выбору языка для узбекского
            bot.sendMessage(chatId, 'Tilni tanlang:', languageKeyboard);
        } else if (text == "🛍 Каталог") {
            bot.sendMessage(chatId, 'Откройте для себя мир товаров! Нажмите на кнопку «Заказать» ⬇️ и начните выбирать свои покупки в удобном каталоге.', webAppRussianKeyboard);
        } else if (text == "🛍 Katalog") {
            bot.sendMessage(chatId, 'Tovarlar dunyosini kashf eting! “Buyurtma berish” tugmasini ⬇️ bosing va qulay katalogda xaridlaringizni tanlashni boshlang.', webAppUzbekKeyboard);
        }
    })

    bot.on('callback_query', (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const callbackData = callbackQuery.data;

        if (callbackData === 'menu') {
            bot.sendMessage(chatId, 'Меню:', dropdownMenu);
        } else if (callbackData === 'start') {
            bot.sendMessage(chatId, 'Команда /start была выбрана.');
            // Добавьте нужную логику для команды /start
        } else if (callbackData === 'help') {
            bot.sendMessage(chatId, 'Команда /help была выбрана.');
            // Добавьте нужную логику для команды /help
        }

        // Удаляем сообщение, чтобы не отображать кнопку после выбора
        bot.answerCallbackQuery(callbackQuery.id);
    });
};

// Экспортируем функцию
module.exports = startBot;
