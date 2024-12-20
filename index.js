const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();

// Telegram bot sozlamalari
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(token, { polling: false });

// CORS sozlamalarini yangilash
app.use(cors({
    origin: 'https://muhammadqodir1313.github.io',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Response headerlarini to'g'rilash
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'https://muhammadqodir1313.github.io');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
});

// JSON sozlamalari
app.use(express.json());

// Contact API endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validatsiya
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: "Barcha maydonlar to'ldirilishi shart" 
            });
        }

        // Telegram botga xabar yuborish
        const telegramMessage = 
            ` Yangi xabar keldi!\n\n` +
            `👤 Ism: ${name}\n` +
            `📧 Email: ${email}\n` +
            `💬 Xabar: ${message}`;

        await bot.sendMessage(chatId, telegramMessage);

        console.log('Telegram xabar yuborildi');

        res.status(200).json({ 
            success: true, 
            message: "Xabar muvaffaqiyatli yuborildi" 
        });

    } catch (error) {
        console.error('Xatolik:', error);
        res.status(500).json({ 
            error: "Serverda xatolik yuz berdi" 
        });
    }
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishga tushdi`);
});