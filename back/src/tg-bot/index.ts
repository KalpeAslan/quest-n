import express from 'express';
import { Telegraf } from 'telegraf';
import { botConfig } from './config';

const app = express();
const port = botConfig.PORT || 3030;

// Set the bot token from environment variables
console.log('BOT_TOKEN:', botConfig.TOKEN);
const bot = new Telegraf(botConfig.TOKEN as string);
bot.start((ctx) => ctx.reply('Welcome! Send me an accessToken.'));
bot.help((ctx) => ctx.reply('Send me an accessToken and I will format it into a URL for you.'));

bot.on('text', (ctx) => {
  const accessToken = ctx.message.text;
  console.log('accessToken:', accessToken);
  const responseUrl = `https://66c0-5-187-4-147.ngrok-free.app`;
  ctx.reply(`Here is your link: ${responseUrl}`);
  ctx.reply('Open', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Open',
            web_app: {
              url: responseUrl,
            },
          },
        ],
      ],
    },
  });
});

// Express server handling
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  bot.launch();
});
