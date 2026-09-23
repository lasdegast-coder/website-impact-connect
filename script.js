/* ═══════════════════════════════════════════════════════════════════
   Impact Connect — gedeelde JavaScript
   Draait op elke pagina. Wat er precies gebeurt, hangt af van
   <body data-page="..."> in het HTML-bestand.
   ═══════════════════════════════════════════════════════════════════ */

/* ── kleine helpers ──────────────────────────────────────────────── */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Lucide-icoon als SVG-string. */
function icon(name, size = 16, opts = {}) {
  const inner = ICON_PATHS[name];
  if (!inner) return "";
  const stroke = opts.color || "currentColor";
  const fill = opts.fill || "none";
  const sw = opts.strokeWidth || 2;
  const cls = "ic" + (opts.className ? " " + opts.className : "");
  const style = opts.style ? ` style="${opts.style}"` : "";
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}"
    stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true"${style}>${inner}</svg>`;
}

/** Het merkteken: opkomende zon boven twee golven. */
// Het merkteken: de Vollers Bridge, een dekbalk met daaronder een boog.
// Nagetekend van het merkboard (impact-connect/Logo Impact Connect.JPG).
// `size` is de breedte, de hoogte volgt de verhouding 124:82.
function bridgeMark(size = 30, color = "#13352A") {
  const h = Math.round((size * 82) / 124);
  return `<svg width="${size}" height="${h}" viewBox="0 0 124 82" fill="none" aria-hidden="true">
    <g fill="${color}">
      <rect x="0" y="0" width="124" height="8"/>
      <rect x="57.5" y="20.5" width="9" height="4"/>
      <path d="M4.5 83 A57.5 57.5 0 0 1 119.5 83 L111 83 A49 49 0 0 0 13 83 Z"/>
      <rect x="0" y="57" width="10" height="25"/>
      <rect x="114" y="57" width="10" height="25"/>
    </g>
  </svg>`;
}

/* ── illustraties (staan in voor echte foto's) ───────────────────── */
let sceneId = 0;
const SCENES = {
  event() {
    const id = "evg" + (++sceneId);
    const crowd = [30, 58, 86, 114, 142, 170, 198, 226, 254, 282].map((x, i) => `
      <circle cx="${x}" cy="${150 - (i % 3) * 4}" r="9" fill="${i % 2 ? "#C2683A" : "#5AB97F"}" opacity="0.9"/>
      <rect x="${x - 9}" y="${158 - (i % 3) * 4}" width="18" height="34" rx="7" fill="${i % 2 ? "#C2683A" : "#5AB97F"}" opacity="0.9"/>`).join("");
    const confetti = [[40, 28], [120, 20], [210, 30], [280, 22], [160, 16]].map(([x, y], i) =>
      `<rect x="${x}" y="${y}" width="5" height="5" rx="1" fill="#D8C9A0" opacity="0.8" transform="rotate(${i * 30} ${x} ${y})"/>`).join("");
    return `<svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block">
      <rect width="320" height="200" fill="#13352A"/>
      <rect width="320" height="200" fill="url(#${id})" opacity="0.5"/>
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B6B4F"/><stop offset="1" stop-color="#06281D"/></linearGradient></defs>
      <rect x="92" y="44" width="136" height="58" rx="6" fill="#13352A" stroke="#C2683A" stroke-width="2"/>
      <rect x="104" y="56" width="50" height="34" rx="3" fill="#C2683A" opacity="0.55"/>
      <circle cx="186" cy="66" r="9" fill="#5AB97F"/>
      <rect x="172" y="76" width="28" height="20" rx="3" fill="#5AB97F" opacity="0.7"/>
      ${crowd}${confetti}
    </svg>`;
  },
  field() {
    return `<svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block">
      <rect width="320" height="200" fill="#2B6B4F"/>
      <circle cx="250" cy="50" r="22" fill="#5AB97F" opacity="0.85"/>
      <path d="M0 110 Q80 70 160 100 T320 96 V200 H0Z" fill="#13352A"/>
      <path d="M0 130 Q90 100 180 124 T320 124 V200 H0Z" fill="#06281D"/>
      <path d="M0 150 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#C2683A" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M0 166 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#5AB97F" stroke-width="3" fill="none" opacity="0.5"/>
      <circle cx="96" cy="96" r="9" fill="#EDE6D4"/>
      <rect x="88" y="104" width="16" height="30" rx="6" fill="#EDE6D4"/>
      <rect x="112" y="78" width="3" height="60" fill="#D8C9A0"/>
    </svg>`;
  },
  talk() {
    return `<svg viewBox="0 0 320 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block">
      <rect width="320" height="200" fill="#D9EEDF"/>
      <rect x="40" y="150" width="240" height="14" rx="5" fill="#2B6B4F" opacity="0.25"/>
      <circle cx="110" cy="92" r="20" fill="#2B6B4F"/><rect x="84" y="116" width="52" height="44" rx="14" fill="#2B6B4F"/>
      <circle cx="210" cy="92" r="20" fill="#2B6B4F"/><rect x="184" y="116" width="52" height="44" rx="14" fill="#2B6B4F"/>
      <rect x="120" y="44" width="42" height="26" rx="8" fill="#C2683A"/><path d="M132 70 l8 10 l4 -10Z" fill="#C2683A"/>
      <rect x="166" y="56" width="36" height="22" rx="8" fill="#5AB97F"/><path d="M188 78 l-8 9 l-3 -9Z" fill="#5AB97F"/>
    </svg>`;
  },
  portrait(seed = 0) {
    const tones = [["#2B6B4F", "#EDE6D4"], ["#13352A", "#D8C9A0"], ["#2B6B4F", "#D9EEDF"], ["#3F7C6A", "#EDE6D4"]];
    const [bg, fg] = tones[seed % tones.length];
    return `<svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block">
      <rect width="200" height="200" fill="${bg}"/>
      <circle cx="100" cy="150" r="64" fill="${fg}" opacity="0.95"/>
      <circle cx="100" cy="84" r="40" fill="${fg}"/>
      <circle cx="100" cy="84" r="40" fill="#000" opacity="0.04"/>
    </svg>`;
  },
};

/* ── thema's, niveaus, logo's ────────────────────────────────────── */
const themeColor = (id) => (THEMES.find((t) => t.id === id) || {}).color || "#000";
/* De Engelse namen staan in THEMES in data.js, de Nederlandse in
   vertalingen.js onder thema.<id>. Zo hoeft data.js niet tweetalig te
   worden en blijft er één lijst met thema's. */
const themeLabel = (id) =>
  t(`thema.${id}`) || (THEMES.find((th) => th.id === id) || {}).label || id;

function pill(text, bg = "#000", color = "#fff", border) {
  const b = border ? `border:${border};` : "";
  return `<span class="pill" style="background:${bg};color:${color};${b}">${text}</span>`;
}
function themePill(theme) {
  const c = themeColor(theme);
  return `<span class="pill" style="background:#fff;color:${c};border:1px solid ${c}33">
    <span class="pill-dot" style="background:${c}"></span>${esc(themeLabel(theme))}</span>`;
}
function levelDots(level, color) {
  const dots = [1, 2, 3, 4].map((n) =>
    `<i style="${n <= level ? `background:${color}` : ""}"></i>`).join("");
  return `<span class="levels"><span class="levels-dots">${dots}</span>
    <span class="levels-label">${esc(LEVELS[level] || "")}</span></span>`;
}

function companyLogo(org, logoKey, size = 46) {
  const src = logoKey && LOGOS[logoKey];
  const h = Math.round(size * 0.7);
  const box = `width:${size}px;height:${h}px`;
  if (src) {
    return `<span class="logo-badge" style="${box};padding:${Math.round(size * 0.1)}px">
      <img src="${esc(src)}" alt="${esc(org)}"></span>`;
  }
  const initials = org.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean)
    .slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return `<span class="logo-badge is-initials" style="${box};font-size:${Math.round(size * 0.28)}px">${esc(initials)}</span>`;
}

/* Alleen de logo's die ergens gebruikt worden. De regels voor olie, gas,
   luchtvaart, de grote accountantskantoren en de webwinkels zijn eruit,
   samen met de plekken zelf; de bestanden staan nog wel in assets/logos/.
   Zet een logo hier pas terug als er ook echt een plek bij hoort. */
const LOGOS = {
  tno: "assets/logos/tno.png", arcadis: "assets/logos/arcadis.png", rws: "assets/logos/rws.png",
  prorail: "assets/logos/prorail.png", haskoning: "assets/logos/haskoning.png",
  heijmans: "assets/logos/heijmans.png", npo: "assets/logos/npo.png",
};
const UU_LOGO = "assets/logos/uu-logo.png";

/* ── datums ──────────────────────────────────────────────────────── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHNAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
/* Nederlandse maandnamen. De datums in data.js blijven staan zoals ze zijn
   (14-09-2026); alleen wat de bezoeker leest verandert mee met de taal. */
const MAANDEN_KORT = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december"];

const maandKort = (i) => (TAAL === "nl" ? MAANDEN_KORT : MONTHS)[i];
const maandVol  = (i) => (TAAL === "nl" ? MAANDEN : MONTHNAMES)[i];

function parseEventDate(d) {
  if (!d || /year-round/i.test(d)) {
    return { sortKey: 8.64e15 - 1, display: t("datum.jaarrond.kort"),
      monthLabel: t("datum.jaarrond"), yearRound: true };
  }
  const dm = d.match(/(\d{2})-(\d{2})-(\d{4})/);
  if (dm) {
    const [, dd, mm, yyyy] = dm;
    const dt = new Date(`${yyyy}-${mm}-${dd}`);
    const re = d.match(/to\s+(\d{2})-(\d{2})-(\d{4})/);
    let disp = `${parseInt(dd)} ${maandKort(parseInt(mm) - 1)} ${yyyy}`;
    if (re) disp = `${parseInt(dd)}–${parseInt(re[1])} ${maandKort(parseInt(re[2]) - 1)} ${yyyy}`;
    // endKey is de laatste dag: een driedaagse die vandaag nog loopt telt mee
    const end = re ? new Date(`${re[3]}-${re[2]}-${re[1]}`) : dt;
    return { sortKey: dt.getTime(), endKey: end.getTime(), display: disp,
      monthLabel: `${maandVol(parseInt(mm) - 1)} ${yyyy}` };
  }
  const my = d.match(/([A-Za-z]+)\s+(\d{4})/);
  if (my) {
    const mi = MONTHNAMES.findIndex((m) => m.toLowerCase() === my[1].toLowerCase());
    if (mi >= 0) {
      const dt = new Date(parseInt(my[2]), mi, 15);
      // staat er alleen een maand, dan loopt hij tot het eind van die maand
      const end = new Date(parseInt(my[2]), mi + 1, 0);
      return { sortKey: dt.getTime(), endKey: end.getTime(),
        display: `${maandVol(mi)} ${my[2]}`,
        monthLabel: `${maandVol(mi)} ${my[2]}`, fuzzy: true };
    }
  }
  return { sortKey: 8.64e15, display: veld(d), monthLabel: t("datum.tbc"), fuzzy: true, tbc: true };
}

/* ── alleen wat nog komt ─────────────────────────────────────────────
   De eventslijst wordt met de hand bijgehouden en groeit aan, maar er
   wordt zelden iets uit weggehaald. Zonder deze filter stond in augustus
   nog "6 Feb 2026" bovenaan de homepage. Een event is pas voorbij als de
   laatste dag geweest is; loopt het vandaag nog, dan hoort het er gewoon
   bij. "Year-round" en "datum nog onbekend" verlopen nooit.            */
function isUpcoming(p) {
  if (p.yearRound || p.tbc) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (p.endKey || p.sortKey) >= today.getTime();
}
/* Hangt parsed aan elk event en gooit eruit wat geweest is. */
const upcoming = (list) => list
  .map((e) => ({ ...e, parsed: parseEventDate(e.date) }))
  .filter((e) => isUpcoming(e.parsed));

