import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);
let scores = {}; // V1: memory. Upgrade to Vercel KV at 1k users

bot.start((ctx) => {
  ctx.replyWithHTML(
    '🎮 <b>Rael Kertia Arena</b>\n\n' +
    '• Fair levels - transparent seed\n' +
    '• Skill revives - no paywall\n' +
    '• /duel @friend - 1v1 battle\n' +
    '• /top - group leaderboard\n' +
    'Tap PLAY to start:',
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'PLAY NOW', web_app: { url: process.env.WEBAPP_URL || 'https://your-project.vercel.app' } }
        ],[
          { text: '💎 Premium $1.99', callback_data: 'premium' }
        ]]
      }
    }
  );
});

bot.command('duel', (ctx) => {
  const opponent = ctx.message.text.split(' ')[1];
  if(!opponent) return ctx.reply('Use: /duel @username');

  const duelId = Date.now();
  ctx.reply(
    `⚔️ Duel Challenge!\n${ctx.from.first_name} vs ${opponent}\n\nFirst to score 30 wins 50 coins`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'ACCEPT DUEL', web_app: { url: `${process.env.WEBAPP_URL}?duel=${duelId}` } }
        ]]
      }
    }
  );
});

bot.command('top', (ctx) => {
  const chatId = ctx.chat.id;
  const top = Object.entries(scores)
   .filter(([id, data]) => data.chat === chatId)
   .sort((a,b) => b[1].score - a[1].score)
   .slice(0, 10)
   .map(([id, data], i) => `${i+1}. ${data.name} - Lv${data.level} - ${data.score} pts`)
   .join('\n');

  ctx.reply(top || 'No scores yet. Play and climb!');
});

bot.action('premium', (ctx) => {
  ctx.reply('Premium Pass $1.99/mo with Telegram Stars:\n• No ads\n• 2x XP\n• Exclusive skins');
});

export default async (req, res) => {
  if(req.method === 'POST') await bot.handleUpdate(req.body);
  res.status(200).send('OK');
};
