import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN!;

const webAppUrl = process.env.WEBAPP_URL || "https://example.com";

if (!token) {
  console.error("BOT_TOKEN не задан в .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  if ((msg.text || "") === "/start") {
    await bot.sendMessage(msg.chat.id, "Открыть WebApp", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Открыть as",
              web_app: {
                url: "https://5905eb71743d55.lhr.life",
              },
            },
          ],
        ],
      },
    });
  }
});

process.on("SIGINT", () => bot.stopPolling());
process.on("SIGTERM", () => bot.stopPolling());