function deadlineInfo(d) {
  if (!d || d === "Year-round") return { label: "Year-round", soon: false };
  const date = new Date(d);
  const days = Math.ceil((date - new Date()) / 86400000);
  return {
    label: `Apply by ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
    soon: days <= 30 && days >= 0,
  };
}

/* ── afgeleide lijsten ───────────────────────────────────────────── */
const PARTNER_INTERNSHIPS = [...INTERNSHIPS, ...WORKSTUDENT].filter((i) => i.kind === "partner");
const OTHER_INTERNSHIPS   = [...INTERNSHIPS, ...WORKSTUDENT].filter((i) => i.kind !== "partner");
// Staat INTERNSHIPS_LIVE uit, dan mogen de plekken ook niet in de zoekbalk
// opduiken. De lijsten hierboven blijven gewoon bestaan.
const ALL_ITEMS = INTERNSHIPS_LIVE
  ? [...PARTNER_INTERNSHIPS, ...THESIS, ...OTHER_INTERNSHIPS] : [];

/* De namen en de "hier komt straks"-zin staan niet meer hier maar in
   vertalingen.js, onder lijst.<sleutel> en lijst.soon.<sleutel>, zodat ze
   in allebei de talen bestaan. */
const LISTS = {
  partner: { sleutel: "partner", data: PARTNER_INTERNSHIPS, mode: "internship", accent: "#C2683A", page: "internships.html" },
  thesis:  { sleutel: "thesis",  data: THESIS,              mode: "thesis",     accent: "#2B6B4F", page: "thesis.html" },
  other:   { sleutel: "other",   data: OTHER_INTERNSHIPS,   mode: "internship", accent: "#7C8C4E", page: "other-internships.html" },
};
const listOf = (item) => THESIS.includes(item) ? "thesis"
  : PARTNER_INTERNSHIPS.includes(item) ? "partner" : "other";

/* ── bewaarde items (blijven staan via localStorage) ─────────────── */
const SAVED_KEY = "impact-connect:saved";
function loadSaved() {
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); }
  catch (e) { return new Set(); }
}
let saved = loadSaved();
function persistSaved() {
  try { localStorage.setItem(SAVED_KEY, JSON.stringify([...saved])); } catch (e) {}
}
function toggleSave(org) {
  if (saved.has(org)) { saved.delete(org); }
  else { saved.add(org); toast(`Saved “${org}”`); }
  persistSaved();
  paintSaved();
}
function paintSaved() {
  $$("[data-saved-count]").forEach((el) => { el.textContent = saved.size; });
  $$(".opp-save").forEach((btn) => {
    const on = saved.has(btn.dataset.org);
    const accent = btn.dataset.accent || "#C2683A";
    btn.innerHTML = icon("Bookmark", 17, { color: on ? accent : "#CCC", fill: on ? accent : "none" });
  });
  const pf = $("#panel-save");
  if (pf) {
    const on = saved.has(pf.dataset.org);
    const accent = pf.dataset.accent;
    pf.style.borderColor = on ? accent : "#DDD";
    pf.style.color = on ? accent : "#555";
    pf.innerHTML = icon("Bookmark", 16, { color: on ? accent : "currentColor", fill: on ? accent : "none" })
      + (on ? " Saved" : " Save");
  }
}

/* ── toasts ──────────────────────────────────────────────────────── */
function toast(msg) {
  let host = $(".toasts");
  if (!host) { host = document.createElement("div"); host.className = "toasts"; document.body.appendChild(host); }
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="tick">${icon("Check", 14, { color: "#fff" })}</span>${esc(msg)}`;
  host.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ── onthullen bij scrollen ──────────────────────────────────────── */
function initReveal(root = document) {
  const els = $$(".reveal:not(.shown)", root);
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("shown")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const d = parseInt(e.target.dataset.delay || "0", 10);
      setTimeout(() => e.target.classList.add("shown"), d);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  els.forEach((e) => io.observe(e));
}

/* ── leesvoortgang ───────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = $("#scroll-progress");
  if (!bar) return;
  const paint = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", paint, { passive: true });
  paint();

}

/* ═══════════════════════════════════════════════════════════════════
   ZIJPANEEL met alle details van één plek
   ═══════════════════════════════════════════════════════════════════ */
function conceptEmailFor(item, mode) {
  if (!item.contactEmail) return "";
  const org = mode === "thesis"
    ? `the thesis opportunity at ${item.org.split(" · ")[0]}`
    : `the ${item.org} opportunity`;
  return `Dear ${item.contactPerson || "Sir/Madam"},

My name is [your name], a ${mode === "thesis" ? "Master's student" : "student"} at Utrecht University. Through Impact Connect I came across ${org}, and I would love to learn more.

[One or two lines about yourself: your programme, your year, and why this opportunity fits your interests.]

Would you be open to a short call or a coffee to discuss the possibilities?

Kind regards,
[Your name]
[Phone number]`;
}

function openPanel(item, mode, accent) {
  closePanel();
  const dl = deadlineInfo(item.deadline);
  const isPartner = item.kind === "partner";
  const isThesis = mode === "thesis";
  const isProg = mode === "programme";
  const label = isThesis ? t("opp.thesis") : isProg ? t("opp.programma")
    : mode === "workstudent" ? t("opp.werkstudent") : t("opp.stage");
  const conceptEmail = conceptEmailFor(item, mode);
  const mailHref = item.contactEmail
    ? `mailto:${item.contactEmail}?subject=${encodeURIComponent(`Interest via Impact Connect, ${item.org}`)}&body=${encodeURIComponent(conceptEmail)}`
    : "";

  const pills = [
    isPartner ? pill("★ Partner", "#13352A") : "",
    isThesis ? (item.thesisType === "defined" ? pill(t("opp.uitgewerkt"), "#2B6B4F") : pill(t("opp.open"), "#7C8C4E")) : "",
    dl.soon ? pill(t("opp.deadline"), "#C00A35") : "",
  ].join("");

  let topic = "";
  if (isThesis && item.thesisType === "defined") {
    topic = `<div class="panel-note">
      <div class="kicker">${t("opp.voorstel")}</div>
      <p class="quote">“${esc(item.title)}”</p>
      <p><strong>${t("opp.vraag")}</strong> ${esc(item.question)}</p></div>`;
  } else if (isThesis && item.thesisType === "open") {
    topic = `<div class="panel-note">
      <div class="kicker">${t("opp.openthesis")}</div>
      <p>${t("opp.eigenvraag").replace("{veld}", `<strong>${esc(item.field)}</strong>`)}</p></div>`;
  }

  const facts = [
    ["MapPin", "Location", item.loc],
    ["Clock", isProg ? "Commitment" : "Time", isProg ? item.commit : item.hours],
    !isProg && ["Banknote", "Pay", item.paid ? (item.salary || "Paid") : "Unpaid"],
    isProg && ["Clock", "Duration", item.duration],
    ["Globe", "Language", item.lang === "NL" ? "Dutch" : "English / Intl"],
    ["Calendar", "Deadline", dl.label.replace("Apply by ", "")],
    !isProg && ["BarChart3", "Level", `${item.level} / 4`],
  ].filter(Boolean).map(([ic, k, v]) => `<div class="fact">
      <span style="color:${accent}">${icon(ic, 15)}</span>
      <span><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></span></div>`).join("");

  const alumni = (item.alumni && item.alumni.length) ? `<div class="alumni">
      <h4>${icon("UserCircle2", 15)} ${isProg ? t("opp.alumni.prog") : t("opp.alumni.rol")}</h4>
      ${item.alumni.map((a) => `<figure style="border-left-color:${accent}">
        <blockquote>"${esc(a.quote)}"</blockquote>
        <figcaption>${esc(a.name)}</figcaption></figure>`).join("")}
    </div>` : "";

  const partnerBlock = isPartner ? `
    <div class="partner-note">
      ${icon("UserCircle2", 22, { color: "#13352A", style: "margin-top:1px" })}
      <div><strong style="font-size:13.5px">${t("opp.partner")}</strong>
      <p>${t("opp.partner.tekst")}</p></div>
    </div>
    ${item.contactEmail ? `
    <div style="margin-top:18px">
      <h4 style="font-weight:800;letter-spacing:1px">${t("opp.contact").replace("{org}", esc(item.org.split(" · ")[0]))}</h4>
      <div class="contact-card">
        <span class="avatar" style="background:${accent}">${icon("UserCircle2", 21, { color: "#fff" })}</span>
        <div style="min-width:0">
          <div class="who">${esc(item.contactPerson)}</div>
          <a href="mailto:${esc(item.contactEmail)}">${icon("Mail", 13)} ${esc(item.contactEmail)}</a>
        </div>
      </div>
      <h4 style="font-weight:800;letter-spacing:1px;margin:20px 0 10px">${t("opp.conceptmail")}</h4>
      <div class="email-draft" id="email-draft">${esc(conceptEmail)}</div>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button class="btn-copy" id="copy-email">${icon("Copy", 15)} Copy email</button>
        <span style="font-size:12px;color:#999;align-self:center">${t("opp.haakjes")}</span>
      </div>
    </div>` : ""}` : "";

  const applyLabel = isThesis && item.thesisType === "open" ? t("opp.knop.eigen")
    : isProg ? t("opp.knop.prog") : t("opp.knop.site");
  const applyBtn = isPartner
    ? `<a class="btn-apply" style="background:#13352A" href="${esc(mailHref)}">${icon("Mail", 16)} Email ${esc(item.contactPerson ? item.contactPerson.split(" ")[0] : "the partner")}</a>`
    : `<a class="btn-apply" style="background:${accent}" href="${esc(item.apply || "#")}"${item.apply ? ' target="_blank" rel="noreferrer"' : ""}>${esc(applyLabel)} ${icon("ExternalLink", 16)}</a>`;

  const wrap = document.createElement("div");
  wrap.id = "panel-root";
  wrap.innerHTML = `
    <div class="overlay" data-close></div>
    <aside class="panel" role="dialog" aria-label="${esc(item.org)}">
      <div class="panel-head" style="background:${accent}">
        <span class="label">${bridgeMark(16, "#fff")} ${esc(label)}</span>
        <button class="icon-btn" data-close aria-label="Close">${icon("X", 17, { color: "#fff" })}</button>
      </div>
      <div class="panel-body">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${pills}</div>
        <div class="panel-org">${companyLogo(item.org, item.logo, 58)}<h2>${esc(item.org)}</h2></div>
        ${!isProg ? `<div style="margin-bottom:20px">${levelDots(item.level, accent)}</div>` : ""}
        ${topic}
        <div class="panel-facts">${facts}</div>
        <h4>${isProg ? t("opp.over.prog") : t("opp.over")}</h4>
        <p>${esc(item.desc)}</p>
        <h4>${isProg ? "Who it's for" : "What they're looking for"}</h4>
        <p style="margin-bottom:8px">${esc(item.looking)}</p>
        ${alumni}
        ${partnerBlock}
      </div>
      <div class="panel-foot">
        <button class="btn-save" id="panel-save" data-org="${esc(item.org)}" data-accent="${accent}"></button>
        ${applyBtn}
      </div>
    </aside>`;
  document.body.appendChild(wrap);
  document.body.style.overflow = "hidden";
  paintSaved();

  $$("[data-close]", wrap).forEach((el) => el.addEventListener("click", closePanel));
  $("#panel-save", wrap).addEventListener("click", () => toggleSave(item.org));
  const copy = $("#copy-email", wrap);
  if (copy) {
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(conceptEmail).then(() => {
        copy.innerHTML = icon("Copy", 15) + " Copied!";
        setTimeout(() => { copy.innerHTML = icon("Copy", 15) + " Copy email"; }, 2000);
      }).catch(() => {});
    });
  }
}

function closePanel() {
  const el = $("#panel-root");
  if (el) el.remove();
  document.body.style.overflow = "";
  if (location.hash.startsWith("#opp=")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   OVERZICHTSPAGINA'S (partner / thesis / overig)
   ═══════════════════════════════════════════════════════════════════ */
function oppCard(item, accent, mode) {
  const dl = deadlineInfo(item.deadline);
  const pills = [
    item.kind === "partner" ? pill("★ Partner", "#13352A") : "",
    mode === "thesis" ? (item.thesisType === "defined" ? pill(t("opp.uitgewerkt"), "#2B6B4F") : pill(t("opp.open"), "#7C8C4E")) : "",
    dl.soon ? pill(t("opp.deadline"), "#C00A35") : "",
  ].join("");

  let lead = "";
  if (mode === "thesis" && item.thesisType === "defined" && item.title) {
    lead = `<p class="opp-title">“${esc(item.title)}”</p>`;
  } else if (mode === "thesis" && item.thesisType === "open" && item.field) {
    lead = `<p class="opp-field"><strong>${t("opp.eigenonderwerp")}</strong> ${esc(item.field)}</p>`;
  }

  return `<article class="opp-card reveal" data-org="${esc(item.org)}" style="border-top-color:${accent}">
    <button class="opp-save" data-org="${esc(item.org)}" data-accent="${accent}" aria-label="Save"></button>
    <div class="opp-head">${companyLogo(item.org, item.logo, 88)}<h3>${esc(item.org)}</h3></div>
    <div class="opp-pills">${pills}</div>
    ${lead}
    <p class="opp-desc">${esc(item.desc.slice(0, 110))}…</p>
    ${mode !== "programme" ? `<div class="opp-levels">${levelDots(item.level, accent)}</div>` : ""}
    <div class="opp-meta">
      <span>${icon("MapPin", 12)} ${esc(item.loc)}</span>
      <span>${icon("Clock", 12)} ${esc(mode === "programme" ? item.commit : item.hours)}</span>
      ${mode !== "programme" ? `<span>${icon("Banknote", 12)} ${esc(item.paid ? (item.salary || "Paid") : "Unpaid")}</span>` : ""}
      <span class="${dl.soon ? "soon" : ""}">${icon("Calendar", 12)} ${esc(dl.label)}</span>
    </div>
  </article>`;
}

/* De internships mogen nog niet naar buiten (zie INTERNSHIPS_LIVE in
   data.js). De pagina blijft verder helemaal staan: de balk bovenaan werkt,
   je kunt tussen de drie tabbladen heen en weer, alleen komt er in plaats
   van de lijst een "Coming soon".

   De nadruk ligt daarbij niet op het wachten maar op het gesprek. Dat is
   ook eerlijker: Impact Connect is geen lijst om doorheen te scrollen, het
   matchen gebeurt aan tafel. Iemand die hier komt is niet voor niets
   langsgekomen en hoeft niet met lege handen weg. */
function paintComingSoon(cfg) {
  const grid = $("#listing-grid");
  if (!grid) return;

  // filters en tellers hebben zonder lijst geen betekenis, en "Coming soon"
  // hoeft niet twee keer op hetzelfde scherm te staan
  const filters = $(".filters");
  if (filters) filters.style.display = "none";
  const stats = $("#hero-stats");
  if (stats) stats.style.display = "none";

  grid.className = "";
  grid.innerHTML = `
    <div class="soon-state" style="border-color:${cfg.accent}">
      <span class="soon-badge" style="background:${cfg.accent}">${t("soon.badge")}</span>
      <h2>${t("soon.kop").replace("{lijst}", esc(t(`lijst.${cfg.sleutel}`)))}</h2>
      <p>${t("soon.reden").replace("{wat}", esc(t(`lijst.soon.${cfg.sleutel}`)))}</p>
      <p class="soon-talk">${t("soon.gesprek")}</p>
      <button class="btn-mag primary" data-open-form>
        ${bridgeMark(22, "currentColor")} ${t("nav.appointment")}</button>
      <p class="soon-alt">${t("soon.rest")}</p>
    </div>`;
  $("[data-open-form]", grid)?.addEventListener("click", openForm);
}

function initListing(key) {
  const cfg = LISTS[key];
  if (!cfg) return;
  if (!INTERNSHIPS_LIVE) { paintComingSoon(cfg); return; }
  const { data, mode, accent } = cfg;
  const grid = $("#listing-grid");
  const state = { query: "", paidOnly: false };

  // tellers in de paginakop
  const stats = $("#hero-stats");
  if (stats) {
    const paid = data.filter((d) => d.paid).length;
    const partners = data.filter((d) => d.kind === "partner").length;
    stats.innerHTML = [
      `${data.length} open`,
      mode !== "programme" && paid ? `${paid} paid` : null,
      partners ? `${partners} partner roles` : null,
    ].filter(Boolean).map((t) => `<span>${t}</span>`).join("");
  }

  function render() {
    const q = state.query.toLowerCase();
    const list = data.filter((it) =>
      (!state.paidOnly || it.paid) &&
      (q === "" || it.org.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)));

    if (!list.length) {
      grid.className = "";
      grid.innerHTML = `<div class="empty-state"><p>${t("lijst.leeg")}</p></div>`;
      return;
    }
    grid.className = "listing-grid";
    grid.innerHTML = list.map((it, i) => oppCard(it, accent, mode)
      .replace('class="opp-card reveal"', `class="opp-card reveal" data-delay="${Math.min(i, 6) * 70}"`)).join("");
    paintSaved();
    initReveal(grid);
  }

  grid.addEventListener("click", (e) => {
    const save = e.target.closest(".opp-save");
    if (save) { e.stopPropagation(); toggleSave(save.dataset.org); return; }
    const card = e.target.closest(".opp-card");
    if (!card) return;
    const item = data.find((d) => d.org === card.dataset.org);
    if (item) openPanel(item, mode, accent);
  });

  const search = $("#listing-search");
  if (search) search.addEventListener("input", (e) => { state.query = e.target.value; render(); });

  const paid = $("#filter-paid");
  if (paid) {
    paid.addEventListener("click", () => {
      state.paidOnly = !state.paidOnly;
      paid.classList.toggle("on", state.paidOnly);
      render();
    });
  }

  render();

  // diepe link: internships.html#opp=Naam
  const m = decodeURIComponent(location.hash).match(/^#opp=(.+)$/);
  if (m) {
    const item = data.find((d) => d.org === m[1]);
    if (item) openPanel(item, mode, accent);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   EVENTS
   ═══════════════════════════════════════════════════════════════════ */
/* De Nederlandse omschrijving van een event staat in data.js naast de
   Engelse, als descNl. Is die er niet, dan blijft het Engels staan; beter
   een Engelse zin dan een leeg kaartje. */
const evTekst = (ev) => (TAAL === "nl" && ev.descNl) ? ev.descNl : ev.desc;

function eventCard(ev, isNext) {
  const hasLink = ev.link && ev.link.startsWith("http");
  return `<div class="ev-card" style="border-left-color:${themeColor(ev.cat)}">
    <div class="ev-body">
      <div class="ev-tags">${themePill(ev.cat)}${isNext
        ? `<span class="ev-next">${icon("Zap", 12)} ${t("ev.nextup")}</span>` : ""}</div>
      <h4>${esc(ev.name)}</h4>
      ${evTekst(ev) ? `<p>${esc(evTekst(ev))}</p>` : ""}
      <div class="ev-meta">
        <span>${icon("MapPin", 13)} ${esc(veld(ev.loc))}</span>
        ${ev.time && ev.time !== "tbc" ? `<span>${icon("Clock", 13)} ${esc(veld(ev.time))}</span>` : ""}
        <span>${icon("Ticket", 13)} ${esc(veld(ev.cost))}</span>
      </div>
    </div>
    ${hasLink
      ? `<a class="ev-signup" href="${esc(ev.link)}" target="_blank" rel="noreferrer">${t("ev.aanmelden")} ${icon("ExternalLink", 14)}</a>`
      : `<span class="ev-nolink">${t("ev.geenlink")}</span>`}
  </div>`;
}

/* ── De events uit de Google Sheet halen ─────────────────────────────
   Zelfde aanpak als bij de programma's: één gepubliceerd tabblad als
   CSV. Het adres staat in EVENT_SHEET bovenin data.js. Mislukt het,
   dan blijft de lijst in data.js staan.
------------------------------------------------------------------- */
const EVENT_COLS = {
  name: ["event", "event name", "name"],
  desc: ["short description", "description"],
  date: ["date"],
  time: ["time"],
  loc:  ["location"],
  cost: ["cost", "costs"],
  link: ["registration link", "link", "url"],
  cat:  ["category", "theme"],
};

// De sheet schrijft categorieën voluit; de site gebruikt korte namen.
const EVENT_CAT_MAP = {
  "general": "general",
  "energy": "energy",
  "ecology and food": "ecology", "ecology": "ecology", "food": "ecology",
  "cities": "cities",
  "governance": "governance",
  "business and innovation": "business", "business": "business",
};

function rowsToEvents(rows) {
  const headIdx = rows.findIndex((r) => r.some((c) => /^\s*event\s*$/i.test(c || "")));
  if (headIdx < 0) return [];
  const head = rows[headIdx].map((h) => (h || "").trim().toLowerCase());
  const col = {};
  for (const key in EVENT_COLS) col[key] = head.findIndex((h) => EVENT_COLS[key].includes(h));
  if (col.name < 0) return [];

  const out = [];
  for (let i = headIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = cellOrNull(r[col.name]);
    if (!name || /^event$/i.test(name)) continue;          // leeg of herhaalde kopregel
    const get = (k) => (col[k] >= 0 ? cellOrNull(r[col[k]]) : null);
        // De sheet schrijft soms twee thema's in één cel ("Energy, Governance",
      // "Ecology / zero waste"). Zonder dit belandden die allemaal onder
      // "General". We nemen het eerste thema; dat is in de sheet steeds het
      // hoofdthema, en het werkt ook voor combinaties die er later bij komen.
      const ruw = (get("cat") || "").trim().toLowerCase();
      const cat = EVENT_CAT_MAP[ruw] ? ruw : ruw.split(/[\/,]/)[0].trim();
    out.push({
      name,
      desc: get("desc") || "",
      date: get("date") || "",
      time: get("time") || "",
      loc:  get("loc")  || "",
      cost: get("cost") || "",
      link: get("link") || "",
      cat: EVENT_CAT_MAP[cat] || "general",
    });
  }
  return out;
}

async function loadEventSheet() {
  const url = (typeof EVENT_SHEET === "string" ? EVENT_SHEET : "").trim();
  if (!url) return null;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status + " " + res.statusText);
    const list = rowsToEvents(parseCSV(await res.text()));
    if (!list.length) throw new Error("geen bruikbare rijen");
    return list;
  } catch (err) {
    console.warn("[Impact Connect] events konden niet geladen worden:", err.message);
    return null;
  }
}

async function initEvents() {
  let events = EVENTS;

  // Welke vakgebieden aan staan. Leeg betekent alles; er is dus geen verschil
  // tussen "niets gekozen" en "alles gekozen", wat scheelt in het uitleggen.
  const gekozen = new Set();

  draw();

  const live = await loadEventSheet();
  if (live && live.length) { events = live; draw(); }

function draw() {
  // Alleen wat nog komt. De lijst groeit aan en er wordt zelden iets uit
  // weggehaald, dus zonder dit stonden de afgelopen events er ook nog.
  const enriched = upcoming(events);

  const perThema = new Map();
  enriched.forEach((e) => perThema.set(e.cat, (perThema.get(e.cat) || 0) + 1));
  // Een thema waar niets meer in zit verdwijnt uit de rij; blijft hij dan
  // aangevinkt, dan kijk je naar een lege pagina zonder knop om het uit te
  // zetten. Dus meteen loslaten.
  [...gekozen].forEach((id) => { if (!perThema.has(id)) gekozen.delete(id); });

  paintPicker(perThema, enriched.length);
  paintJoin();

  const zichtbaar = gekozen.size ? enriched.filter((e) => gekozen.has(e.cat)) : enriched;
  paintCount(zichtbaar, enriched.length);
  paintTimeline(zichtbaar);
}   // einde draw()

/* De rij vakgebieden. Het aantal achter elke naam is het hele punt: je ziet
   in één blik dat er voor jouw richting iets is, nog voordat je scrolt. */
function paintPicker(perThema, totaal) {
  const host = $("#ev-picker");
  if (!host) return;

  const knop = (id, label, aantal, kleur) => {
    const aan = id === "all" ? !gekozen.size : gekozen.has(id);
    return `<button class="ev-pick${aan ? " on" : ""}" data-theme="${esc(id)}"
      style="--pick:${kleur}" aria-pressed="${aan}">${esc(label)} <b>${aantal}</b></button>`;
  };

  // Vaste volgorde uit THEMES, zodat de rij niet verspringt als er een event
  // bijkomt. Een thema zonder events laten we weg: een knop met een 0 erop
  // is een belofte die je niet waarmaakt.
  // Let op: de lusvariabele heet bewust niet t — dat is de vertaalfunctie,
  // en die hebben we hier een regel hoger nog nodig.
  host.innerHTML = knop("all", t("ev.alle"), totaal, "#13352A")
    + THEMES.filter((th) => th.id !== "all" && perThema.has(th.id))
      .map((th) => knop(th.id, themeLabel(th.id), perThema.get(th.id), th.color)).join("");

  $$(".ev-pick", host).forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.theme;
    if (id === "all") gekozen.clear();
    else if (gekozen.has(id)) gekozen.delete(id);
    else gekozen.add(id);
    draw();
  }));
}

