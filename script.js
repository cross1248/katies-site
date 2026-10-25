// ---- Customize ----
const AVATAR = "img/extinguish.png";  // path to your picture, e.g. "images/me.png" (empty = placeholder)
const LINES = ["game dev // scripter // voice actor", "chilling with buddies"];

const svg = (body, c = "#00ff66") => "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`);

// floating "images" - replace with your own paths if you like
const STICKERS = [
  svg('<path d="M50 8C28 8 16 26 20 46c2 8 8 10 10 16v14h40V62c2-6 8-8 10-16C84 26 72 8 50 8z"/><circle cx="38" cy="44" r="7"/><circle cx="62" cy="44" r="7"/><path d="M46 60l4-7 4 7M40 76v-8M50 76v-8M60 76v-8"/>'),
  svg('<rect x="8" y="16" width="84" height="68" rx="4"/><path d="M8 32h84M24 50l12 10-12 10M44 72h20"/>', "#22e8ff"),
  svg('<rect x="22" y="44" width="56" height="44" rx="4"/><path d="M32 44V30a18 18 0 0 1 36 0v14"/><circle cx="50" cy="66" r="5"/>'),
  svg('<path d="M34 24L10 50l24 26M66 24l24 26-24 26M57 16L43 84"/>', "#22e8ff"),
  svg('<circle cx="50" cy="50" r="40"/><ellipse cx="50" cy="50" rx="16" ry="40"/><path d="M10 50h80M16 28h68M16 72h68"/>'),
  svg('<rect x="26" y="26" width="48" height="48" rx="3"/><rect x="38" y="38" width="24" height="24"/><path d="M38 12v14M50 12v14M62 12v14M38 74v14M50 74v14M62 74v14M12 38h14M12 50h14M12 62h14M74 38h14M74 50h14M74 62h14"/>', "#22e8ff"),
  svg('<path d="M50 8l36 14v26c0 22-16 38-36 44C30 86 14 70 14 48V22z"/><path d="M34 50l12 12 22-24"/>'),
];
const TEXT_FLOATERS = ["01101001", "sudo", "</>", "0xFF", "root", "{ }"];

// ---- avatar ----
document.getElementById("avatar").src = AVATAR || svg(
  '<rect x="0" y="0" width="100" height="100" fill="#020a04" stroke="none"/><circle cx="50" cy="38" r="16"/><path d="M16 96c0-24 14-34 34-34s34 10 34 34"/>');

// ---- floating images ----
const box = document.getElementById("floaters");
const n = innerWidth < 600 ? 9 : 16;
for (let i = 0; i < n; i++) {
  const el = document.createElement("div");
  el.className = "fl";
  const size = 30 + Math.random() * 42;
  el.style.cssText = `width:${size}px;left:${Math.random() * 94}%;top:${Math.random() * 90}%;` +
    `--x:${(Math.random() - .5) * 120}px;--y:${(Math.random() - .5) * 170}px;` +
    `--d:${6 + Math.random() * 9}s;--s:${5 + Math.random() * 6}s`;
  if (i % 4 === 3) {
    el.style.width = "auto";
    el.textContent = TEXT_FLOATERS[i % TEXT_FLOATERS.length];
    el.style.color = "#22e8ff";
  } else {
    const img = new Image(); img.alt = ""; img.src = STICKERS[i % STICKERS.length];
    el.appendChild(img);
  }
  box.appendChild(el);
}

// ---- matrix rain ----
const cv = document.getElementById("rain"), cx = cv.getContext("2d");
let cols, drops;
const fs = 16, chars = "01アイウエオカキクケコ{}<>/\\$#@";
const fit = () => { cv.width = innerWidth; cv.height = innerHeight; cols = Math.ceil(cv.width / fs); drops = Array(cols).fill(0).map(() => Math.random() * -50); };
fit(); addEventListener("resize", fit);
setInterval(() => {
  cx.fillStyle = "rgba(2,10,4,.12)"; cx.fillRect(0, 0, cv.width, cv.height);
  cx.fillStyle = "#00ff66"; cx.font = fs + "px monospace";
  drops.forEach((y, i) => {
    cx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs);
    drops[i] = y * fs > cv.height && Math.random() > .975 ? 0 : y + 1;
  });
}, 55);

// ---- boot sequence ----
const boot = document.getElementById("boot"), enter = document.getElementById("enter");
const bootLines = ["> initializing node...", "> bypassing firewall... done", "> loading profile: katie", "> sound module ready"];
let bl = 0;
(function step() {
  if (bl < bootLines.length) { boot.textContent += bootLines[bl++] + "\n"; setTimeout(step, 450); }
  else enter.classList.add("show");
})();

// ---- music ----
const bgm = document.getElementById("bgm"), muteBtn = document.getElementById("mute");
bgm.volume = 0.4;
enter.addEventListener("click", () => {
  document.getElementById("gate").classList.add("gone");
  bgm.play().catch(() => { muteBtn.textContent = "[ music: off ]"; });
  typeLoop();
});
muteBtn.addEventListener("click", () => {
  if (bgm.paused) { bgm.play(); muteBtn.textContent = "[ music: on ]"; }
  else { bgm.pause(); muteBtn.textContent = "[ music: off ]"; }
});

// ---- typing tagline ----
const typed = document.getElementById("typed");
let li = 0, ci = 0, del = false;
function typeLoop() {
  const line = LINES[li];
  typed.textContent = line.slice(0, ci);
  if (!del && ci < line.length) ci++;
  else if (!del) { del = true; return setTimeout(typeLoop, 1400); }
  else if (ci > 0) ci--;
  else { del = false; li = (li + 1) % LINES.length; }
  setTimeout(typeLoop, del ? 35 : 75);
}

// ---- scroll reveal ----
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll(".term").forEach(w => { w.classList.add("reveal"); io.observe(w); });

// ---- cursor trail (binary) ----
let last = 0;
const trail = e => {
  const p = e.touches ? e.touches[0] : e;
  if (Date.now() - last < 50) return;
  last = Date.now();
  const s = document.createElement("span");
  s.textContent = Math.random() > .5 ? "1" : "0";
  s.style.cssText = `position:fixed;left:${p.clientX}px;top:${p.clientY}px;color:#00ff66;pointer-events:none;z-index:95;transition:all .9s;opacity:1`;
  document.body.appendChild(s);
  requestAnimationFrame(() => { s.style.opacity = 0; s.style.transform = "translateY(26px)"; });
  setTimeout(() => s.remove(), 900);
};
addEventListener("mousemove", trail);
addEventListener("touchmove", trail, { passive: true });

// ---- visitor counter (local only) ----
try {
  const v = (+localStorage.getItem("visits") || 0) + 1;
  localStorage.setItem("visits", v);
  document.getElementById("count").textContent = String(v).padStart(4, "0");
} catch {}