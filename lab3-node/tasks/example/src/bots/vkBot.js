import { VK } from 'vk-io'
import dotenv from 'dotenv'
import handleMessage from '../handlers/messageHandler.js'

const runVkBot = () => {
  dotenv.config();
  const token = process.env.VK_GROUP_TOKEN;

  // Создаем экземпляр бота
  const vk = new VK({ token });

  // Обрабатываем входящие сообщения
  vk.updates.on('message_new', async (context) => {
    await handleMessage(context.text, (text) => context.send(text));
  });

  // Запускаем бота
  vk.updates.startPolling().then(() => {
    console.log('Бот запущен...');
  });
}

export default runVkBot;