function paintCount(zichtbaar, totaal) {
  const el = $("#ev-count");
  if (!el) return;
  const gratis = zichtbaar.filter((e) => /free/i.test(e.cost || "")).length;
  el.textContent = gekozen.size
    ? t("ev.telling.filter")
        .replace("{n}", zichtbaar.length).replace("{totaal}", totaal)
        .replace("{themas}", [...gekozen].map(themeLabel).join(", "))
        .replace("{gratis}", gratis)
    : t("ev.telling.alles").replace("{totaal}", totaal).replace("{gratis}", gratis);
}

/* De knop bovenaan volgt het filter. Eén thema gekozen en die groep
   bestaat? Dan wijst de knop daarheen, met de naam van het thema erin.
   Anders de algemene groep. Is er helemaal geen link, dan wordt het geen
   knop maar een regel tekst: beter dan iets dat niets doet als je erop
   drukt. Zie WHATSAPP_GROEPEN in data.js. */
function paintJoin() {
  const el = $(".wa-join");
  if (!el) return;
  const groepen = (typeof WHATSAPP_GROEPEN === "object" && WHATSAPP_GROEPEN) || {};
  const enkel = gekozen.size === 1 ? [...gekozen][0] : null;
  const link = (enkel && groepen[enkel]) || groepen.all || "";
  const pijl = `<span data-icon="ArrowUpRight" data-size="18"></span>`;

  // De QR ernaast wijst dezelfde kant op als de knop.
  const qr = $(".wa-qr-img");
  if (qr) {
    const sleutel = (enkel && groepen[enkel]) ? enkel : "all";
    qr.src = `assets/qr/${sleutel}.svg`;
    qr.alt = link ? t("ev.scan") : "";
    qr.closest(".wa-hero-qr").style.display = link ? "" : "none";
  }

  if (!link) {
    el.removeAttribute("href");
    el.classList.add("wa-join-uit");
    el.innerHTML = `<span>${t("ev.linkvolgt")}</span>`;
  } else {
    el.href = link;
    el.target = "_blank";
    el.rel = "noreferrer";
    el.classList.remove("wa-join-uit");
    const label = (enkel && groepen[enkel])
      ? t("ev.join.thema").replace("{thema}", themeLabel(enkel))
      : t("ev.join");
    el.innerHTML = `<span>${label}</span> ${pijl}`;
  }
  $$("[data-icon]", el).forEach((i) => {
    i.innerHTML = icon(i.dataset.icon, +i.dataset.size || 16);
  });
}

function paintTimeline(lijst) {
  const host = $("#ev-timeline");
  if (!host) return;
  if (!lijst.length) {
    host.innerHTML = `<p class="ev-empty">${t("ev.leeg")}</p>`;
    return;
  }

  const sorted = [...lijst].sort((a, b) => a.parsed.sortKey - b.parsed.sortKey);
  // Het eerste event met een echte datum krijgt een labeltje. Dat beweegt dus
  // mee met het filter: kies je Energy, dan is dat het eerstvolgende energie-
  // event. Een "dates tbc" of een jaarrond-item slaan we over, daar kun je
  // niets mee plannen.
  const eerste = sorted.find((e) => !e.parsed.tbc && !e.parsed.yearRound);

  const groups = new Map();
  sorted.forEach((e) => {
    if (!groups.has(e.parsed.monthLabel)) groups.set(e.parsed.monthLabel, []);
    groups.get(e.parsed.monthLabel).push(e);
  });

  host.innerHTML = [...groups.entries()].map(([month, evs]) => {
    const kind = evs[0].parsed.tbc ? "tbc" : evs[0].parsed.yearRound ? "year" : "";
    return `<div class="ev-month ${kind}">
      <div class="spine"></div><div class="knob"></div>
      <h3>${esc(month)}</h3>
      <div class="ev-list">${evs.map((ev) =>
        `<div><div class="ev-date">${esc(ev.parsed.display)}</div>${eventCard(ev, ev === eerste)}</div>`).join("")}</div>
    </div>`;
  }).join("");
}
}   // einde initEvents()

/* ═══════════════════════════════════════════════════════════════════
   PROGRAMMES
   ═══════════════════════════════════════════════════════════════════ */

/* ── De Google Sheet uitlezen ────────────────────────────────────────
   De adressen staan in PROGRAMME_SHEETS bovenin data.js. Elk adres is
   één gepubliceerd tabblad in CSV-vorm. Gaat er iets mis, dan blijft
   PROGRAMMES_DATA staan; de bezoeker ziet dan de laatst meegeleverde
   lijst in plaats van een lege pagina.
------------------------------------------------------------------- */

// CSV-lezer die omgaat met aanhalingstekens, en met komma's en
// regeleindes bínnen een veld. De omschrijvingen in de sheet zitten
// vol komma's, dus tekst simpelweg op komma's splitsen gaat mis.
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  text = String(text).replace(/\r\n?/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') { field += c; continue; }
      if (text[i + 1] === '"') { field += '"'; i++; continue; }
      quoted = false;
    } else if (c === '"') { quoted = true; }
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Kolomkoppen uit de sheet → velden op de site. Meerdere schrijfwijzen
// toegestaan, zodat een kleine wijziging in de sheet niets breekt.
const PROG_COLS = {
  name:     ["programme name", "program name", "name"],
  desc:     ["description"],
  signup:   ["sign up date", "signup date", "sign-up date"],
  duration: ["duration"],
  lang:     ["language"],
  level:    ["experience level", "level"],
  url:      ["url", "link"],
  loc:      ["location"],
  cost:     ["costs", "cost"],
  host:     ["host university/institution", "host", "institution"],
  partner:  ["partner"],                         // "yes" = organisatie waar we mee samenwerken
  zin:      ["one-liner", "oneliner", "one liner"],   // de korte zin in het venster
  logo:     ["logo", "logo url", "image"],       // optionele kolom in de sheet
};

// Naam → logobestand. De sleutels in PROGRAMME_LOGOS mogen slordig zijn;
// hoofdletters, spaties en leestekens worden genegeerd bij het opzoeken.
const progKey = (n) => (n || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const PROGRAMME_LOGO_INDEX = (() => {
  const out = {};
  const src = (typeof PROGRAMME_LOGOS === "object" && PROGRAMME_LOGOS) || {};
  for (const k in src) out[progKey(k)] = src[k];
  return out;
})();
// Instelling → logobestand, voor programma's zonder eigen logo.
const INSTELLING_INDEX = ((typeof INSTELLING_LOGOS !== "undefined" && INSTELLING_LOGOS) || [])
  .map(([naam, bestand]) => [progKey(naam), bestand]);
function instellingLogo(host) {
  const k = progKey(host);
  if (!k) return null;
  const hit = INSTELLING_INDEX.find(([naam]) => k.includes(naam));
  return hit ? hit[1] : null;
}
function programmeLogo(p) {
  if (p.logo) return p.logo;                     // kolom "Logo" uit de sheet gaat voor
  return PROGRAMME_LOGO_INDEX[progKey(p.name)] || instellingLogo(p.host);
}

// Witte logo's krijgen een donker vlak, anders vallen ze weg op het kaartje.
const PROG_DARK_SET = new Set(
  ((typeof PROGRAMME_LOGOS_ON_DARK !== "undefined" && PROGRAMME_LOGOS_ON_DARK) || []).map(progKey)
);
const logoOnDark = (p) => PROG_DARK_SET.has(progKey(p.name));

function cellOrNull(v) {
  const s = (v == null ? "" : String(v)).trim();
  if (!s) return null;
  if (/^not specified/i.test(s)) return null;      // "Not specified in database"
  return s;
}

// "Not paid" → false, "Paid" → true, "tuition fee" → onbekend.
// Let op: bij "tuition fee" betaalt de student juist zélf.
function derivePaid(cost) {
  const c = (cost || "").toLowerCase();
  if (!c) return null;
  if (c.includes("not paid")) return false;
  if (/\bpaid\b/.test(c)) return true;
  return null;
}

/* Een partner is een organisatie waarmee we echt samenwerken: wij kunnen een
   student daar rechtstreeks voorstellen. Dat zet je aan in de kolom "Partner"
   van de programmasheet; "yes", "ja", "x" of "true" tellen allemaal mee. Het
   kaartje krijgt dan een label en komt bovenaan in zijn categorie. */
const isPartner = (waarde) => /^(yes|ja|y|x|true|waar)$/i.test((waarde || "").trim());

// Partners eerst, de rest in de volgorde van de sheet.
const partnersBovenaan = (lijst) =>
  [...lijst].sort((a, b) => (b.partner === true) - (a.partner === true));

function rowsToProgrammes(rows, cat) {
  const headIdx = rows.findIndex((r) => r.some((c) => /programme name/i.test(c || "")));
  if (headIdx < 0) return [];
  const head = rows[headIdx].map((h) => (h || "").trim().toLowerCase());
  const col = {};
  for (const key in PROG_COLS) col[key] = head.findIndex((h) => PROG_COLS[key].includes(h));
  // De partnerkolom heet in de sheet "Partner (yes/no)". Alles wat met
  // "partner" begint telt, zodat een toevoeging achter de naam niets breekt.
  if (col.partner < 0) col.partner = head.findIndex((h) => h.startsWith("partner"));
  if (col.name < 0) return [];

  const out = [];
  for (let i = headIdx + 1; i < rows.length; i++) {
    const r = rows[i];
    const name = cellOrNull(r[col.name]);
    if (!name || /^programme name$/i.test(name)) continue;   // leeg of herhaalde kopregel
    const get = (k) => (col[k] >= 0 ? cellOrNull(r[col[k]]) : null);
    const cost = get("cost");
    out.push({
      cat, name,
      desc: get("desc") || "",
      url: get("url"), lang: get("lang"), level: get("level"),
      duration: get("duration"), signup: get("signup"), loc: get("loc"),
      logo: get("logo"), host: get("host"), paid: derivePaid(cost), cost,
      partner: isPartner(get("partner")), zin: get("zin"),
    });
  }
  return out;
}

async function loadProgrammeSheets() {
  if (typeof PROGRAMME_SHEETS !== "object" || !PROGRAMME_SHEETS) return null;
  const entries = Object.keys(PROGRAMME_SHEETS)
    .map((cat) => [cat, (PROGRAMME_SHEETS[cat] || "").trim()])
    .filter(([, url]) => url.length > 0);
  if (!entries.length) return null;                          // niets ingesteld

  const fetched = await Promise.all(entries.map(async ([cat, url]) => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      const list = rowsToProgrammes(parseCSV(await res.text()), cat);
      if (!list.length) throw new Error("geen bruikbare rijen");
      return list;
    } catch (err) {
      console.warn(`[Impact Connect] tabblad "${cat}" kon niet geladen worden:`, err.message);
      return null;
    }
  }));

  const liveCats = new Set(entries.filter((_, i) => fetched[i]).map(([cat]) => cat));
  if (!liveCats.size) return null;                           // alles mislukt → terugval

  const live = fetched.filter(Boolean).reduce((a, b) => a.concat(b), []);
  // Categorieën zonder werkend tabblad blijven uit data.js komen.
  const rest = knownCats(PROGRAMMES_DATA).filter((p) => !liveCats.has(p.cat));
  return live.concat(rest);
}

