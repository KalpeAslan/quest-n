import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = '7314664301:AAHEUZ3bX0dXJuUO-hycu2pGtnFiYGAMPRs';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const sendMessage = async (chatId: string, text: string) => {
    const url = `${TELEGRAM_API_URL}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
    return response.json();
};

app.post('/webhook', async (req, res) => {
    const { message } = req.body;
    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text;

        if (text === '/start') {
            await sendMessage(chatId, 'Welcome to the bot!');
        } else {
            await sendMessage(chatId, `You said: ${text}`);
        }
    }
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
