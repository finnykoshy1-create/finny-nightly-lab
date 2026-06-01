const scriptures = [
  "Joshua 24:15 — As for me and my house, we will serve the Lord.",
  "Deuteronomy 6:6-7 — Impress God’s words on your children.",
  "Psalm 127:1 — Unless the Lord builds the house, builders labor in vain.",
  "Galatians 6:9 — Do not grow weary in doing good.",
  "Ephesians 5:15-16 — Make the best use of time.",
  "Colossians 3:23 — Work heartily, as for the Lord.",
  "Proverbs 3:5-6 — Trust in the Lord with all your heart."
];

const spousePrompts = [
  "What made you feel most supported by me this week?",
  "What’s one thing I can carry for you this week to lighten your load?",
  "Where did we feel most united this week, and how can we repeat that?",
  "What should we protect on the calendar to keep our marriage healthy?",
  "Where are you feeling stress that I might not be seeing?"
];

const kidPrompts = [
  "Where did you see God help you this week?",
  "What was the best part of this week at home or school?",
  "Who can we encourage or pray for as a family this week?",
  "What is one brave thing you want to try this week?",
  "What should our family celebrate this weekend?"
];

const els = {
  meetingDate: document.getElementById("meetingDate"),
  meetingTime: document.getElementById("meetingTime"),
  scripture: document.getElementById("scripture"),
  top3: document.getElementById("top3"),
  marriage: document.getElementById("marriage"),
  kids: document.getElementById("kids"),
  store: document.getElementById("store"),
  health: document.getElementById("health"),
  finishTrigger: document.getElementById("finishTrigger"),
  generateBtn: document.getElementById("generateBtn"),
  saveBtn: document.getElementById("saveBtn"),
  loadBtn: document.getElementById("loadBtn"),
  copyBtn: document.getElementById("copyBtn"),
  icsBtn: document.getElementById("icsBtn"),
  planCard: document.getElementById("planCard"),
  drawPromptBtn: document.getElementById("drawPromptBtn"),
  spousePrompt: document.getElementById("spousePrompt"),
  kidPrompt: document.getElementById("kidPrompt")
};

const storageKey = "family-council-builder-v1";
let latestPlanText = "";