// Programma's met een categorie die niet in PROGRAMME_CATS staat, negeren.
// Anders tellen oude categorieën wel mee in het totaal maar is er geen
// knop om ze te zien.
function knownCats(list) {
  const ids = new Set(PROGRAMME_CATS.map((c) => c.id));
  return list.filter((p) => ids.has(p.cat));
}

async function initProgrammes() {
  // ?cat=… uit het uitklapmenu bovenaan, anders de eerste categorie
  const gevraagd = new URLSearchParams(location.search).get("cat");
  let cat = PROGRAMME_CATS.some((c) => c.id === gevraagd) ? gevraagd : PROGRAMME_CATS[0].id;
  let programmes = knownCats(PROGRAMMES_DATA);      // wordt vervangen zodra de sheet binnen is
  const catHost = $("#prog-cats");
  const grid = $("#tease-grid");

  function paintCats() {
    const counts = Object.fromEntries(PROGRAMME_CATS.map((c) =>
      [c.id, programmes.filter((p) => p.cat === c.id).length]));
    const total = $("#prog-total");
    if (total) total.textContent = programmes.length;
    catHost.innerHTML = PROGRAMME_CATS.map((c) =>
      `<button class="prog-cat${c.id === cat ? " on" : ""}" data-cat="${c.id}">${esc(t(`progcat.${c.id}`) || c.label)} <b>${counts[c.id]}</b></button>`).join("");
  }

  function render() {
    const list = partnersBovenaan(programmes.filter((p) => p.cat === cat));
    grid.innerHTML = list.map((p, i) => {
      // Of iets betaald is zegt de categorie al; onder de naam staat de taal.
      const hint = p.lang || null;
      const mono = (p.name || "?").replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
      return `<div class="tease-card reveal" data-delay="${Math.min(i, 8) * 50}" data-name="${esc(p.name)}">
        ${/* Of iets betaald is zegt de categorie al; een partner is wel
              iets om te zien, want daar kunnen wij je voorstellen. */""}
        ${p.partner ? `<span class="partner-tag">${t("prog.partner")}</span>` : ""}
        <div class="mono-wrap">${programmeLogo(p)
          ? `<div class="prog-logo${logoOnDark(p) ? " on-dark" : ""}"><img src="${esc(programmeLogo(p))}" alt="" loading="lazy"></div>`
          : `<div class="mono">${esc(mono)}</div>`}</div>
        <div class="tc-body"><div class="tc-name">${esc(p.name)}</div>
        ${hint ? `<div class="tc-hint">${esc(hint)}</div>` : ""}</div>
        <div class="tc-foot">${t("prog.kaart.voet")} ${icon("ArrowUpRight", 14)}</div>
      </div>`;
    }).join("");
    initReveal(grid);
  }

  catHost.addEventListener("click", (e) => {
    const btn = e.target.closest(".prog-cat");
    if (!btn) return;
    cat = btn.dataset.cat;
    $$(".prog-cat", catHost).forEach((b) => b.classList.toggle("on", b.dataset.cat === cat));
    render();
  });

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".tease-card");
    if (!card) return;
    const p = programmes.find((x) => x.name === card.dataset.name);
    if (p) openProgrammePopup(p);
  });

  paintCats();
  render();

  // Live versie uit de Google Sheet. Lukt dat niet, dan blijft
  // PROGRAMMES_DATA staan en merkt de bezoeker er niets van.
  const live = await loadProgrammeSheets();
  if (live && live.length) {
    programmes = live;
    paintCats();
    render();
  }
}

function openProgrammePopup(p) {
  const apptSubject = encodeURIComponent(`${t("prog.mail.afspraak")}, ${p.name}`);
  const apptBody = encodeURIComponent(t("prog.mail.afspraak.tekst").replace("{naam}", p.name));

  const wrap = document.createElement("div");
  wrap.id = "prog-pop-root";
  wrap.innerHTML = `
    <div class="prog-pop-overlay" data-close></div>
    <div class="prog-pop" role="dialog" aria-label="${esc(p.name)}">
      <div class="head">
        <div class="ghost">${icon("Rocket", 120, { strokeWidth: 1.1 })}</div>
        <button class="icon-btn" data-close aria-label="${t("sluiten")}">${icon("X", 16, { color: "#fff" })}</button>
        <div class="kicker">${t("prog.pop.kicker")}</div>
        <div class="name">${esc(p.name)}</div>
      </div>
      <div class="body">
        ${p.partner ? `<p class="partner-regel">${bridgeMark(18, "currentColor")} ${esc(t("prog.pop.partner").replace("{naam}", p.name))}</p>` : ""}
        ${/* De korte zin uit de sheet. Staat er geen, dan blijft alleen de
              uitnodiging voor een gesprek over, zoals het altijd was. */""}
        ${p.zin ? `<p class="prog-zin">${esc(p.zin)}</p>` : ""}
        <p class="prog-uitnodiging">${t("prog.pop.tekst")}</p>
        <div class="actions">
          <a class="primary" href="mailto:${CONTACT_MAIL}?subject=${apptSubject}&body=${apptBody}">${bridgeMark(22, "currentColor")} ${t("nav.appointment")}</a>
        </div>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  $$("[data-close]", wrap).forEach((el) => el.addEventListener("click", () => wrap.remove()));
  const esckey = (e) => { if (e.key === "Escape") { wrap.remove(); window.removeEventListener("keydown", esckey); } };
  window.addEventListener("keydown", esckey);
}

/* ═══════════════════════════════════════════════════════════════════
   PARTNERMUUR (home)
   ═══════════════════════════════════════════════════════════════════ */
function initWall() {
  const catHost = $("#wall-cats");
  const grid = $("#wall-grid");
  if (!catHost || !grid) return;
  let cat = "all";

  catHost.innerHTML = WALL_CATS.map((c) =>
    `<button class="wall-cat${c.id === cat ? " on" : ""}" data-cat="${c.id}">${esc(c.label)}</button>`).join("");
  $("#wall-count") && ($("#wall-count").textContent = WALL.length);

  grid.innerHTML = WALL.map((p) => `<div class="wall-tile${p.big ? " big" : ""}" data-cat="${p.cat}">
      ${companyLogo(p.name, p.logo, p.big ? 92 : 70)}
      <div class="tile-name">${esc(p.name)}</div>
      <div class="tile-back"><div class="n">${esc(p.name)}</div><div class="o">${esc(p.offer)}</div></div>
    </div>`).join("");

  catHost.addEventListener("click", (e) => {
    const btn = e.target.closest(".wall-cat");
    if (!btn) return;
    cat = btn.dataset.cat;
    $$(".wall-cat", catHost).forEach((b) => b.classList.toggle("on", b.dataset.cat === cat));
    $$(".wall-tile", grid).forEach((t) => {
      const on = cat !== "all" && t.dataset.cat === cat;
      t.classList.toggle("lit", on);
      t.classList.toggle("dim", cat !== "all" && !on);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   HOME: logoband, categorieën, eerstvolgende events
   ═══════════════════════════════════════════════════════════════════ */
async function initHome() {
  const band = $("#logo-band-track");

  // De logoband toont de programma's die er echt zijn, niet een rij
  // voorbeeldbedrijven. Alles met een logo gaat erin. De band loopt door,
  // altijd even snel ongeacht de lengte; alleen de kleur licht op als je
  // er met de muis overheen gaat.
  function paintBand(list) {
    if (!band) return;
    const met = partnersBovenaan(list.filter((p) => programmeLogo(p)));
    if (!met.length) return;
    // Geen loading="lazy" hier. De browser bepaalt dat aan de hand van waar
    // een plaatje in de layout staat, en de band schuift met transform: een
    // logo dat rechts buiten beeld "staat" komt straks gewoon voorbij en zou
    // dan nog leeg zijn. Alles meteen laden dus.
    const row = met.map((p) =>
      `<span class="logo-item${logoOnDark(p) ? " on-dark" : ""}" title="${esc(p.name)}">
        <img src="${esc(programmeLogo(p))}" alt="${esc(p.name)}"></span>`).join("");
    band.innerHTML = row + row;                       // twee keer, voor de naadloze lus

    // De snelheid staat vast, niet de rondetijd: zo loopt de band even snel of
    // er nu tien of vijftig logo's in staan. Was 55 px/s, dat was te gehaast
    // om een logo rustig te kunnen bekijken.
    const PIXELS_PER_SECONDE = 27.5;
    const zetSnelheid = () => {
      const halve = band.scrollWidth / 2;
      if (halve > 0) band.style.animationDuration = `${Math.round(halve / PIXELS_PER_SECONDE)}s`;
    };

    // Meten kan pas als de plaatjes er zijn: een logo dat nog niet geladen is
    // heeft geen breedte, en dan komt de band te smal uit en loopt hij sneller
    // dan bedoeld. Dus meteen een eerste schatting, en daarna nog een keer als
    // de laatste binnen is. Dat gebeurt in de eerste seconden, en zo vroeg in
    // een ronde van een paar minuten is de correctie niet te zien.
    requestAnimationFrame(zetSnelheid);
    let opnieuw;
    const start = Date.now();
    band.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      const klaar = () => {
        // Na tien seconden niet meer bijstellen. Zo laat in de ronde zou het
        // verspringen wel opvallen, en dan is een paar procent te snel lopen
        // het minste kwaad.
        if (Date.now() - start > 10000) return;
        clearTimeout(opnieuw);
        opnieuw = setTimeout(zetSnelheid, 150);
      };
      img.addEventListener("load", klaar, { once: true });
      img.addEventListener("error", klaar, { once: true });
    });
  }

  // Begin met de lijsten uit data.js, en werk bij zodra de sheets binnen
  // zijn. Zo staat er meteen iets en klopt het even later precies.
  let programmes = knownCats(PROGRAMMES_DATA);
  let events = EVENTS;
  // Het aantal alumni komt uit hetzelfde loket als de lijst op alumni.html.
  // Blijft null zolang dat niet gelukt is, en dan blijft er "Get matched"
  // staan; een kaartje belooft dus nooit een aantal dat er niet is.
  let alumniAantal = null;

  function paint() {
    // Wat geweest is telt niet mee, niet in de teller en niet in de kaartjes.
    const open = upcoming(events);

    // tellers op de drie ingangen (zelfde volgorde als de balk bovenaan)
    const counts = {
      programmes:  `${programmes.length} ${t("teller.programmas")}`,
      events:      `${open.length} events`,
      alumni:      alumniAantal ? `${alumniAantal} ${t("teller.alumninamen")}` : t("teller.alumni"),
      // zolang de internships nog niet naar buiten mogen geen aantal beloven
      internships: INTERNSHIPS_LIVE
        ? `${PARTNER_INTERNSHIPS.length + THESIS.length + OTHER_INTERNSHIPS.length} ${t("teller.open")}`
        : t("soon.badge"),
    };
    $$("[data-cat-count]").forEach((el) => { el.textContent = counts[el.dataset.catCount] || ""; });
    $$("[data-events-count]").forEach((el) => { el.textContent = open.length; });

    // De eerstvolgende drie met een echte datum. Zijn die er niet meer, dan
    // vullen we aan met year-round en nog-te-bevestigen, zodat er altijd
    // iets staat in plaats van een leeg gat.
    const teaser = $("#events-teaser");
    if (!teaser) return;
    const dated = open.filter((e) => !e.parsed.tbc && !e.parsed.yearRound)
      .sort((a, b) => a.parsed.sortKey - b.parsed.sortKey);
    const rest = open.filter((e) => e.parsed.tbc || e.parsed.yearRound);
    const next = [...dated, ...rest].slice(0, 3);
    teaser.innerHTML = next.map((ev, i) => {
      const href = ev.link && ev.link.startsWith("http") ? ev.link : "events.html";
      return `<a class="teaser-card reveal" data-delay="${i * 120}" href="${esc(href)}" target="_blank" rel="noreferrer">
        <div class="date">${esc(ev.parsed.display)}</div>
        <div class="name">${esc(ev.name)}</div>
        <p>${esc((evTekst(ev) || "").slice(0, 90))}…</p>
        <div class="teaser-meta"><span>${icon("MapPin", 13)} ${esc(veld(ev.loc))}</span>
        <span>${icon("Ticket", 13)} ${esc(veld(ev.cost))}</span></div></a>`;
    }).join("");
    initReveal(teaser);
  }

  // scene-illustraties in de categoriepanelen
  $$("[data-scene]").forEach((el) => { el.innerHTML = SCENES[el.dataset.scene] ? SCENES[el.dataset.scene]() : ""; });
  $$("[data-portrait]").forEach((el) => { el.innerHTML = SCENES.portrait(parseInt(el.dataset.portrait, 10) || 0); });

  paint();
  /* Het aantal alumni erbij zoeken. Dit gebeurt na de eerste paint(), zodat
     de pagina niet op dit verzoek staat te wachten: er staat meteen iets, en
     het getal schuift erin zodra het er is. Mislukt het, dan verandert er
     niets aan wat de bezoeker ziet. */
  if ($('[data-cat-count="alumni"]') && FORM_ENDPOINT) {
    fetch(FORM_ENDPOINT + "?lijst=alumni", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const n = ((d && d.alumni) || []).length;
        if (n) { alumniAantal = n; paint(); }
      })
      .catch(() => { /* dan blijft "Get matched" staan */ });
  }
  paintBand(programmes);
  initWall();

  const [liveProg, liveEv] = await Promise.all([loadProgrammeSheets(), loadEventSheet()]);
  if ((liveProg && liveProg.length) || (liveEv && liveEv.length)) {
    if (liveProg && liveProg.length) programmes = liveProg;
    if (liveEv && liveEv.length) events = liveEv;
    paint();
    if (liveProg && liveProg.length) paintBand(programmes);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   COMMANDOPALET (⌘K)
   ═══════════════════════════════════════════════════════════════════ */
const NAV_CMDS = [
  { label: "Partner internships", href: "internships.html", icon: "Briefcase" },
  { label: "Thesis internships", href: "thesis.html", icon: "FileText" },
  { label: "Other internships", href: "other-internships.html", icon: "Globe" },
  { label: "Events", href: "events.html", icon: "Calendar" },
  { label: "Programmes", href: "programmes.html", icon: "Rocket" },
];

let cmdk = null;
function openCmdK() {
  if (cmdk) return;
  cmdk = document.createElement("div");
  cmdk.id = "cmdk-root";
  cmdk.innerHTML = `
    <div class="cmdk-overlay" data-close></div>
    <div class="cmdk" role="dialog" aria-label="Search">
      <div class="cmdk-input">
        ${icon("Search", 20, { color: "#999" })}
        <input id="cmdk-q" placeholder="${esc(t("cmdk.hint"))}" autocomplete="off">
        <kbd>esc</kbd>
      </div>
      <div class="cmdk-results" id="cmdk-results"></div>
      <div class="cmdk-foot"><span><kbd>↑↓</kbd> navigate</span><span><kbd>↵</kbd> open</span>
        <span class="right">${t("cmdk.titel")}</span></div>
    </div>`;
  document.body.appendChild(cmdk);

  const input = $("#cmdk-q", cmdk);
  const results = $("#cmdk-results", cmdk);
  let rows = [], sel = 0;

  function compute(q) {
    const ql = q.toLowerCase();
    const navs = NAV_CMDS.filter((n) => !ql || n.label.toLowerCase().includes(ql))
      .map((n) => ({ type: "nav", ...n }));
    const opps = ALL_ITEMS.filter((it) => !ql || it.org.toLowerCase().includes(ql)
      || (it.desc || "").toLowerCase().includes(ql)).slice(0, 6).map((o) => ({ type: "opp", item: o }));
    return [...navs, ...opps];
  }

  function paint() {
    if (!rows.length) { results.innerHTML = `<div class="cmdk-empty">${t("cmdk.leeg")}</div>`; return; }
    results.innerHTML = rows.map((r, i) => {
      if (r.type === "nav") {
        return `<div class="cmdk-row${i === sel ? " sel" : ""}" data-i="${i}">
          <span class="sq">${icon(r.icon, 16)}</span>
          <span class="lbl">${t("cmdk.ganaar")} ${esc(t(`cmdknav.${r.href}`) || r.label)}</span><span class="tag">${t("cmdk.pagina")}</span></div>`;
      }
      const o = r.item;
      return `<div class="cmdk-row${i === sel ? " sel" : ""}" data-i="${i}">
        ${companyLogo(o.org, o.logo, 40)}
        <div class="grow"><div class="o-name">${esc(o.org)}</div>
        <div class="o-desc">${esc((o.desc || "").slice(0, 60))}…</div></div>
        ${icon("ArrowUpRight", 16, { color: "#ccc", style: "margin-left:auto" })}</div>`;
    }).join("");
  }

  function activate(r) {
    if (!r) return;
    if (r.type === "nav") { location.href = r.href; return; }
    const key = listOf(r.item);
    location.href = `${LISTS[key].page}#opp=${encodeURIComponent(r.item.org)}`;
  }

  function refresh() { rows = compute(input.value); sel = 0; paint(); }
  refresh();
  setTimeout(() => input.focus(), 40);

  input.addEventListener("input", refresh);
  results.addEventListener("mouseover", (e) => {
    const row = e.target.closest(".cmdk-row");
    if (row) { sel = parseInt(row.dataset.i, 10); paint(); }
  });
  results.addEventListener("click", (e) => {
    const row = e.target.closest(".cmdk-row");
    if (row) activate(rows[parseInt(row.dataset.i, 10)]);
  });
  $$("[data-close]", cmdk).forEach((el) => el.addEventListener("click", closeCmdK));

  cmdk._keys = (e) => {
    if (e.key === "Escape") { closeCmdK(); }
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(rows.length - 1, sel + 1); paint(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); paint(); }
    if (e.key === "Enter") { e.preventDefault(); activate(rows[sel]); }
  };
  window.addEventListener("keydown", cmdk._keys);
}

