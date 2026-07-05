(function () {
  "use strict";

  // ===== TELEGRAM НАСТРОЙКИ =====
  const BOT_TOKEN = window.ENV?.BOT_TOKEN || "{{BOT_TOKEN}}";
  const CHAT_ID = window.ENV?.CHAT_ID || "{{CHAT_ID}}";

  const isTokenValid =
    BOT_TOKEN &&
    BOT_TOKEN !== "{{BOT_TOKEN}}" &&
    BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE" &&
    BOT_TOKEN.length > 20;

  const isChatIdValid =
    CHAT_ID && CHAT_ID !== "{{CHAT_ID}}" && CHAT_ID !== "YOUR_CHAT_ID_HERE";

  console.log(
    "🔐 BOT_TOKEN:",
    isTokenValid ? "✅ установлен" : "❌ не настроен",
  );
  console.log(
    "🔐 CHAT_ID:",
    isChatIdValid ? "✅ установлен" : "❌ не настроен",
  );

  // ===== КОНФЕТТИ =====
  const confettiContainer = document.getElementById("confettiContainer");
  const colors = [
    "#818cf8",
    "#f472b6",
    "#a78bfa",
    "#f9a8d4",
    "#6366f1",
    "#ec4899",
    "#8b5cf6",
    "#f472b6",
  ];

  function createConfetti(count = 60) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.classList.add("confetti");
      const size = Math.random() * 6 + 3;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 4 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const borderRadius = Math.random() > 0.5 ? "50%" : "1px";
      el.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                border-radius: ${borderRadius};
                box-shadow: 0 0 10px ${color}40;
            `;
      confettiContainer.appendChild(el);
    }
  }
  createConfetti(70);

  setInterval(() => {
    for (let i = 0; i < 8; i++) {
      const el = document.createElement("div");
      el.classList.add("confetti");
      const size = Math.random() * 5 + 3;
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 4 + 3;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const borderRadius = Math.random() > 0.5 ? "50%" : "1px";
      el.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                border-radius: ${borderRadius};
                box-shadow: 0 0 10px ${color}40;
            `;
      confettiContainer.appendChild(el);
      setTimeout(
        () => {
          if (el.parentNode) el.remove();
        },
        (duration + delay) * 1000 + 200,
      );
    }
  }, 6000);

  // ===== СЧЕТЧИК =====
  function updateDays() {
    const target = new Date("2026-07-13T00:00:00").getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, target - now);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    document.getElementById("daysCounter").textContent = days;
  }
  updateDays();

  // ===== СЕРДЦЕ/ЗВЕЗДА =====
  const heartEmoji = document.getElementById("heartEmoji");
  const heartContainer = document.getElementById("heartContainer");
  let heartTimeout = null;
  const emojis = ["✦", "♥", "✦", "♥", "✦"];

  function boomHeart() {
    const current = heartEmoji.textContent;
    const nextIndex = (emojis.indexOf(current) + 1) % emojis.length;
    heartEmoji.textContent = emojis[nextIndex];

    heartEmoji.classList.add("big-boom");
    if (heartTimeout) clearTimeout(heartTimeout);
    heartTimeout = setTimeout(() => {
      heartEmoji.classList.remove("big-boom");
    }, 500);
    if (navigator.vibrate) navigator.vibrate(10);

    for (let i = 0; i < 12; i++) {
      const el = document.createElement("div");
      el.classList.add("confetti");
      const size = Math.random() * 8 + 3;
      const left = 40 + Math.random() * 20;
      const delay = Math.random() * 0.3;
      const duration = Math.random() * 1.5 + 1.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `
                left: ${left}%;
                top: ${30 + Math.random() * 40}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                border-radius: 50%;
                box-shadow: 0 0 20px ${color}60;
                opacity: 0.8;
            `;
      confettiContainer.appendChild(el);
      setTimeout(
        () => {
          if (el.parentNode) el.remove();
        },
        (duration + delay) * 1000 + 300,
      );
    }
  }

  heartContainer.addEventListener("click", boomHeart);
  heartContainer.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      boomHeart();
    },
    { passive: false },
  );

  // ===== ПОЛЕ ВВОДА =====
  const guestNameInput = document.getElementById("guestNameInput");

  setTimeout(() => {
    guestNameInput.focus();
  }, 800);

  guestNameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && this.value.trim().length > 0) {
      document.getElementById("magicBtn").click();
    }
  });

  // ===== ОСНОВНАЯ КНОПКА =====
  const magicBtn = document.getElementById("magicBtn");
  const inviteCard = document.getElementById("inviteCard");
  const landingPage = document.getElementById("landingPage");

  // ===== ОТПРАВКА В TELEGRAM =====
  async function sendToTelegram(name) {
    const token = BOT_TOKEN;
    const chatId = CHAT_ID;

    // Проверяем, настроены ли токены
    const isTokenConfigured =
      token &&
      token !== "{{BOT_TOKEN}}" &&
      token !== "YOUR_BOT_TOKEN_HERE" &&
      token.length > 20;

    const isChatConfigured =
      chatId && chatId !== "{{CHAT_ID}}" && chatId !== "YOUR_CHAT_ID_HERE";

    if (!isTokenConfigured || !isChatConfigured) {
      console.log("ℹ️ Telegram не настроен. Имя сохранено локально.");
      console.log("👤 Имя гостя:", name);
      console.log("💡 Создайте файл config.js с вашими токенами");
      return true;
    }

    const message = `🎉 Новый гость подтвердил приход!\n\n👤 Имя: ${name}\n📅 Мероприятие: ДР Елизаветы 13.07.2026\n📍 Адрес: Северная ул. 302\n✨ Будет стильно!`;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        },
      );

      const data = await response.json();

      if (!data.ok) {
        console.error("❌ Ошибка Telegram API:", data);
        if (data.error_code === 404) {
          console.error("⚠️ Бот не найден! Проверь токен.");
        }
        return false;
      }

      console.log("✅ Сообщение отправлено в Telegram!");
      return true;
    } catch (error) {
      console.error("❌ Ошибка отправки в Telegram:", error);
      return false;
    }
  }

  // ===== ВЗРЫВ =====
  function bigExplosion(count = 60) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.classList.add("confetti");
      const size = Math.random() * 10 + 4;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 0.6;
      const duration = Math.random() * 2.5 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `
                left: ${left}%;
                top: ${top}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                border-radius: ${Math.random() > 0.5 ? "50%" : "1px"};
                box-shadow: 0 0 30px ${color}60;
                opacity: 0.9;
            `;
      confettiContainer.appendChild(el);
      setTimeout(
        () => {
          if (el.parentNode) el.remove();
        },
        (duration + delay) * 1000 + 400,
      );
    }
  }

  magicBtn.addEventListener("click", async function (e) {
    const guestName = guestNameInput.value.trim();

    if (guestName.length === 0) {
      guestNameInput.style.borderColor = "#f472b6";
      guestNameInput.style.boxShadow = "0 0 40px rgba(244, 114, 182, 0.1)";
      guestNameInput.placeholder = "⚠️ Напиши своё имя!";
      setTimeout(() => {
        guestNameInput.style.borderColor = "";
        guestNameInput.style.boxShadow = "";
        guestNameInput.placeholder = "Например: Александр";
      }, 2000);
      return;
    }

    magicBtn.disabled = true;
    magicBtn.innerHTML = "<span>⏳ Отправка...</span>";

    await sendToTelegram(guestName);

    magicBtn.disabled = false;
    magicBtn.innerHTML = "<span>✨ Я приду ✨</span>";

    bigExplosion(80);
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);

    document.getElementById("guestNameDisplay").textContent = guestName;

    inviteCard.classList.add("hidden");

    setTimeout(() => {
      landingPage.classList.add("active");
      setTimeout(() => {
        bigExplosion(50);
      }, 300);
    }, 400);
  });

  // ===== ЛЕНДИНГ =====
  const landingClose = document.getElementById("landingClose");

  function closeLanding() {
    landingPage.classList.remove("active");
    inviteCard.classList.remove("hidden");
  }

  landingClose.addEventListener("click", closeLanding);
  landingPage.addEventListener("click", function (e) {
    if (e.target === landingPage) closeLanding();
  });

  // ===== СЮРПРИЗ =====
  const surpriseBtn = document.getElementById("surpriseBtn");

  surpriseBtn.addEventListener("click", function () {
    bigExplosion(100);
    if (navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 80]);

    const originalText = surpriseBtn.textContent;
    surpriseBtn.textContent = "✨ МАГИЯ ВЫПОЛНЕНА ✨";
    surpriseBtn.style.background = "linear-gradient(135deg, #818cf8, #f472b6)";
    surpriseBtn.style.color = "#fff";
    surpriseBtn.style.borderColor = "transparent";
    setTimeout(() => {
      surpriseBtn.textContent = originalText;
      surpriseBtn.style.background = "";
      surpriseBtn.style.color = "";
      surpriseBtn.style.borderColor = "";
    }, 2000);

    const msg = document.getElementById("landingMessage");
    msg.innerHTML = `
            <span class="big-icon">🎆</span>
            <strong style="color: #818cf8;">Елизавета</strong> уже в предвкушении!<br>
            Ты — её самый желанный гость!<br>
            <span class="big-icon" style="font-size: 28px; margin-top: 6px;">💫✨</span>
            <span style="font-size: 12px; display: block; margin-top: 6px; color: rgba(255,255,255,0.2);">
                До встречи 13 июля!
            </span>
        `;
    msg.style.borderColor = "rgba(99, 102, 241, 0.1)";
    msg.style.background = "rgba(99, 102, 241, 0.03)";
  });

  // ===== ПРИ ЗАГРУЗКЕ =====
  window.addEventListener("load", function () {
    setTimeout(() => {
      bigExplosion(30);
    }, 600);

    // Проверяем наличие config.js
    if (!window.ENV) {
      console.warn(
        "⚠️ Файл config.js не найден! Создайте его с вашими токенами.",
      );
      console.warn("💡 Используйте config.example.js как шаблон.");
    }
  });
})();