function init() {
  scriptures.forEach((text, idx) => {
    const opt = document.createElement("option");
    opt.value = text;
    opt.textContent = text;
    if (idx === 0) opt.selected = true;
    els.scripture.appendChild(opt);
  });

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  els.meetingDate.value = dateStr;
  drawPrompts();

  els.generateBtn.addEventListener("click", () => {
    latestPlanText = generatePlanText(getFormData());
    renderPlan(latestPlanText);
  });

  els.saveBtn.addEventListener("click", () => {
    const data = getFormData();
    localStorage.setItem(storageKey, JSON.stringify(data));
    latestPlanText = generatePlanText(data);
    renderPlan(`${latestPlanText}\n\n✅ Saved locally.`);
  });

  els.loadBtn.addEventListener("click", () => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      renderPlan("No saved plan found yet. Fill fields and click Save Locally first.", true);
      return;
    }
    const saved = JSON.parse(raw);
    setFormData(saved);
    latestPlanText = generatePlanText(saved);
    renderPlan(`${latestPlanText}\n\n✅ Loaded last saved plan.`);
  });

  els.copyBtn.addEventListener("click", async () => {
    if (!latestPlanText) {
      latestPlanText = generatePlanText(getFormData());
    }
    try {
      await navigator.clipboard.writeText(latestPlanText);
      renderPlan(`${latestPlanText}\n\n✅ Copied to clipboard.`);
    } catch {
      renderPlan(`${latestPlanText}\n\nClipboard blocked. Select and copy manually.`);
    }
  });

  els.icsBtn.addEventListener("click", () => {
    const data = getFormData();
    const ics = buildIcs(data);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `family-council-${data.meetingDate || "event"}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    latestPlanText = generatePlanText(data);
    renderPlan(`${latestPlanText}\n\n✅ Calendar file downloaded.`);
  });

  els.drawPromptBtn.addEventListener("click", drawPrompts);

  latestPlanText = generatePlanText(getFormData());
  renderPlan(latestPlanText);
}

function drawPrompts() {
  els.spousePrompt.textContent = spousePrompts[Math.floor(Math.random() * spousePrompts.length)];
  els.kidPrompt.textContent = kidPrompts[Math.floor(Math.random() * kidPrompts.length)];
}

function getFormData() {
  return {
    meetingDate: els.meetingDate.value,
    meetingTime: els.meetingTime.value,
    scripture: els.scripture.value,
    top3: els.top3.value.trim(),
    marriage: els.marriage.value.trim(),
    kids: els.kids.value.trim(),
    store: els.store.value.trim(),
    health: els.health.value.trim(),
    finishTrigger: els.finishTrigger.value.trim(),
    spousePrompt: els.spousePrompt.textContent,
    kidPrompt: els.kidPrompt.textContent
  };
}

function setFormData(data) {
  els.meetingDate.value = data.meetingDate || "";
  els.meetingTime.value = data.meetingTime || "";
  els.scripture.value = data.scripture || scriptures[0];
  els.top3.value = data.top3 || "";
  els.marriage.value = data.marriage || "";
  els.kids.value = data.kids || "";
  els.store.value = data.store || "";
  els.health.value = data.health || "";
  els.finishTrigger.value = data.finishTrigger || "";
  els.spousePrompt.textContent = data.spousePrompt || "—";
  els.kidPrompt.textContent = data.kidPrompt || "—";
}

function normalizedList(raw) {
  if (!raw) return ["(add your top outcomes)"];
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return ["(add your top outcomes)"];
  return lines.map((line, idx) => line.match(/^\d+[.)]/) ? line : `${idx + 1}. ${line}`);
}

function generatePlanText(data) {
  const outcomes = normalizedList(data.top3);
  const dateLabel = formatDateTime(data.meetingDate, data.meetingTime);

  return [
    `🏡 Family Council Plan — ${dateLabel}`,
    "",
    "0:00-2:00 OPEN IN PRAYER",
    `Scripture: ${data.scripture || "(choose a verse)"}`,
    "",
    "2:00-8:00 GRATITUDE ROUND",
    "Each person shares one win + one thanks to God.",
    "",
    "8:00-15:00 THIS WEEK'S TOP 3 OUTCOMES",
    ...outcomes.map((x) => `- ${x.replace(/^\d+[.)]?\s*/, "")}`),
    "",
    "15:00-21:00 HOUSE LEADERSHIP CHECKPOINTS",
    `- Marriage: ${data.marriage || "(define one encouragement action)"}`,
    `- Kids discipleship: ${data.kids || "(define one discipleship moment)"}`,
    `- Tropical Hut: ${data.store || "(define one store checkpoint)"}`,
    `- Dad health: ${data.health || "(define one body stewardship commitment)"}`,
    "",
    "21:00-24:00 PROMPT MOMENT",
    `- Spouse question: ${data.spousePrompt || "(draw prompt)"}`,
    `- Kid question: ${data.kidPrompt || "(draw prompt)"}`,
    "",
    "24:00-25:00 CLOSE + NEXT STEP",
    `If-Then finish trigger: ${data.finishTrigger || "If it's 8:30 PM, then set tomorrow's top task before phone time."}`,
    "",
    "✅ Family finish line: End with a 20-second blessing prayer over your home."
  ].join("\n");
}

function renderPlan(text, isEmpty = false) {
  els.planCard.textContent = text;
  els.planCard.classList.toggle("empty", isEmpty);
}

function formatDateTime(dateString, timeString) {
  if (!dateString) return "(set meeting date/time)";
  const date = new Date(`${dateString}T${timeString || "19:30"}`);
  if (Number.isNaN(date.getTime())) return `${dateString} ${timeString || ""}`.trim();
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function toUtcStamp(dateObj) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${dateObj.getUTCFullYear()}${pad(dateObj.getUTCMonth() + 1)}${pad(dateObj.getUTCDate())}T${pad(dateObj.getUTCHours())}${pad(dateObj.getUTCMinutes())}${pad(dateObj.getUTCSeconds())}Z`;
}

function sanitizeIcsText(text) {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

function buildIcs(data) {
  const startLocal = new Date(`${data.meetingDate || new Date().toISOString().slice(0, 10)}T${data.meetingTime || "19:30"}:00`);
  const endLocal = new Date(startLocal.getTime() + 25 * 60 * 1000);
  const stamp = new Date();
  const uid = `family-council-${Date.now()}@finny-nightly-lab`;
  const description = generatePlanText(data).replace(/<[^>]+>/g, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Finny Nightly Lab//Family Council Builder//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUtcStamp(stamp)}`,
    `DTSTART:${toUtcStamp(startLocal)}`,
    `DTEND:${toUtcStamp(endLocal)}`,
    `SUMMARY:${sanitizeIcsText("Family Council (25-min)")}`,
    `DESCRIPTION:${sanitizeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

init();
