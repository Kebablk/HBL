export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешен" });
  }

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Имя не указано" });
    }

    // Токены берутся из переменных окружения Vercel
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: "Токены не настроены в Vercel" });
    }

    const message = `🎉 Новый гость подтвердил приход!\n\n👤 Имя: ${name}\n📅 Мероприятие: ДР Елизаветы 13.07.2026\n📍 Адрес: Северная ул. 302\n✨ Будет стильно!`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );

    const data = await response.json();

    if (!data.ok) {
      console.error("❌ Ошибка Telegram:", data);
      return res.status(500).json({ error: data.description });
    }

    console.log("✅ Сообщение отправлено!");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Ошибка:", error);
    return res.status(500).json({ error: error.message });
  }
}
