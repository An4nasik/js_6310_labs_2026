import { describe, test, expect, jest } from '@jest/globals';

let vkInstances = [];
let messageHandlers = [];

jest.unstable_mockModule('vk-io', () => ({
  VK: jest.fn().mockImplementation(() => {
    const vk = {
      updates: {
        on: jest.fn(),
        startPolling: jest.fn().mockResolvedValue({}),
      },
    };
    vk.updates.on.mockImplementation((event, cb) => { messageHandlers.push(cb); });
    vkInstances.push(vk);
    return vk;
  }),
}));

const { default: runVkBot } = await import('../src/bots/vkBot');

describe('runVkBot', () => {
  test('creates a VK instance and starts polling', async () => {
    const { VK } = await import('vk-io');
    runVkBot();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(VK).toHaveBeenCalled();
  });

  test('replies to /start through the registered handler', async () => {
    const vk = vkInstances[0];
    const context = { text: '/start', send: jest.fn().mockResolvedValue({}) };
    const cb = messageHandlers[0];
    await cb(context);
    expect(context.send).toHaveBeenCalledWith('Привет! Я твой первый бот!');
    expect(vk.updates.startPolling).toHaveBeenCalled();
  });
});