function closeCmdK() {
  if (!cmdk) return;
  window.removeEventListener("keydown", cmdk._keys);
  cmdk.remove();
  cmdk = null;
}

/* ═══════════════════════════════════════════════════════════════════
   FORMULIEREN VERSTUREN

   Beide formulieren sturen hun antwoorden naar hetzelfde adres: een
   Google Apps Script dat ons mailt, de student een bevestiging stuurt en
   alles wegschrijft in een Google Sheet. Het adres staat in data.js
   (FORM_ENDPOINT), de code van dat script in de map `formulier-backend`.

   Staat er geen adres, of gaat het versturen mis, dan valt de site terug
   op het mailprogramma van de bezoeker. Er gaat dus nooit iets verloren
   doordat de techniek hapert; er staat dan alleen niets in de sheet.
   ═══════════════════════════════════════════════════════════════════ */

/* Bouwt de terugval-mail: onderwerp en tekst in het mailprogramma. */
function mailtoFallback(subject, body) {
  return `mailto:${CONTACT_MAIL}?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body)}`;
}

/* Verstuurt een formulier. Belooft true bij succes, false als het misging.

   Twee dingen zijn hier bewust zo:
   - text/plain als content-type. Bij application/json stuurt de browser
     eerst een OPTIONS-verzoek, en dat beantwoordt Apps Script niet.
   - een tijdslimiet van 8 seconden. Apps Script doet er soms lang over of
     antwoordt door een omleiding heen niet leesbaar, terwijl de mail en de
     regel in de sheet er allang zijn. Blijft het antwoord uit, dan gaan we
     ervan uit dat het gelukt is; anders zou de bezoeker een foutmelding
     krijgen voor iets dat wél is aangekomen. */
function sendForm(payload) {
  return sendFormAntwoord(payload).then((d) => d === undefined || !!(d && d.ok));
}

/* Zelfde, maar met het hele antwoord van de backend. undefined betekent:
   geen antwoord binnen de tijdslimiet (waarschijnlijk wel aangekomen),
   null betekent: mislukt. */
function sendFormAntwoord(payload, tijdslimietMs = 8000) {
  if (!FORM_ENDPOINT) return Promise.resolve(null);

  const verstuurd = fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .catch(() => null);

  const tijdslimiet = new Promise((res) => setTimeout(() => res(undefined), tijdslimietMs));
  return Promise.race([verstuurd, tijdslimiet]);
}

/* ═══════════════════════════════════════════════════════════════════
   TIJDSLOTEN VOOR EEN GESPREK
   ═══════════════════════════════════════════════════════════════════
   De vrije tijden komen uit de agenda "Gesprekken", via de backend. Het
   rooster, de 48 uur en het maximum per dag staan daar ook: in
   formulier-backend/Gesprekken.gs. De site toont alleen wat de backend
   teruggeeft, en de backend controleert bij het versturen nog een keer of
   het tijdstip echt vrij is. */
const tweeCijfers = (n) => String(n).padStart(2, "0");
function slotVanSleutel(k) {
  const [datum, tijd] = k.split("T");
  const [j, m, d] = datum.split("-").map(Number);
  return new Date(j, m - 1, d, Number(tijd.slice(0, 2)));
}

// Geeft de tijden, of null als dat niet lukt (dan kan de student toch verder).
function haalTijden() {
  if (!FORM_ENDPOINT) return Promise.resolve(null);
  const verzoek = fetch(FORM_ENDPOINT + "?lijst=tijden", { cache: "no-store" })
    .then((res) => res.json())
    .then((d) => (d && d.ok && Array.isArray(d.dagen) ? d : null))
    .catch(() => null);
  const tijdslimiet = new Promise((res) => setTimeout(() => res(null), 10000));
  return Promise.race([verzoek, tijdslimiet]);
}

/* ═══════════════════════════════════════════════════════════════════
   AFSPRAAKFORMULIER
   ═══════════════════════════════════════════════════════════════════ */
/* Zelfde waarde als in het alumniformulier, en die staat al in KEUZES_NL,
   dus de Nederlandse versie ("Iets anders") komt vanzelf mee. */
const VELD_ANDERS = "Something else";

function openForm() {
  if ($("#form-root")) return;
  const steps = ["afspr.stap1", "afspr.stap2", "afspr.stap3", "afspr.staptijd", "afspr.stap4"].map(t);
  const data = { types: [], fields: [], fieldOther: "", level: "", commit: "", paid: "", lang: "", slot: "", name: "", email: "", notes: "" };
  let step = 0, done = false, sending = false, viaMail = false;

  // Tijdsloten. tijden: undefined = nog aan het laden, null = ophalen
  // mislukt, anders het antwoord van de backend. data.slot "geen" betekent
  // dat geen van de tijden past.
  let tijden, weken = [], weekNr = 0, slotWeg = false, geboekt = false, onbekend = false;
  const locale = TAAL === "nl" ? "nl-NL" : "en-GB";
  function zetTijden(antw) {
    tijden = antw;
    weken = [];
    ((antw && antw.dagen) || []).forEach((dag) => {
      const datum = slotVanSleutel(dag.datum + "T12:00");
      const maandag = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate() - ((datum.getDay() + 6) % 7));
      let week = weken.find((w) => w.maandag.getTime() === maandag.getTime());
      if (!week) weken.push(week = { maandag, dagen: [] });
      week.dagen.push({ ...dag, datum });
    });
    weekNr = Math.min(weekNr, Math.max(weken.length - 1, 0));
    // Lukt het ophalen niet, dan kan de student toch verder en mailen wij.
    if (!antw && !data.slot) data.slot = "geen";
  }
  haalTijden().then((antw) => { zetTijden(antw); if (step === 3 && !done) render(); });

  const datumTekst = (d, opties) => d.toLocaleDateString(locale, opties);
  const weekTekst = (w) => {
    const a = w.dagen[0].datum, b = w.dagen[w.dagen.length - 1].datum;
    if (a.getTime() === b.getTime()) return datumTekst(a, { day: "numeric", month: "short" });
    return a.getMonth() === b.getMonth()
      ? `${a.getDate()}–${datumTekst(b, { day: "numeric", month: "short" })}`
      : `${datumTekst(a, { day: "numeric", month: "short" })} – ${datumTekst(b, { day: "numeric", month: "short" })}`;
  };
  const uurTekst = (d, min = "00") => `${tweeCijfers(d.getHours())}:${min}`;
  const momentTekst = (sleutel) => {
    const d = slotVanSleutel(sleutel);
    const plek = tijden && tijden.plek ? ` · ${tijden.plek}` : "";
    return `${datumTekst(d, { weekday: "long", day: "numeric", month: "long" })}, ${uurTekst(d)}–${uurTekst(d, "30")}${plek}`;
  };

  const wrap = document.createElement("div");
  wrap.id = "form-root";
  document.body.appendChild(wrap);

  const canNext = () => step === 0 ? data.types.length > 0
    : step === 1 ? data.fields.length > 0
      && (!data.fields.includes(VELD_ANDERS) || !!data.fieldOther.trim())
    : step === 3 ? !!data.slot
    : step === 4 ? !!(data.name && data.email) : true;

  // de keuzes uit stap 1 staan als id in data; in de mail en de sheet
  // hoort het label te staan waar de student op geklikt heeft
  const labelVan = (id) => (TYPE_OPTIONS.find((t) => t.id === id) || {}).label || id;

  const payload = () => ({
    formulier: "afspraak",
    naam: data.name.trim(),
    email: data.email.trim(),
    zoekt: data.types.map(labelVan),
    // In de mail en de sheet hoort te staan wat iemand zelf heeft ingevuld,
    // niet het woord "Something else".
    themas: data.fields.map((f) => (f === VELD_ANDERS && data.fieldOther.trim() ? data.fieldOther.trim() : f)),
    niveau: data.level,
    tijd: data.commit,
    betaald: data.paid,
    taal: data.lang,
    tijdslot: data.slot && data.slot !== "geen" ? data.slot : "",
    tijdslotTekst: data.slot && data.slot !== "geen" ? momentTekst(data.slot) : t("tijd.geen"),
    notities: data.notes.trim(),
  });

  const mailOnderwerp = () => `Appointment request via Impact Connect, ${data.name}`;
  const mailTekst = () => {
    const p = payload();
    return [
      "APPOINTMENT REQUEST",
      `Looking for: ${p.zoekt.join(", ")}`,
      `Themes: ${p.themas.join(", ")}`,
      p.niveau ? `Experience level: ${p.niveau}` : null,
      p.tijd ? `Time they can commit: ${p.tijd}` : null,
      p.betaald ? `Paid or unpaid: ${p.betaald}` : null,
      p.taal ? `Language: ${p.taal}` : null,
      `Time slot: ${p.tijdslotTekst}`,
      "",
      "STUDENT",
      `Name: ${p.naam}`,
      `Email: ${p.email}`,
      p.notities ? `\nAnything else:\n${p.notities}` : null,
      "",
      "— Sent from the Impact Connect site.",
    ].filter((r) => r !== null).join("\n");
  };

  function bodyFor() {
    if (step === 0) {
      return `<div class="type-grid">${TYPE_OPTIONS.map((o) => `
        <button type="button" class="type-card${data.types.includes(o.id) ? " on" : ""}" data-type="${o.id}">
          <span class="badge">${icon(o.icon, 18, { color: data.types.includes(o.id) ? "#fff" : "#888" })}</span>
          <div class="lbl">${esc(t(`soort.${o.id}`) || o.label)}</div>
          <div class="sub">${esc(t(`soort.${o.id}.sub`) || o.desc)}</div>
        </button>`).join("")}</div>`;
    }
    if (step === 1) {
      // "Something else" staat achteraan en opent een tekstvak. Zonder die
      // uitweg moet iemand met een vakgebied dat er niet bij staat iets kiezen
      // wat hij niet bedoelt, en dan klopt de match die wij maken niet.
      return `<p style="font-size:13.5px;color:#555;margin:0 0 14px">${t("afspr.themas.hint")}</p>
        <div class="chip-row">${[...FIELD_OPTIONS, VELD_ANDERS].map((f) =>
          `<button type="button" class="chip${data.fields.includes(f) ? " on" : ""}" data-field="${esc(f)}">${esc(keuzeLabel(f))}</button>`).join("")}</div>
        ${data.fields.includes(VELD_ANDERS) ? `
          <div class="chip-other">
            <label for="f-fieldother">${t("afspr.anders.vraag")}</label>
            <input id="f-fieldother" placeholder="${esc(t("afspr.anders.hint"))}" value="${esc(data.fieldOther)}">
          </div>` : ""}`;
    }
    if (step === 2) {
      const group = (key, label, opts) => `<div><label>${esc(label)}</label><div class="chip-row">${
        opts.map((o) => `<button type="button" class="chip${data[key] === o ? " on" : ""}" data-set="${key}" data-val="${esc(o)}">${esc(keuzeLabel(o))}</button>`).join("")
      }</div></div>`;
      return `<div class="field-stack">
        ${group("level", t("afspr.niveau"), ["Beginner", "Some experience", "Advanced"])}
        ${group("commit", t("afspr.tijd"), ["A few hrs/week", "1 day/week", "2–3 days/week", "Full-time"])}
        ${/* Hier stond eerst "Paid only / Either is fine / Doesn't matter".
              "Doesn't matter" betekende hetzelfde als "Either is fine" en is
              eruit; "Unpaid only" is erbij gekomen, want er zijn studenten
              die vrijwilligerswerk juist bewust boven betaald werk kiezen. */""}
        ${group("paid", t("afspr.betaald"), ["Paid only", "Unpaid only", "Either is fine"])}
        ${group("lang", t("afspr.taal"), ["English", "Dutch", "Either"])}
      </div>`;
    }
    if (step === 3) {
      const week = weken[weekNr];
      const weg = slotWeg ? `<p class="tijd-weg">${t("tijd.weg")}</p>` : "";
      if (tijden === undefined) return `${weg}<p class="tijd-info">${t("tijd.laden")}</p>`;
      return `${weg}
        ${tijden
          ? `<p class="tijd-info">${icon("MapPin", 15)} ${esc(t("tijd.info").replace("{plek}", tijden.plek || ""))}</p>`
          : `<p class="form-note">${t("tijd.fout")}</p>`}
        ${week ? `
          <div class="tijd-weken">${weken.map((w, i) =>
            `<button type="button" class="tijd-week${i === weekNr ? " on" : ""}" data-week="${i}">${esc(weekTekst(w))}</button>`).join("")}</div>
          <div class="tijd-dagen">${week.dagen.map((dag) => `
            <div class="tijd-dag">
              <div class="tijd-datum">${esc(datumTekst(dag.datum, { weekday: "short", day: "numeric", month: "short" }))}</div>
              <div class="chip-row">${dag.vrij.length
                ? dag.vrij.map((k) => `<button type="button" class="chip${data.slot === k ? " on" : ""}" data-slot="${esc(k)}">${uurTekst(slotVanSleutel(k))}</button>`).join("")
                : `<span class="tijd-vol">${t(dag.reden === "tekort" ? "tijd.tekort" : "tijd.vol")}</span>`}</div>
            </div>`).join("")}</div>` : ""}
        <button type="button" class="tijd-geen${data.slot === "geen" ? " on" : ""}" data-slot="geen">${t("tijd.geen")}</button>
        ${data.slot === "geen" ? `<p class="form-note">${t("tijd.geen.uitleg")}</p>`
          : data.slot ? `<p class="tijd-gekozen">${icon("Calendar", 15)} ${esc(t("tijd.gekozen").replace("{moment}", momentTekst(data.slot)))}</p>` : ""}`;
    }
    return `<div class="form-stack">
      <div><label>${t("form.naam")}</label><input id="f-name" placeholder="${esc(t("form.naam.hint"))}" value="${esc(data.name)}"></div>
      <div><label>${t("form.email")}</label><input id="f-email" placeholder="you@students.uu.nl" value="${esc(data.email)}"></div>
      <div><label>${t("afspr.rest")} <span style="font-weight:400;color:#999">${t("form.optioneel")}</span></label>
        <textarea id="f-notes" rows="3" placeholder="${esc(t("afspr.rest.hint"))}">${esc(data.notes)}</textarea></div>
      <p class="form-note">${t("afspr.privacy")}</p>
    </div>`;
  }

  function render() {
    const inner = done ? `
      <div class="modal-done">
        <div class="tick">${icon("Check", 32, { color: "#2B6B4F" })}</div>
        <h3>${t("form.dank").replace("{naam}", esc(data.name.split(" ")[0] || t("form.jij")))}</h3>
        ${viaMail ? `
          <p>${t("form.viamail")}</p>
          <p style="font-size:13px;color:#777">${t("form.viamail.niets")
            .replace("{adres}", `<a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a>`)}</p>`
        : geboekt ? `<p>${esc(t("tijd.geboekt")).replace("{moment}", `<strong>${esc(momentTekst(data.slot))}</strong>`)}</p>`
        : onbekend ? `<p>${t("tijd.onbekend")}</p>`
        : `<p>${t("afspr.gelukt")}</p>`}
        <button class="btn-next" data-close>${t("form.terug")}</button>
      </div>` : `
      <div class="progress">${steps.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div>
      <div class="modal-body">
        <h3>${esc(steps[step])}</h3>
        <p class="step-of">${t("form.stapvan").replace("{n}", step + 1).replace("{totaal}", steps.length)}</p>
        ${bodyFor()}
      </div>
      <div class="modal-foot">
        <button class="btn-text" id="f-back">${step === 0 ? t("form.annuleer") : "← " + t("form.vorige")}</button>
        ${step < steps.length - 1
          ? `<button class="btn-next" id="f-next"${canNext() ? "" : " disabled"}>${t("form.verder")} ${icon("ChevronRight", 16)}</button>`
          : `<button class="btn-next finish" id="f-submit"${canNext() ? "" : " disabled"}>${icon("Check", 17)} ${t("afspr.verstuur")}</button>`}
      </div>`;

    wrap.innerHTML = `
      <div class="modal-overlay" data-close></div>
      <div class="modal-wrap">
        <div class="modal" role="dialog" aria-label="${esc(t("nav.appointment"))}">
          <div class="modal-head">
            <div class="t">${bridgeMark(26, "#13352A")}<strong>${t("nav.appointment")}</strong></div>
            <button class="icon-btn" data-close aria-label="${esc(t("sluiten"))}">${icon("X", 17)}</button>
          </div>
          ${inner}
        </div>
      </div>`;
    bind();
  }

  function bind() {
    $$("[data-close]", wrap).forEach((el) => el.addEventListener("click", () => wrap.remove()));

    $$("[data-type]", wrap).forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.type;
      data.types = data.types.includes(id) ? data.types.filter((x) => x !== id) : [...data.types, id];
      render();
    }));
    const anders = $("#f-fieldother", wrap);
    if (anders) anders.addEventListener("input", () => {
      data.fieldOther = anders.value;
      // Niet opnieuw tekenen: dan raak je bij elke aanslag de cursor kwijt.
      // Alleen de knop hoeft bij te komen.
      const verder = $("#f-next", wrap);
      if (verder) verder.disabled = !canNext();
    });
    $$("[data-field]", wrap).forEach((b) => b.addEventListener("click", () => {
      const f = b.dataset.field;
      data.fields = data.fields.includes(f) ? data.fields.filter((x) => x !== f) : [...data.fields, f];
      render();
    }));
    $$("[data-set]", wrap).forEach((b) => b.addEventListener("click", () => {
      data[b.dataset.set] = b.dataset.val;
      render();
    }));
    $$("[data-week]", wrap).forEach((b) => b.addEventListener("click", () => {
      weekNr = Number(b.dataset.week);
      render();
    }));
    $$("[data-slot]", wrap).forEach((b) => b.addEventListener("click", () => {
      data.slot = b.dataset.slot;
      slotWeg = false;
      render();
    }));

    ["name", "email", "notes"].forEach((k) => {
      const el = $("#f-" + k, wrap);
      if (!el) return;
      el.addEventListener("input", () => {
        data[k] = el.value;
        const btn = $("#f-submit", wrap);
        if (btn) btn.disabled = !canNext();
      });
    });

    const back = $("#f-back", wrap);
    if (back) back.addEventListener("click", () => { if (step === 0) wrap.remove(); else { step--; render(); } });
    const next = $("#f-next", wrap);
    if (next) next.addEventListener("click", () => { if (canNext()) { step++; render(); } });
    const submit = $("#f-submit", wrap);
    if (submit) submit.addEventListener("click", () => {
      if (!canNext() || sending) return;
      sending = true;
      submit.disabled = true;
      submit.innerHTML = `${icon("Check", 17)} ${t("form.versturen")}`;
      const metTijd = !!(data.slot && data.slot !== "geen");
      // Een gesprek in de agenda zetten duurt langer dan alleen mailen.
      sendFormAntwoord(payload(), metTijd ? 25000 : 8000).then((antw) => {
        sending = false;
        if (antw && antw.fout === "bezet") {
          // Net door iemand anders gekozen: terug naar de tijden, met de
          // nieuwe stand erbij.
          zetTijden(antw.tijden && antw.tijden.ok ? antw.tijden : tijden);
          data.slot = "";
          slotWeg = true;
          step = 3;
          render();
          return;
        }
        // Geen antwoord binnen de tijd: waarschijnlijk wel aangekomen, zie
        // sendForm. Of het gesprek vaststaat leest de student dan in de mail.
        const ok = antw === undefined || !!(antw && antw.ok);
        viaMail = !ok;
        geboekt = !!(antw && antw.geboekt);
        onbekend = antw === undefined && metTijd;
        // gelukt het niet, dan opent alsnog het mailprogramma met alles erin
        if (!ok) window.location.href = mailtoFallback(mailOnderwerp(), mailTekst());
        done = true;
        render();
      });
    });
  }

  render();
}

