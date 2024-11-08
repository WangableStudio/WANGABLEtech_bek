// bot.js
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Вставьте сюда токен, который вы получили от BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const BEK_URL = process.env.BEKURL;
const bot = new TelegramBot(token, { polling: true });

function getPlaceByCoords(lat, lon) {
    var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                var placeName = data.display_name;

                var addressParts = placeName.split(',');

                return addressParts.slice(0, addressParts.length - 3).join(', ').trim();
            } else {
                alert('Не удалось определить адрес.');
            }
        })
        .catch(error => {
            console.error('Ошибка при обратном геокодировании:', error);
        });
}

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
                    web_app: { url: 'https://wangabletech.netlify.app' } // Замените на URL вашего веб-приложения
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
                    web_app: { url: 'https://wangabletech.netlify.app' } // Замените на URL вашего веб-приложения
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
        } else if (text === "🛍 Каталог") {
            bot.sendMessage(chatId, 'Откройте для себя мир товаров! Нажмите на кнопку «Заказать» ⬇️ и начните выбирать свои покупки в удобном каталоге.', webAppRussianKeyboard);
        } else if (text === "🛍 Katalog") {
            bot.sendMessage(chatId, 'Tovarlar dunyosini kashf eting! “Buyurtma berish” tugmasini ⬇️ bosing va qulay katalogda xaridlaringizni tanlashni boshlang.', webAppUzbekKeyboard);
        }
    })

    bot.on('callback_query', (callbackQuery) => {
        const msg = callbackQuery.message;
        const chatId = callbackQuery.message.chat.id;
        const callbackData = callbackQuery.data;

        if (callbackData === 'menu') {
            bot.sendMessage(chatId, 'Меню:', dropdownMenu);
        } else if (callbackData === 'start') {
            bot.sendMessage(chatId, 'Команда /start была выбрана.');
        } else if (callbackData === 'help') {
            bot.sendMessage(chatId, 'Команда /help была выбрана.');
        } else if (callbackData.startsWith('change_location:')) {
            const orderNumber = callbackData.split(':')[1];

            const locationKeyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "📍 Выбрать место на карте",
                                web_app: {
                                    url: `https://your-web-app-url.com?orderNumber=${orderNumber}`  // Передаем orderNumber в веб-приложение
                                }
                            }
                        ]
                    ]
                }
            };

            bot.sendMessage(chatId, 'Пожалуйста, выберите нужное местоположение на карте:', locationKeyboard);
        } else if (callbackData.startsWith('cancel_order:')) {
            const orderNumber = callbackData.split(':')[1];
            axios.delete(`${BEK_URL}/api/v1/order/${orderNumber}`, {
                data: {
                    secretkey: process.env.SECRET_KEY
                }
            }).then(res => {
                if (res.status === 200) {
                    bot.sendMessage(chatId, `📦 Заказ по номеру: ${orderNumber} был успешно отменен.`);
                } else {
                    bot.sendMessage(chatId, `⚠️ Не удалось отменить заказ по номеру: ${orderNumber}. Попробуйте позже.`);
                }
            }).catch(err => {
                console.error('Ошибка при отмене заказа:', err);
                if (err.response && err.response.status === 404) {
                    bot.sendMessage(chatId, `❌ Заказ с номером ${orderNumber} не найден.`);
                } else if (err.response && err.response.status === 500) {
                    bot.sendMessage(chatId, `🚨 Произошла ошибка на сервере при отмене заказа. Пожалуйста, попробуйте позже.`);
                } else {
                    bot.sendMessage(chatId, '⚠️ Не удалось отменить заказ. Пожалуйста, попробуйте снова.');
                }
            });
        }
        bot.answerCallbackQuery(callbackQuery.id);
    });
    bot.on('location', async (msg) => {
        const { latitude, longitude } = msg.location;
        const placeName = await getPlaceByCoords(latitude, longitude);
        bot.sendMessage(msg.chat.id, `Вы выбрали место: ${placeName}, ${latitude}, ${longitude}`);
    });
};

module.exports = { startBot, bot };