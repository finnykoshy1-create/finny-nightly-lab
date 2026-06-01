const $ = (id) => document.getElementById(id);

const fields = [
  'date',
  'prayerFocus',
  'scripture',
  'storeTop3',
  'inventoryWatch',
  'delegation',
  'familyAction',
  'healthAction',
  'finishTrigger'
];

const defaultDate = new Date().toISOString().slice(0, 10);
$('date').value = defaultDate;

function splitCsv(value) {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function getState() {
  return Object.fromEntries(fields.map((f) => [f, $(f).value.trim()]));
}

function renderCard(data) {
  const top3 = splitCsv(data.storeTop3);
  const watch = splitCsv(data.inventoryWatch);
  const delegation = splitCsv(data.delegation);

  const output = $('card-output');
  output.innerHTML = `
    <h3>Daily Rhythm Card — ${data.date || 'No date set'}</h3>
    <div class="block"><strong>🙏 Prayer Focus:</strong> ${data.prayerFocus || '—'}</div>
    <div class="block"><strong>📖 Truth Anchor:</strong> ${data.scripture || '—'}</div>

    <div class="block">
      <strong>🏪 Store Top 3 Outcomes</strong>
      <ul>${top3.length ? top3.map((x) => `<li>${x}</li>`).join('') : '<li>—</li>'}</ul>
    </div>

    <div class="block">
      <strong>📦 Inventory Watch</strong>
      <ul>${watch.length ? watch.map((x) => `<li>${x}</li>`).join('') : '<li>—</li>'}</ul>
    </div>

    <div class="block">
      <strong>🤝 Delegation Moves</strong>
      <ul>${delegation.length ? delegation.map((x) => `<li>${x}</li>`).join('') : '<li>—</li>'}</ul>
    </div>

    <div class="block"><strong>🏠 Family Leadership:</strong> ${data.familyAction || '—'}</div>
    <div class="block"><strong>💪 Health Non-Negotiable:</strong> ${data.healthAction || '—'}</div>
    <div class="block"><strong>✅ Finish Trigger:</strong> ${data.finishTrigger || '—'}</div>
  `;
}

function toPlainText(data) {
  const lines = [
    `Daily Rhythm Card — ${data.date || 'No date set'}`,
    `Prayer Focus: ${data.prayerFocus || '—'}`,
    `Truth Anchor: ${data.scripture || '—'}`,
    `Store Top 3: ${splitCsv(data.storeTop3).join(' | ') || '—'}`,
    `Inventory Watch: ${splitCsv(data.inventoryWatch).join(' | ') || '—'}`,
    `Delegation Moves: ${splitCsv(data.delegation).join(' | ') || '—'}`,
    `Family Leadership: ${data.familyAction || '—'}`,
    `Health Non-Negotiable: ${data.healthAction || '—'}`,
    `Finish Trigger: ${data.finishTrigger || '—'}`
  ];

  return lines.join('\n');
}

$('card-form').addEventListener('submit', (e) => {
  e.preventDefault();
  renderCard(getState());
});

$('saveBtn').addEventListener('click', () => {
  const state = getState();
  localStorage.setItem('tropicalHutDailyRhythmCard', JSON.stringify(state));
  renderCard(state);
  alert('Saved locally on this browser.');
});

$('loadBtn').addEventListener('click', () => {
  const raw = localStorage.getItem('tropicalHutDailyRhythmCard');
  if (!raw) {
    alert('No saved card found yet.');
    return;
  }

  const data = JSON.parse(raw);
  fields.forEach((f) => {
    $(f).value = data[f] || '';
  });

  renderCard(getState());
});

$('copyBtn').addEventListener('click', async () => {
  const text = toPlainText(getState());

  try {
    await navigator.clipboard.writeText(text);
    alert('Copied card text to clipboard.');
  } catch {
    alert('Clipboard blocked by browser. Your card is shown on screen; you can copy manually.');
  }
});

// First paint
renderCard(getState());