/* ═══════════════════════════════════════════════════════════════════
   ALUMNIVERZOEK
   Dit is een matchingverzoek, geen vraag die wij doorsturen. De student
   beschrijft wat voor alumnus hij zoekt; het team kijkt de lijst door en
   stuurt een LinkedIn-profiel (en een telefoonnummer als de alumnus dat
   heeft gegeven) terug. De student stuurt dan zelf eerst een bericht, en
   bellen kan daarna als ze dat allebei willen.

   Aan het eind staat een echte mailto: het mailprogramma van de student
   opent met het hele verzoek erin, klaar om te versturen naar het team.
   ═══════════════════════════════════════════════════════════════════ */
const ALUMNI_FIELDS = [
  "Climate and energy", "Water", "Nature and biodiversity", "Circular economy and waste",
  "Food and agriculture", "Policy and government", "Consultancy", "Research and academia",
  "NGO and non-profit", "Startups and own venture", "Corporate sustainability",
  "International development", "Something else",
];
const ALUMNI_ORGS = [
  "NGO", "Government", "Consultancy", "Research or university",
  "Company", "Own venture", "Doesn't matter",
];
/* Wie hierop klikt krijgt een tekstveld en vult het zelf in. */
const ALUMNI_OTHER = "Something else";

function openAlumniForm() {
  if ($("#form-root")) return;
  const steps = ["al.stap1", "al.stap2", "afspr.stap4"].map(t);
  const data = {
    fields: [], fieldOther: "", orgs: [], where: "", goal: "",
    name: "", email: "", study: "",
  };
  let step = 0, done = false, sending = false, viaMail = false;

  const wrap = document.createElement("div");
  wrap.id = "form-root";
  document.body.appendChild(wrap);

  // "Something else" telt pas mee als er ook echt iets ingevuld is.
  const otherOk = (list, other) => !list.includes(ALUMNI_OTHER) || !!other.trim();
  const canNext = () => step === 0 ? data.fields.length > 0 && otherOk(data.fields, data.fieldOther)
    : step === 1 ? !!data.goal.trim()
    : !!(data.name && data.email);

  // In de mail komt het getypte antwoord in plaats van "Something else" te staan.
  const withOther = (list, other) =>
    list.map((v) => (v === ALUMNI_OTHER && other.trim() ? other.trim() : v));

  const payload = () => ({
    formulier: "alumnus",
    naam: data.name.trim(),
    email: data.email.trim(),
    studie: data.study.trim(),
    vakgebied: withOther(data.fields, data.fieldOther),
    organisatie: data.orgs,
    specifiek: data.where.trim(),
    doel: data.goal.trim(),
  });

  function mailtoLink() {
    const p = payload();
    const subject = `Alumni request via Impact Connect, ${p.naam}`;
    const body = [
      "ALUMNUS WANTED",
      `Field: ${p.vakgebied.join(", ")}`,
      p.organisatie.length ? `Kind of organisation: ${p.organisatie.join(", ")}` : null,
      p.specifiek ? `Specific role, company or organisation: ${p.specifiek}` : null,
      "",
      "WHAT THEY WANT OUT OF IT",
      p.doel,
      "",
      "STUDENT",
      `Name: ${p.naam}`,
      `Email: ${p.email}`,
      p.studie ? `Study and year: ${p.studie}` : null,
      "",
      "— Sent from the Alumni page on the Impact Connect site. Please reply with a",
      "LinkedIn profile (and a phone number if they've given one).",
    ].filter((r) => r !== null).join("\n");
    return mailtoFallback(subject, body);
  }

  const chipGroup = (attr, label, opts, chosen, o = {}) => `
    <label class="chip-label">${label}${o.extra ? ` <span style="font-weight:400;color:#999">${o.extra}</span>` : ""}</label>
    <div class="chip-row">${opts.map((c) =>
      `<button type="button" class="chip${chosen.includes(c) ? " on" : ""}" data-${attr}="${esc(c)}">${esc(keuzeLabel(c))}</button>`).join("")}</div>
    ${o.otherKey && chosen.includes(ALUMNI_OTHER) ? `
      <div class="chip-other">
        <label for="a-${o.otherKey}">${esc(o.ask)}</label>
        <input id="a-${o.otherKey}" placeholder="${esc(o.hint || "")}" value="${esc(data[o.otherKey])}">
      </div>` : ""}`;

  function bodyFor() {
    if (step === 0) {
      return `<p style="font-size:13.5px;color:#555;margin:0 0 18px">${t("al.stap1.hint")}</p>
        ${chipGroup("field", t("al.vakgebied"), ALUMNI_FIELDS, data.fields, {
          otherKey: "fieldOther", ask: t("al.welkvak"),
          hint: t("al.welkvak.hint"),
        })}
        <div style="height:20px"></div>
        ${chipGroup("org", t("al.soortorg"), ALUMNI_ORGS, data.orgs, { extra: t("form.optioneel") })}
        <div class="form-stack" style="margin-top:22px">
          <div><label>${t("al.specifiek")} <span style="font-weight:400;color:#999">${t("form.optioneel")}</span></label>
            <input id="a-where" placeholder="${esc(t("al.specifiek.hint"))}" value="${esc(data.where)}"></div>
        </div>`;
    }
    if (step === 1) {
      return `<p style="font-size:13.5px;color:#555;margin:0 0 18px">${t("al.stap2.hint")}</p>
        <div class="form-stack">
          <div><label>${t("al.doel")}</label>
            <textarea id="a-goal" rows="6" placeholder="${esc(t("al.doel.hint"))}">${esc(data.goal)}</textarea></div>
        </div>`;
    }
    return `<div class="form-stack">
      <div><label>${t("form.naam")}</label><input id="a-name" placeholder="${esc(t("form.naam.hint"))}" value="${esc(data.name)}"></div>
      <div><label>${t("form.email")}</label><input id="a-email" placeholder="you@students.uu.nl" value="${esc(data.email)}"></div>
      <div><label>${t("al.studie")} <span style="font-weight:400;color:#999">${t("form.optioneel")}</span></label>
        <input id="a-study" placeholder="${esc(t("al.studie.hint"))}" value="${esc(data.study)}"></div>
      <p class="form-note">${t("al.privacy")}</p>
    </div>`;
  }

  function render() {
    const inner = done ? `
      <div class="modal-done">
        <div class="tick">${icon("Check", 32, { color: "#C2683A" })}</div>
        <h3>${viaMail ? t("al.klaar.mail") : t("al.klaar")}, ${esc(data.name.split(" ")[0] || t("form.jij"))}</h3>
        ${viaMail ? `
          <p>${t("form.viamail")}</p>
          <p style="font-size:13px;color:#777">${t("al.viamail.niets")
            .replace("{opnieuw}", `<a href="${mailtoLink()}" id="a-again">${t("al.mailopnieuw")}</a>`)
            .replace("{adres}", `<a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a>`)}</p>`
        : `<p>${t("al.gelukt")}</p>`}
        <button class="btn-next" data-close>${t("form.terug")}</button>
      </div>` : `
      <div class="progress">${steps.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div>
      <div class="modal-body">
        <h3>${esc(steps[step])}</h3>
        <p class="step-of">${t("form.stapvan").replace("{n}", step + 1).replace("{totaal}", steps.length)}</p>
        ${bodyFor()}
      </div>
      <div class="modal-foot">
        <button class="btn-text" id="a-back">${step === 0 ? t("form.annuleer") : "← " + t("form.vorige")}</button>
        ${step < steps.length - 1
          ? `<button class="btn-next" id="a-next"${canNext() ? "" : " disabled"}>${t("form.verder")} ${icon("ChevronRight", 16)}</button>`
          : `<button class="btn-next finish" id="a-submit"${canNext() ? "" : " disabled"}>${icon("Mail", 17)} ${t("al.verstuur")}</button>`}
      </div>`;

    wrap.innerHTML = `
      <div class="modal-overlay" data-close></div>
      <div class="modal-wrap">
        <div class="modal" role="dialog" aria-label="${esc(t("al.r1.knop"))}">
          <div class="modal-head">
            <div class="t">${bridgeMark(26, "#13352A")}<strong>${t("al.r1.knop")}</strong></div>
            <button class="icon-btn" data-close aria-label="${esc(t("sluiten"))}">${icon("X", 17)}</button>
          </div>
          ${inner}
        </div>
      </div>`;
    bind();
  }

  function bind() {
    $$("[data-close]", wrap).forEach((el) => el.addEventListener("click", () => wrap.remove()));

    // de twee meerkeuzegroepen: vakgebied en soort organisatie
    [["field", "fields", "fieldOther"], ["org", "orgs"]].forEach(([attr, key, otherKey]) => {
      $$(`[data-${attr}]`, wrap).forEach((b) => b.addEventListener("click", () => {
        const v = b.dataset[attr];
        const aan = !data[key].includes(v);
        data[key] = aan ? [...data[key], v] : data[key].filter((x) => x !== v);
        render();
        // klikt iemand "Something else" aan, dan springt de cursor meteen
        // in het vakje eronder, anders ziet hij het misschien niet staan
        if (aan && v === ALUMNI_OTHER && otherKey) $("#a-" + otherKey, wrap)?.focus();
      }));
    });

    ["fieldOther", "where", "goal", "name", "email", "study"].forEach((k) => {
      const el = $("#a-" + k, wrap);
      if (!el) return;
      el.addEventListener("input", () => {
        data[k] = el.value;
        const btn = $("#a-submit", wrap) || $("#a-next", wrap);
        if (btn) btn.disabled = !canNext();
      });
    });

    const back = $("#a-back", wrap);
    if (back) back.addEventListener("click", () => { if (step === 0) wrap.remove(); else { step--; render(); } });
    const next = $("#a-next", wrap);
    if (next) next.addEventListener("click", () => { if (canNext()) { step++; render(); } });
    const submit = $("#a-submit", wrap);
    if (submit) submit.addEventListener("click", () => {
      if (!canNext() || sending) return;
      sending = true;
      submit.disabled = true;
      submit.innerHTML = `${icon("Mail", 17)} ${t("form.versturen")}`;
      sendForm(payload()).then((ok) => {
        sending = false;
        viaMail = !ok;
        if (!ok) window.location.href = mailtoLink();
        done = true;
        render();
      });
    });
  }

  render();
}

