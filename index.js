const telegramApi = require("node-telegram-bot-api");
const {gameOptions, againGame} = require('./options')
const telegramToken = "5230381173:AAGKx2W0ZA9EbH8MY4psWZXnsSacJYpR45g";


const bot = new telegramApi(telegramToken, {polling: true});
const chats = {};



const startGame =async (chatId) => {
    await bot.sendMessage(chatId, "Сейчас я загадаю число от 0 до 9, а ты должен её угадать");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
}

bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'},
    {command: '/info', description: 'Узнать своё имя'},
    {command: '/game', description: 'Игра угадай число'}
])


const start = () => {
    bot.on("message", async msg => {
        console.log(msg);
        const chatId = msg.chat.id;
        const text = msg.text;
        const name = msg.from.first_name;


        if (text === '/start') {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/d65/e59/d65e5998-fbfc-4e01-b9c3-4211c624a561/5.webp")
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм-бот нутрициолога, Даны Дмитриевой!`)
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${name}, ты что забыл?`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, "Поясни, что ты хочешь?")

    })

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === "/again") {
            return startGame(chatId)
        }

        if (parseInt(data) === chats[chatId]) {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/92f/c2d/92fc2d9b-0d95-39fe-bad5-e29a0ba05dbc/1.webp")
            return bot.sendMessage(chatId, "Ты угадал, ура!")
        } else {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/1cf/31c/1cf31c1e-0508-4ddf-a9bf-0bfbc24709ab/3.webp")
            return bot.sendMessage(chatId, "Ты не угадал, попробуй угадать в следующий раз!", againGame)
        }
    })

};
start();