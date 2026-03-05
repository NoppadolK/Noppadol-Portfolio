// ===== Persistent Theme + Language (TH/EN) =====

// Elements (must exist on every page that uses app.js)
const themeBtn = document.getElementById("themeBtn");
const thBtn = document.getElementById("thBtn");
const enBtn = document.getElementById("enBtn");

// Optional status buttons (exist only on index.html)
const statusEl = document.getElementById("status");
const actionBtn = document.getElementById("actionBtn");
const statusEn = document.getElementById("statusEn");
const actionBtnEn = document.getElementById("actionBtnEn");

// ---- helpers
function getStored(key, fallback) {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}
function setStored(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

// ---- UI labels by language
function applyLabels(lang) {
  // Theme button label
  if (themeBtn) themeBtn.textContent = (lang === "en") ? "Theme" : "สลับธีม";

  // Navigation labels
  const dict = {
    home:     { th: "หน้าแรก",  en: "Home" },
    about:    { th: "เกี่ยวกับ", en: "About" },
    projects: { th: "ผลงาน",    en: "Projects" },
    contact:  { th: "ติดต่อ",   en: "Contact" },
    email:    { th: "อีเมล",   en: "Email" },
    github:   { th: "GitHub",  en: "GitHub" },
    location: { th: "ที่อยู่",  en: "Location" },
  };

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (!dict[key]) return;
    el.textContent = (lang === "en") ? dict[key].en : dict[key].th;
  });
}

// ---- Language
function setLang(lang) {
  document.body.classList.remove("lang-th", "lang-en");
  document.body.classList.add(lang === "en" ? "lang-en" : "lang-th");
  setStored("lang", lang);

  // active style
  thBtn?.classList.toggle("btn-active", lang !== "en");
  enBtn?.classList.toggle("btn-active", lang === "en");

  applyLabels(lang);
}

// ---- Theme
function setTheme(theme) {
  // theme: "light" | "dark"
  document.body.classList.toggle("light", theme === "light");
  setStored("theme", theme);
}

// ---- init (runs on every page load)
const initialLang = getStored("lang", "th");
const initialTheme = getStored("theme", "dark");

setLang(initialLang);
setTheme(initialTheme);

// ---- event listeners
thBtn?.addEventListener("click", () => setLang("th"));
enBtn?.addEventListener("click", () => setLang("en"));

themeBtn?.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
});

// ---- Status buttons (only if present)
actionBtn?.addEventListener("click", () => {
  const now = new Date();
  statusEl.textContent = `สถานะ: Running ✅ | เวลา: ${now.toLocaleString("th-TH")}`;
});

actionBtnEn?.addEventListener("click", () => {
  const now = new Date();
  statusEn.textContent = `Status: Running ✅ | Time: ${now.toLocaleString("en-US")}`;
});
// Highlight active nav link
document.querySelectorAll(".navlinks a").forEach(a => {
  if (a.getAttribute("href") === "./" + location.pathname.split("/").pop()) {
    a.classList.add("link-active");
  }
  // รองรับกรณีเปิด / (root) แล้วเป็น index.html
  if ((location.pathname.endsWith("/") || location.pathname.endsWith("/index.html")) && a.getAttribute("href") === "./index.html") {
    a.classList.add("link-active");
  }
});
// Copy address (TH/EN) + feedback
async function copyWithFeedback(btnId, textId, doneText, defaultText) {
  const btn = document.getElementById(btnId);
  const el = document.getElementById(textId);
  if (!btn || !el) return;

  const text = (el.innerText || "").trim();

  try {
    await navigator.clipboard.writeText(text);
    const old = btn.textContent;
    btn.textContent = doneText;
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = defaultText || old;
      btn.disabled = false;
    }, 1200);
  } catch {
    // fallback (บางเครื่องบล็อก clipboard)
    const old = btn.textContent;
    btn.textContent = "คัดลอกไม่สำเร็จ";
    setTimeout(() => (btn.textContent = defaultText || old), 1200);
  }
}

document.getElementById("copyTh")?.addEventListener("click", () => {
  copyWithFeedback("copyTh", "addrTh", "คัดลอกแล้ว ✅", "คัดลอก");
});

document.getElementById("copyEn")?.addEventListener("click", () => {
  copyWithFeedback("copyEn", "addrEn", "Copied ✅", "Copy");
});