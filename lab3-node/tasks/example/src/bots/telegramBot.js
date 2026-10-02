import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'
import handleMessage from '../handlers/messageHandler.js'

const runTelegramBot = () => {
  dotenv.config();
  const token = process.env.TELEGRAM_BOT_TOKEN;

  // Создаем экземпляр бота
  const bot = new TelegramBot(token, { polling: true });

  const reply = (msg) => (text) => bot.sendMessage(msg.chat.id, text);

  // Обрабатываем команду /start
  bot.onText(/\/start/, (msg) => {
    handleMessage(msg.text, reply(msg));
  });

  // Обрабатываем текстовые сообщения
  bot.on('message', (msg) => {
    handleMessage(msg.text, reply(msg));
  });

  console.log('Бот запущен...');
}

export default runTelegramBot;