/* ═══════════════════════════════════════════════════════════════════
   OPSTARTEN
   ═══════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // De taal als eerste, nog voor er iets getekend wordt: alles wat hierna
  // komt leest TAAL uit en zou anders in het Engels opgebouwd worden.
  pasTaalToe();
  initTaalknop();
  initContactForm();
  initMenu();
  initLinkedIn();

  // uitklapmenu onder Programmes, gevuld vanuit PROGRAMME_CATS zodat het
  // meeloopt met de categorieën die uit de sheet komen
  $$("[data-prog-menu]").forEach((el) => {
    const nu = new URLSearchParams(location.search).get("cat");
    el.innerHTML = PROGRAMME_CATS.map((c) =>
      `<a class="${c.id === nu ? "on" : ""}" href="programmes.html?cat=${encodeURIComponent(c.id)}">${esc(t(`progcat.${c.id}`) || c.label)}</a>`
    ).join("");
  });

  // merkteken + UU-logo in header en footer
  $$("[data-mark]").forEach((el) => el.innerHTML = bridgeMark(+el.dataset.size || 42, el.dataset.mark));
  // Mag het UU-logo nog niet gevoerd worden (zie UU_BRANDING in data.js),
  // dan gaat het blokje in de menubalk in zijn geheel weg: zonder logo bleef
  // daar alleen "Utrecht University" naast de knop zweven, en dat leest als
  // een losse regel tekst in plaats van een co-branding.
  // De regel in de voettekst blijft wel staan, alleen zonder logo. Dat is een
  // zin die de samenwerking noemt, geen merkteken.
  if (!UU_BRANDING) $$(".uu-cobrand").forEach((el) => { el.style.display = "none"; });
  $$("[data-uu-logo]").forEach((el) => {
    if (!UU_BRANDING) { el.style.display = "none"; return; }
    const s = +el.dataset.uuLogo || 38;
    el.innerHTML = `<img src="${UU_LOGO}" alt="Utrecht University" width="${s}" height="${s}">`;
  });
  $$("[data-icon]").forEach((el) => el.innerHTML = icon(el.dataset.icon, +el.dataset.size || 16, {
    strokeWidth: +el.dataset.stroke || 2,
    color: el.dataset.color || undefined,
    fill: el.dataset.fill || undefined,
  }));

  // Het bewaarvlaggetje in de balk telt items die je op dit moment nergens
  // kunt bewaren: de bookmarkknop zit alleen op de internshipkaartjes, en die
  // staan achter INTERNSHIPS_LIVE. Wat je er nog in ziet staan komt uit een
  // eerdere sessie in je eigen browser. Zolang de internships niet live zijn
  // verbergen we hem dus, net als de teller op de homepage en de items in ⌘K.
  if (!INTERNSHIPS_LIVE) $$(".saved-count").forEach((el) => { el.style.display = "none"; });

  paintSaved();
  initScrollProgress();
  initReveal();

  // afspraak-knoppen overal
  $$("[data-open-form]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openForm(); }));
  // alumniverzoek
  $$("[data-open-alumni]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openAlumniForm(); }));
  // zoekknop + sneltoets
  $$("[data-open-cmdk]").forEach((b) => b.addEventListener("click", openCmdK));
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      cmdk ? closeCmdK() : openCmdK();
    }
    if (e.key === "Escape" && $("#panel-root")) closePanel();
  });
  // dropdown ook bruikbaar op touch
  $$(".nav-drop > .nav-link").forEach((a) => a.addEventListener("click", (e) => {
    if (window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      a.parentElement.classList.toggle("open");
    }
  }));

  const page = document.body.dataset.page;
  if (page === "home") initHome();
  else if (page === "listing") initListing(document.body.dataset.list);
  else if (page === "events") initEvents();
  else if (page === "programmes") initProgrammes();
  else if (page === "alumni") initAlumniloket();

  // ?check=taal in de adresbalk somt in de console op wat nog geen
  // Nederlands heeft. Voor onszelf, een bezoeker merkt er niets van.
  if (new URLSearchParams(location.search).get("check") === "taal") controleerVertalingen();
});

/* ═══════════════════════════════════════════════════════════════════
   CONTACTFORMULIER

   Het korte formulier onderaan de homepage en "Over ons". Anders dan de
   twee andere formulieren staat dit gewoon op de pagina in plaats van in
   een venster, en heeft het maar één stap.

   Verstuurt naar hetzelfde Apps Script (formulier: "contact"). Lukt dat
   niet, dan opent het mailprogramma met dezelfde tekst, zodat het bericht
   nooit verdwijnt omdat de techniek hapert.
   ═══════════════════════════════════════════════════════════════════ */
function initContactForm() {
  $$("[data-contact-form]").forEach((form) => {
    const knop   = form.querySelector(".ct-verstuur");
    const fout   = form.querySelector(".ct-fout");
    const gelukt = form.querySelector(".ct-gelukt");
    const veldje = (n) => form.querySelector(`[name="${n}"]`);

    const toon = (el, tekst) => { el.textContent = tekst; el.hidden = false; };
    const verberg = (el) => { el.hidden = true; };

    /* Student of organisatie. De keuze verandert het derde veld en de zin
       erboven, en gaat als antwoord mee naar de mail en de sheet, zodat een
       bericht van een organisatie meteen bij de juiste persoon komt. */
    let soort = "Organisation";
    const chips = $$("[data-ct-soort]", form);
    const lead = $("[data-ct-lead]", form.closest(".contact-section"));
    const veldnaam = $("[data-ct-veldnaam]", form);

    function pasSoortToe() {
      const s = soort === "Organisation" ? "org" : "student";
      chips.forEach((c) => c.classList.toggle("on", c.dataset.ctSoort === soort));
      if (lead) lead.textContent = t(`ct.lead.${s}`);
      if (veldnaam) veldnaam.textContent = t(`ct.veld.${s}`);
      const studie = veldje("studie");
      if (studie) studie.placeholder = t(`ct.hint.${s}`);
    }
    chips.forEach((c) => c.addEventListener("click", () => { soort = c.dataset.ctSoort; pasSoortToe(); }));
    pasSoortToe();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      verberg(fout);

      // Bot? Dan doen we alsof er niets gebeurt: geen melding, geen verzending.
      if ((veldje("website").value || "").trim()) return;

      const naam    = (veldje("naam").value || "").trim();
      const email   = (veldje("email").value || "").trim();
      const studie  = (veldje("studie").value || "").trim();
      const bericht = (veldje("bericht").value || "").trim();

      // Alleen de drie die we echt nodig hebben om te kunnen antwoorden.
      const ontbreekt = [];
      $$(".mis", form).forEach((el) => el.classList.remove("mis"));
      if (!naam)    ontbreekt.push("naam");
      if (!/^\S+@\S+\.\S+$/.test(email)) ontbreekt.push("email");
      if (!bericht) ontbreekt.push("bericht");
      if (ontbreekt.length) {
        ontbreekt.forEach((n) => veldje(n).classList.add("mis"));
        veldje(ontbreekt[0]).focus();
        toon(fout, t("ct.mis"));
        return;
      }

      const onderwerp = `Message via the website (${soort}), ${naam}`;
      const tekst = [`Type: ${soort}`, `Name: ${naam}`, `Email: ${email}`,
        studie ? `${soort === "Organisation" ? "Organisation" : "Study"}: ${studie}` : null, "", bericht]
        .filter((r) => r !== null).join("\n");

      knop.disabled = true;
      const ok = await sendForm({ formulier: "contact", soort, naam, email, studie, bericht });
      knop.disabled = false;

      if (ok) {
        form.reset();
        toon(gelukt, t("ct.gelukt").replace("{naam}", naam));
        gelukt.scrollIntoView({ block: "center", behavior: "smooth" });
      } else {
        // Niets kwijt: het mailprogramma opent met hetzelfde bericht erin.
        toon(fout, t("ct.viamail"));
        window.location.href = mailtoFallback(onderwerp, tekst);
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════
   HET ALUMNILOKET

   De lijst met alumni op alumni.html, en het formulier waarmee een
   student er een vraag aan stelt.

   De lijst komt uit hetzelfde Apps Script als de formulieren, met
   ?lijst=alumni erachter. Daar zitten alleen mensen in die toestemming
   hebben gegeven, en alleen de velden die een student mag zien: geen
   mailadres, geen telefoonnummer, geen achternaam. Wat hier niet
   binnenkomt, kan ook niet in de broncode van de pagina belanden.

   Lukt het ophalen niet, dan blijft de lijst leeg en staat er één regel
   uitleg. De uitweg eronder ("beschrijf wie je zoekt") werkt dan nog
   gewoon, dus een student staat nooit met lege handen.
   ═══════════════════════════════════════════════════════════════════ */

/* De thema's waar een student zijn vraag onder kan hangen. Kort gehouden:
   dit is een hulpje om de vraag te plaatsen, niet nog een vragenlijst. */
const LOKET_ONDERWERPEN = [
  "Choosing a master’s", "Applying for jobs", "Exploring a field",
  "Internships", "Starting something", "Working abroad",
];

/* Even lang als de ondergrens in Loket.gs. Staat die daar hoger, dan zou
   een student hier op verzenden kunnen drukken en alsnog een foutmelding
   krijgen; dat is precies het moment waarop mensen afhaken. */
const LOKET_MIN_TEKENS = 80;

let alumniLijst = null;
let alumniFilter = "";
let alumniVraagbegin = "";

/* Met ?test=1 achter het adres komen ook de testprofielen mee. Die staan
   niet in de gewone lijst, zodat je de hele keten kunt uitproberen zonder
   dat studenten een nepprofiel zien. */
const LOKET_TESTMODUS = new URLSearchParams(location.search).get("test") === "1";

/* ── De lijst bewaren tussen bezoeken ────────────────────────────────
   Apps Script doet er anderhalve tot drie en een halve seconde over, en
   de pagina stond al die tijd op "Loading the list…". Bij elk bezoek
   opnieuw, want er werd expliciet om geen cache gevraagd.

   Nu bewaren we de vorige lijst en tonen die meteen, terwijl de verse
   lijst op de achtergrond binnenkomt. Wie terugkomt ziet dus geen
   wachttekst meer. Verandert er iets, dan schuift het er een seconde
   later in.

   In wat we bewaren zit niets persoonlijks: het is precies wat de pagina
   toont, en sinds openbareLijst() geen namen meer meestuurt staan die er
   ook niet in. Een uur oud is oud genoeg om weg te gooien; de lijst
   verandert hooguit een paar keer per week.
------------------------------------------------------------------- */
const ALUMNI_BEWAAR = "impact-connect:alumni";
const ALUMNI_HOUDBAAR = 60 * 60 * 1000;

function bewaardeAlumni() {
  try {
    const rauw = localStorage.getItem(ALUMNI_BEWAAR);
    if (!rauw) return null;
    const d = JSON.parse(rauw);
    if (!d || !Array.isArray(d.alumni) || Date.now() - d.op > ALUMNI_HOUDBAAR) return null;
    return d.alumni;
  } catch (e) { return null; }          // privémodus, of rommel in de opslag
}

function bewaarAlumni(lijst) {
  try {
    localStorage.setItem(ALUMNI_BEWAAR, JSON.stringify({ op: Date.now(), alumni: lijst }));
  } catch (e) { /* vol of geblokkeerd: dan gewoon niet bewaren */ }
}

function initAlumniloket() {
  bindVoorbeeldvragen();

  const bak = $("[data-alum-lijst]");
  if (!bak) return;
  if (!FORM_ENDPOINT) return alumniStatus("lok.uit");

  const toon = (lijst) => {
    alumniLijst = lijst;
    tekenAlumniFilters();
    tekenAlumniLijst();
  };

  // Testprofielen bewaren we niet: die wil je juist elke keer vers zien.
  const bewaard = LOKET_TESTMODUS ? null : bewaardeAlumni();
  if (bewaard && bewaard.length) toon(bewaard);

  fetch(FORM_ENDPOINT + "?lijst=alumni" + (LOKET_TESTMODUS ? "&test=1" : ""), { cache: "no-store" })
    .then((res) => res.json())
    .then((d) => {
      const vers = (d && d.alumni) || [];
      if (!vers.length) return bewaard ? null : alumniStatus("lok.leeg");
      if (!LOKET_TESTMODUS) bewaarAlumni(vers);
      // Alleen opnieuw tekenen als er echt iets veranderd is, anders knippert
      // de lijst onder de handen van iemand die net aan het filteren was.
      if (JSON.stringify(vers) !== JSON.stringify(alumniLijst)) toon(vers);
    })
    .catch(() => { if (!bewaard) alumniStatus("lok.fout"); });
}

function alumniStatus(sleutel) {
  const bak = $("[data-alum-lijst]");
  if (bak) bak.innerHTML = `<p class="alum-status">${t(sleutel)}</p>`;
}

/* De acht voorbeeldvragen worden klikbaar. Klik je er een aan, dan begint
   het formulier met die zin; de student vult zelf de context aan. */
function bindVoorbeeldvragen() {
  $$(".ask-list span").forEach((el) => {
    el.dataset.vraag = el.textContent.trim();
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    const kies = () => {
      const zelfde = alumniVraagbegin === el.dataset.vraag;
      alumniVraagbegin = zelfde ? "" : el.dataset.vraag;
      $$(".ask-list span").forEach((s) => s.classList.toggle("on", !zelfde && s === el));
    };
    el.addEventListener("click", kies);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kies(); }
    });
  });
}

/* ── de filterbalk ───────────────────────────────────────────────── */
function tekenAlumniFilters() {
  const bak = $("[data-alum-filters]");
  if (!bak) return;
  const themas = [...new Set(alumniLijst.flatMap((a) => a.themas || []))].sort();
  bak.hidden = false;
  bak.innerHTML =
    [["", t("lok.alle")]].concat(themas.map((x) => [x, x]))
      .map(([waarde, label]) =>
        `<button type="button" class="chip${alumniFilter === waarde ? " on" : ""}" data-thema="${esc(waarde)}">${esc(label)}</button>`)
      .join("")
    // De uitweg staat ook hier, als laatste in de rij. Hij stond alleen onder
    // de lijst, en dat is na 48 kaartjes: wie hem nodig heeft is dan allang
    // weg. Juist bij het kiezen van een vakgebied merk je dat het jouwe er
    // niet bij staat. Omlijnd in plaats van gevuld, zodat het geen veertiende
    // vakgebied lijkt maar een uitweg.
    + `<button type="button" class="chip chip-uitweg" data-open-alumni>${t("lok.geenthema")}</button>`
    + `<span class="telling" data-alum-telling></span>`;

  // Deze chip wordt hier gemaakt, dus de koppeling bij het opstarten heeft
  // hem nooit gezien. Daarom hier zelf aanhaken.
  $("[data-open-alumni]", bak)?.addEventListener("click", (e) => {
    e.preventDefault(); openAlumniForm();
  });
  $$("[data-thema]", bak).forEach((b) => b.addEventListener("click", () => {
    alumniFilter = b.dataset.thema;
    tekenAlumniFilters();
    tekenAlumniLijst();
  }));
}

/* ── de kaarten ──────────────────────────────────────────────────── */
function ruimteTekst(a) {
  // Iemand die vol zit blijft gewoon in de lijst staan. Weghalen zou de
  // student laten denken dat die alumnus niet bestaat, en volgende maand
  // staat hij er weer. Alleen de knop gaat uit.
  if (a.vol) return { klasse: "vol", tekst: t("lok.vol").replace("{periode}", t("lok.periode." + a.periode)) };
  if (a.over === 1) return { klasse: "bijna", tekst: t("lok.plek1").replace("{periode}", t("lok.periode." + a.periode)) };
  return { klasse: "open", tekst: t("lok.beschikbaar") };
}

function tekenAlumniLijst() {
  const bak = $("[data-alum-lijst]");
  const lijst = alumniFilter
    ? alumniLijst.filter((a) => (a.themas || []).includes(alumniFilter))
    : alumniLijst;

  bak.innerHTML = lijst.map((a) => {
    const r = ruimteTekst(a);
    // Master eerst: dat is de recentste, en op een regel in plaats van twee.
    const opleiding = [a.msc, a.bsc].filter((x) => x && x !== "—").join(" · ");
    // De klasse van de beschikbaarheid gaat mee naar het kaartje, zodat het
    // randje links dezelfde kleur kan krijgen als het bolletje onderaan.
    return `<article class="alum-card ruimte-${r.klasse}${a.vol ? " vol" : ""}${a.test ? " test" : ""}">
      ${a.test ? `<div class="alum-testvlag">${t("lok.test")}</div>` : ""}
      <!-- Het pad als pad: twee piepkleine labels doen de structuur, zodat
           allebei de rollen in dezelfde grootte kunnen staan. Stond hier
           eerst als twee zinnen onder elkaar, waarvan de bovenste in een
           schreefletter die voor een naam bedoeld was — die schreeuwde
           harder dan de inhoud rechtvaardigde. -->
      <dl class="alum-pad">
        ${a.werk ? `<dt>${t("lok.nu")}</dt><dd>${esc(a.werk)}</dd>` : ""}
        ${a.eerder ? `<dt>${t("lok.eerder")}</dt><dd>${esc(a.eerder)}</dd>` : ""}
      </dl>
      ${opleiding ? `<div class="studie">${opleiding}</div>` : ""}
      ${(a.themas || []).length ? `<div class="alum-themas">${a.themas.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
      <div class="alum-foot">
        <span class="alum-ruimte ${r.klasse}"><i></i>${esc(r.tekst)}</span>
        ${a.vol
          ? `<button class="alum-vraag" disabled>${t("lok.volknop")}</button>`
          : `<button class="alum-vraag" data-vraag-aan="${esc(a.id)}">${t("lok.vraagknop")}</button>`}
      </div>
    </article>`;
  }).join("");

  const telling = $("[data-alum-telling]");
  if (telling) {
    telling.textContent = t("lok.telling")
      .replace("{n}", lijst.length).replace("{totaal}", alumniLijst.length);
  }

  $$("[data-vraag-aan]", bak).forEach((b) => b.addEventListener("click", () => {
    const a = alumniLijst.find((x) => x.id === b.dataset.vraagAan);
    if (a) openLoketForm(a);
  }));
}

/* ═══════════════════════════════════════════════════════════════════
   HET VRAAGFORMULIER

   Twee stappen: eerst de vraag, dan wie je bent. De alumnus is al
   gekozen op de kaart, dus die vraag hoeft niet nog een keer.
   ═══════════════════════════════════════════════════════════════════ */
function openLoketForm(alumnus) {
  if ($("#form-root")) return;
  const steps = [t("lok.stap1"), t("lok.stap2")];
  const data = {
    themas: [], vraag: alumniVraagbegin ? alumniVraagbegin + " " : "",
    name: "", email: "", study: "",
  };
  let step = 0, done = false, sending = false, viaMail = false;

  const wrap = document.createElement("div");
  wrap.id = "form-root";
  document.body.appendChild(wrap);

  const genoeg = () => data.vraag.trim().length >= LOKET_MIN_TEKENS;
  const canNext = () => step === 0 ? genoeg() : !!(data.name.trim() && data.email.trim());

  const payload = () => ({
    formulier: "loketverzoek",
    alumnus: alumnus.id,
    naam: data.name.trim(),
    email: data.email.trim(),
    studie: data.study.trim(),
    themas: data.themas.join(", "),
    vraag: data.vraag.trim(),
  });

  function mailtoLink() {
    const p = payload();
    const body = [
      "ALUMNI DESK REQUEST",
      `Alumni: ${alumnus.id} (${alumnus.werk})`,
      "",
      "THE QUESTION",
      p.vraag,
      "",
      "STUDENT",
      `Name: ${p.naam}`,
      `Email: ${p.email}`,
      p.studie ? `Study: ${p.studie}` : null,
      p.themas ? `Themes: ${p.themas}` : null,
    ].filter((r) => r !== null).join("\n");
    return mailtoFallback(`Alumni request via Impact Connect, ${p.naam}`, body);
  }

  function bodyFor() {
    if (step === 0) {
      const over = LOKET_MIN_TEKENS - data.vraag.trim().length;
      return `
        <!-- Ook hier geen naam en geen monogram: wie het is hoort de student
             pas te weten als wij de introductie maken. Wat iemand doet is
             genoeg om te weten aan wie je schrijft. -->
        <div class="lok-wie">
          <div>
            <div class="werk-nu">${esc(alumnus.werk || "")}</div>
            ${alumnus.eerder ? `<div class="werk-eerder">${t("lok.eerder")} ${esc(alumnus.eerder)}</div>` : ""}
          </div>
        </div>
        <label class="chip-label">${t("lok.themas")} <span style="font-weight:400;color:#999">${t("form.optioneel")}</span></label>
        <div class="chip-row">${LOKET_ONDERWERPEN.map((o) =>
          `<button type="button" class="chip${data.themas.includes(o) ? " on" : ""}" data-lokthema="${esc(o)}">${esc(t("lok.ond." + o) || o)}</button>`).join("")}</div>
        <div class="form-stack" style="margin-top:22px">
          <div><label>${t("lok.vraag")}</label>
            <textarea id="a-vraag" rows="6" placeholder="${esc(t("lok.vraag.hint"))}">${esc(data.vraag)}</textarea></div>
          <p class="form-note" id="a-teller">${over > 0
            ? t("lok.kort").replace("{n}", over)
            : t("lok.langgenoeg")}</p>
        </div>`;
    }
    return `<div class="form-stack">
      <div><label>${t("form.naam")}</label><input id="a-name" placeholder="${esc(t("form.naam.hint"))}" value="${esc(data.name)}"></div>
      <div><label>${t("form.email")}</label><input id="a-email" placeholder="you@students.uu.nl" value="${esc(data.email)}"></div>
      <div><label>${t("al.studie")} <span style="font-weight:400;color:#999">${t("form.optioneel")}</span></label>
        <input id="a-study" placeholder="${esc(t("al.studie.hint"))}" value="${esc(data.study)}"></div>
      <p class="form-note">${t("lok.akkoord")}</p>
    </div>`;
  }

  function render() {
    const inner = done ? `
      <div class="modal-done">
        <div class="tick">${icon("Check", 32, { color: "#C2683A" })}</div>
        <h3>${viaMail ? t("al.klaar.mail") : t("al.klaar")}, ${esc(data.name.split(" ")[0] || t("form.jij"))}</h3>
        ${viaMail ? `
          <p>${t("form.viamail")}</p>
          <p style="font-size:13px;color:#777">${t("al.viamail.niets")
            .replace("{opnieuw}", `<a href="${mailtoLink()}">${t("al.mailopnieuw")}</a>`)
            .replace("{adres}", `<a href="mailto:${CONTACT_MAIL}">${CONTACT_MAIL}</a>`)}</p>`
        : `<p>${t("lok.gelukt")}</p>`}
        <button class="btn-next" data-close>${t("form.terug")}</button>
      </div>` : `
      <div class="progress">${steps.map((_, i) => `<i class="${i <= step ? "on" : ""}"></i>`).join("")}</div>
      <div class="modal-body">
        <h3>${esc(steps[step])}</h3>
        <p class="step-of">${t("form.stapvan").replace("{n}", step + 1).replace("{totaal}", steps.length)}</p>
        ${bodyFor()}
      </div>
      <div class="modal-foot">
        <button class="btn-text" id="a-back">${step === 0 ? t("form.annuleer") : "← " + t("form.vorige")}</button>
        ${step < steps.length - 1
          ? `<button class="btn-next" id="a-next"${canNext() ? "" : " disabled"}>${t("form.verder")} ${icon("ChevronRight", 16)}</button>`
          : `<button class="btn-next finish" id="a-submit"${canNext() ? "" : " disabled"}>${icon("Mail", 17)} ${t("lok.verstuur")}</button>`}
      </div>`;

    wrap.innerHTML = `
      <div class="modal-overlay" data-close></div>
      <div class="modal-wrap">
        <div class="modal" role="dialog" aria-label="${esc(t("lok.titel"))}">
          <div class="modal-head">
            <div class="t">${bridgeMark(26, "#13352A")}<strong>${t("lok.titel")}</strong></div>
            <button class="icon-btn" data-close aria-label="${esc(t("sluiten"))}">${icon("X", 17)}</button>
          </div>
          ${inner}
        </div>
      </div>`;
    bind();
  }

  function bind() {
    $$("[data-close]", wrap).forEach((el) => el.addEventListener("click", () => wrap.remove()));

    $$("[data-lokthema]", wrap).forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.lokthema;
      data.themas = data.themas.includes(v)
        ? data.themas.filter((x) => x !== v) : [...data.themas, v];
      render();
    }));

    // De teller onder het tekstvak werkt zonder opnieuw te tekenen: anders
    // springt de cursor bij elke aanslag naar het einde van de tekst.
    const vraagveld = $("#a-vraag", wrap);
    if (vraagveld) vraagveld.addEventListener("input", () => {
      data.vraag = vraagveld.value;
      const over = LOKET_MIN_TEKENS - data.vraag.trim().length;
      const teller = $("#a-teller", wrap);
      if (teller) teller.textContent = over > 0 ? t("lok.kort").replace("{n}", over) : t("lok.langgenoeg");
      const knop = $("#a-next", wrap);
      if (knop) knop.disabled = !canNext();
    });

    [["name", "a-name"], ["email", "a-email"], ["study", "a-study"]].forEach(([sleutel, id]) => {
      const el = $("#" + id, wrap);
      if (!el) return;
      el.addEventListener("input", () => {
        data[sleutel] = el.value;
        const knop = $("#a-submit", wrap);
        if (knop) knop.disabled = !canNext();
      });
    });

    const terug = $("#a-back", wrap);
    if (terug) terug.addEventListener("click", () => {
      if (step === 0) return wrap.remove();
      step--; render();
    });

    const verder = $("#a-next", wrap);
    if (verder) verder.addEventListener("click", () => { if (canNext()) { step++; render(); } });

    const versturen = $("#a-submit", wrap);
    if (versturen) versturen.addEventListener("click", async () => {
      if (sending || !canNext()) return;
      sending = true;
      versturen.disabled = true;
      versturen.textContent = t("form.versturen");

      const ok = await sendForm(payload());
      if (!ok) { viaMail = true; window.location.href = mailtoLink(); }
      done = true; sending = false;
      render();
    });
  }

  render();
}

/* ═══════════════════════════════════════════════════════════════════
   MENUKNOP OP SMALLE SCHERMEN

   De knop staat alleen in beeld onder de 900px (zie styles.css). Hij
   klapt het menu open en dicht, en sluit weer bij een klik op een link,
   bij Escape, en bij een klik ergens anders op de pagina.
   ═══════════════════════════════════════════════════════════════════ */
function initMenu() {
  const knop = $("[data-nav-toggle]");
  const kop = $(".site-header");
  if (!knop || !kop) return;

  const teken = () => {
    const open = kop.classList.contains("menu-open");
    knop.innerHTML = icon(open ? "X" : "Menu", 22);
    knop.setAttribute("aria-expanded", open ? "true" : "false");
  };
  const zet = (open) => { kop.classList.toggle("menu-open", open); teken(); };

  teken();
  knop.addEventListener("click", () => zet(!kop.classList.contains("menu-open")));

  // Doorklikken naar een andere pagina hoort het menu te sluiten. De knop
  // die het afspraakvenster opent ook: anders staat het menu er open achter.
  $$(".site-nav a, .site-nav button").forEach((el) =>
    el.addEventListener("click", () => zet(false)));

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") zet(false); });
  document.addEventListener("click", (e) => {
    if (kop.classList.contains("menu-open") && !kop.contains(e.target)) zet(false);
  });
  // Draait iemand zijn telefoon en past het menu weer op één regel, dan
  // moet de open-stand eraf; anders blijft het paneel hangen.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) zet(false);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   LINKEDIN

   Twee plekken: een klein icoontje onder elke naam op de over-onspagina,
   en de vaste pagina van Impact Connect onderaan elke pagina. De adressen
   staan in data.js. Is er geen adres, dan komt er ook geen link; zo kan
   er nooit een icoontje staan dat nergens heen gaat.
   ═══════════════════════════════════════════════════════════════════ */
function initLinkedIn() {
  const ic = (typeof LINKEDIN_IMPACT_CONNECT === "string" ? LINKEDIN_IMPACT_CONNECT : "").trim();
  const el = $("[data-linkedin-ic]");
  if (el && ic) {
    el.href = ic;
    el.target = "_blank";
    el.rel = "noreferrer";
    el.innerHTML = `${icon("LinkedIn", 15)} LinkedIn`;
    el.hidden = false;
  }

  const team = (typeof LINKEDIN_TEAM === "object" && LINKEDIN_TEAM) || {};
  $$(".team-grid .name").forEach((naam) => {
    const adres = (team[naam.textContent.trim()] || "").trim();
    if (!adres) return;
    const a = document.createElement("a");
    a.className = "team-li";
    a.href = adres;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.setAttribute("aria-label", `${naam.textContent.trim()} op LinkedIn`);
    a.innerHTML = icon("LinkedIn", 16);
    naam.appendChild(a);
  });
}
