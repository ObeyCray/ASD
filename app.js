// ─── CUSTOM CURSOR & MAGNETIC EFFECT ─────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow
  gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    gsap.set(cursor, { x: cursorX, y: cursorY });
    gsap.set(follower, { x: followerX, y: followerY });
  });

  // Magnetic elements
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach(mag => {
    mag.addEventListener('mouseenter', () => {
      gsap.to(follower, { width: 60, height: 60, borderColor: '#eab308', duration: 0.3 });
    });
    mag.addEventListener('mouseleave', () => {
      gsap.to(follower, { width: 40, height: 40, borderColor: 'rgba(255,255,255,0.2)', duration: 0.3 });
      gsap.to(mag, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    });
    mag.addEventListener('mousemove', (e) => {
      const rect = mag.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(mag, { x: relX * 0.2, y: relY * 0.2, duration: 0.3, ease: 'power2.out' });
    });
  });
}

// ─── CLOCK ───────────────────────────────────────────────────
function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) {
    const now = new Date();
    clock.innerText = now.toLocaleTimeString('de-DE') + ' LOCAL';
  }
}
setInterval(updateClock, 1000);
updateClock();

// ─── HELPERS ─────────────────────────────────────────────────
const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl2br = s => s.replace(/\n/g, '<br>');

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj, path, val) {
  const parts = path.split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
  o[parts[parts.length - 1]] = val;
}

// ─── INHALTE (STANDARD-DATEN) ────────────────────────────────
// Alle Seiteninhalte. Über den Bearbeiten-Modus (Login nötig) änderbar;
// Änderungen landen im localStorage. Dieser Block ist der Auslieferungs-
// zustand und greift, solange nichts überschrieben wurde.
const DEFAULT_CONTENT = {

  vorschriften: [
    { text: 'Aus Helikoptern darf ausschließlich von Helikopter zu Helikopter geschossen werden. Beschuss von Personen oder Fahrzeugen ist verboten. Nur gezielter Beschuss des Heckrotors ist erlaubt.', sub: 'AUSNAHME: Wird Feuer auf unsere Einheit eröffnet, ist Gegenfeuer zur Selbstverteidigung zulässig.' },
    { text: 'Der Helikopter ist maximal mit 2 Personen zu besetzen.', sub: '' },
    { text: 'Pro Einsatzsituation ist maximal ein Helikopter der A.S.D. erlaubt. Ein Helikopter darf nicht nachbesetzt werden.', sub: '' },
    { text: 'Wenn nach 3 Sekunden zum Helikopter kein Sichtkontakt mehr besteht, muss der "Lock" zum Fahrzeug abgebrochen werden.', sub: '' },
    { text: 'Landeprotokolle:', sub: 'VERBOTEN: Im SG, hinter den Zellen, auf Grünflächen vor/um PD.\nERLAUBT: Ausschließlich auf Dachflächen oder in abgesperrten Bereichen.' },
    { text: 'Ab 20 Uhr bis 0 Uhr ist der Helikopter mit Doppelbesatzung zu fliegen (Pilot & Co. Pilot).', sub: '' },
    { text: 'Entwickelt sich eine Luft-Boden 10-80 zu einer Luft-Luft 10-80, darf direkt der Beschuss auf den Heckrotor 3-mal angekündigt und danach aufgenommen werden.', sub: '' },
    { text: 'Ab dem Rang Flight Officer ist es gestattet, eine SMG zu nutzen.', sub: '' },
    { text: 'Ab dem Rang Flight Officer dürfen auf allen Waffen Aufsätze getragen werden.', sub: '' },
    { text: 'Es ist gestattet, jede Art von Raub/Diebstahl anzufliegen, solange es verhältnismäßig bleibt:', sub: 'VSTR vor Ort -> NICHT anfliegen (Nicht verhältnismäßig)\nBF vor Ort -> Anfliegen erlaubt, solange es nicht zu oft passiert.' }
  ],

  kleidung: [
    {
      group: 'MÄNNLICH',
      blocks: [
        { title: 'NORMAL', badge: 'STANDARD', rows: [
          { l: 'Torso', v: '1067 (0/18)' }, { l: 'Weste', v: '159 (2/9)' },
          { l: 'Hose', v: '476 (16/18)' }, { l: 'T-Shirt', v: '122' },
          { l: 'Arme', v: '30 (0/10)' }, { l: 'Schuhe', v: '51' }
        ]},
        { title: 'HOLSTER', badge: 'TACTICAL', rows: [
          { l: 'Torso', v: '1067 (0/18)' }, { l: 'Weste', v: '159 (2/9)' },
          { l: 'Hose', v: '476 (16/18)' }, { l: 'T-Shirt', v: '15' },
          { l: 'Kette', v: '325 (0/2)' }, { l: 'Arme', v: '30 (0/10)' },
          { l: 'Schuhe', v: '51' }
        ]}
      ]
    },
    {
      group: 'WEIBLICH',
      blocks: [
        { title: 'NORMAL', badge: 'STANDARD', rows: [
          { l: 'Torso', v: '1610 (4/16)' }, { l: 'Weste', v: '219 (1/2)' },
          { l: 'Hose', v: '326' }, { l: 'T-Shirt', v: '152' },
          { l: 'Arme', v: '33' }, { l: 'Schuhe', v: '27' }
        ]},
        { title: 'HOLSTER', badge: 'TACTICAL', rows: [
          { l: 'Torso', v: '1610 (4/16)' }, { l: 'Weste', v: '219 (1/2)' },
          { l: 'Hose', v: '326' }, { l: 'T-Shirt', v: '-' },
          { l: 'Kette', v: '-' }, { l: 'Arme', v: '33' },
          { l: 'Schuhe', v: '27' }
        ]}
      ]
    }
  ],

  fahrzeuge: [
    { name: 'CONADA', img: 'assets/Conada.png', special: false, specs: [
      'Steigt sehr schnell', 'Sinkt langsam',
      'Sehr gut geschützt (ummantelter Heckrotor)', 'Beschleunigt sehr gut'
    ]},
    { name: 'SUPERVOLITO', img: 'assets/Supervolito.png', special: false, specs: [
      'Standard Helikopter', 'Steigt langsam, sinkt schnell',
      'Nicht besonders gut geschützt', 'Sehr wendig, moderate Beschleunigung'
    ]},
    { name: 'BLACK HAWK', img: 'assets/Black%20Hawk.png', special: true, specs: [
      'Transportiert 6 Personen', 'Steigt langsam, sinkt schnell',
      'Schlechter geschützt als Conada',
      'REQUIREMENT: Spezielle Fortbildung', 'DEPLOYMENT: Nur durch SWAT/Leitung'
    ]}
  ],

  folierung: {
    title: 'SCHWARZE FOLIERUNG',
    text: 'Die schwarze Helikopter-Folierung gebührt ausschließlich dem Director und Co-Director. Allen anderen Rängen ist das Führen der schwarzen Folierung untersagt.'
  },

  ausbildung: {
    module: [
      { title: 'MODUL 01 // THEORIE', text: 'Grundlagenwissen für A.S.D.-Piloten. Vorschriften, Funksprüche und Verhaltensregeln.', rows: [] },
      { title: 'MODUL 02 // STRECKE 1', text: '', rows: [
        { l: 'TIME LIMIT', v: '03:30 MIN' }, { l: 'PENALTY', v: '+10 SEK / HIT' }, { l: 'MIN SPEED', v: '100 KM/H' }
      ]},
      { title: 'MODUL 03 // STRECKE 2', text: '', rows: [
        { l: 'TIME LIMIT', v: '02:30 MIN' }, { l: 'PENALTY', v: '+10 SEK / HIT' }, { l: 'MIN SPEED', v: '100 KM/H' }
      ]},
      { title: 'MODUL 04 // TAKTIK', text: 'Luft-Boden Verfolgungsjagd. Praktische Anwendung der Tracking-Fähigkeiten.', rows: [] }
    ],
    raenge: [
      { num: 'R1', name: 'Flight Student' },
      { num: 'R2', name: 'Flight Officer' },
      { num: 'R3', name: 'Senior Flight Officer // NEU' },
      { num: 'R4', name: 'Co-Director' },
      { num: 'R5', name: 'Director' }
    ],
    raengeHinweis: 'HINWEIS: Für den Senior Flight Officer wird KEINE neue Strecke eingeführt. Es werden ausschließlich die vorhandenen Flugstrecken (Strecke 1 & Strecke 2) angeboten — weitere Flugstrecken sind nicht vorgesehen.',
    alert: {
      title: 'MANDATORY DIRECTIVE: Spezielle Einsatzlagen',
      text: 'Innerhalb von zwei Wochen muss eine Fortbildung zu "speziellen Einsatzlagen" erfolgen. Diese Fortbildung ist essentiell. Wer dies nicht tut, besteht die Ausbildung der A.S.D. nicht.'
    }
  },

  flugsteuerung: {
    text: 'Das sind reine Empfehlungen. Jeder Pilot fliegt anders, aber dies ist die anfängerfreundlichste und komfortabelste Steuerung.',
    alert: {
      title: 'CRITICAL ERROR AVOIDANCE',
      text: 'Es darf kein rotes Ausrufezeichen in der Keybind-Übersicht vorhanden sein. Alles MUSS belegt sein.'
    }
  },

  fortbildung: [
    { title: 'BLACK HAWK', badge: 'RESTRICTED', text: 'Zertifizierung für den Transporthelikopter. Einsatzfreigabe ausschließlich durch SWAT oder Leitungsebene.' },
    { title: 'SPEZIELLE EINSATZLAGEN', badge: 'PFLICHT', text: 'Musterverhalten von Piloten. Muss von jedem Flight Student innerhalb von 14 Tagen absolviert werden.' }
  ]
};

// ─── DATENHALTUNG ────────────────────────────────────────────
// Zwei Betriebsarten, automatisch erkannt:
//
// 1) SERVER-MODUS (Tommy lässt server.js laufen):
//    Die Daten liegen direkt beim Server (data.json + evals.json).
//    Speichern im Intern-/Bearbeiten-Bereich schreibt sofort auf den
//    Server -> gilt sofort für alle Besucher. Kein Export nötig.
//
// 2) STATISCH (kein server.js, z.B. file:// oder reines Static-Hosting):
//    data.json wird nur gelesen; Änderungen liegen im localStorage
//    und werden über "Veröffentlichen" als data.json exportiert.
let PUBLISHED = null;
let SERVER_MODE = false;

async function fetchPublished() {
  // 1) Server-API probieren
  try {
    const res = await fetch('api/data', { cache: 'no-store' });
    if (res.ok) {
      const d = await res.json();
      if (d && typeof d === 'object' && 'content' in d) {
        PUBLISHED = d;
        SERVER_MODE = true;
        return;
      }
    }
  } catch {}
  // 2) Statische data.json
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (res.ok) PUBLISHED = await res.json();
  } catch {} // z.B. file:// -> Fallback auf eingebaute Defaults
}

function authHash() { return sessionStorage.getItem('asd_auth'); }

async function pushServerData() {
  if (!SERVER_MODE || !authHash()) return false;
  try {
    const res = await fetch('api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-ASD-Auth': authHash() },
      body: JSON.stringify({ content: CONTENT, team: getTeam() })
    });
    if (res.ok) {
      const r = await res.json();
      if (PUBLISHED) {
        PUBLISHED.updated = r.updated;
        PUBLISHED.content = JSON.parse(JSON.stringify(CONTENT));
      }
      return true;
    }
  } catch {}
  console.warn('A.S.D.: Speichern auf dem Server fehlgeschlagen');
  return false;
}

async function pushServerEvals() {
  if (!SERVER_MODE || !authHash()) return false;
  try {
    const res = await fetch('api/evals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-ASD-Auth': authHash() },
      body: JSON.stringify(getEvals())
    });
    return res.ok;
  } catch { return false; }
}

async function pullServerEvals() {
  if (!SERVER_MODE || !authHash()) return false;
  try {
    const res = await fetch('api/evals', { headers: { 'X-ASD-Auth': authHash() }, cache: 'no-store' });
    if (res.ok) {
      const evals = await res.json();
      if (Array.isArray(evals)) {
        localStorage.setItem('asd_evals', JSON.stringify(evals));
        return true;
      }
    }
  } catch {}
  return false;
}

function loadContent() {
  if (SERVER_MODE && PUBLISHED && PUBLISHED.content) {
    return JSON.parse(JSON.stringify(PUBLISHED.content)); // Server ist die Wahrheit
  }
  try {
    const stored = JSON.parse(localStorage.getItem('asd_content'));
    if (stored && stored.data) {
      if (!PUBLISHED || stored.basedOn === PUBLISHED.updated) return stored.data;
      localStorage.removeItem('asd_content'); // veröffentlichter Stand ist neuer
    }
  } catch {}
  if (PUBLISHED && PUBLISHED.content) return JSON.parse(JSON.stringify(PUBLISHED.content));
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT));
}
function saveContent() {
  localStorage.setItem('asd_content', JSON.stringify({
    basedOn: PUBLISHED ? PUBLISHED.updated : null,
    data: CONTENT
  }));
}

let CONTENT = JSON.parse(JSON.stringify(DEFAULT_CONTENT)); // wird nach fetchPublished() neu geladen

// ─── BEARBEITEN-MODUS ────────────────────────────────────────
let EDIT_MODE = false;
let CURRENT_PAGE = 'startseite';
const EDITABLE_PAGES = ['vorschriften', 'kleidung', 'fahrzeuge', 'ausbildung', 'fortbildung', 'flugsteuerung'];

const ADD_TEMPLATES = {
  rule:  () => ({ text: 'Neue Vorschrift', sub: '' }),
  row:   () => ({ l: 'LABEL', v: 'WERT' }),
  spec:  () => 'Neue Eigenschaft',
  veh:   () => ({ name: 'NEUER HELI', img: 'assets/', special: false, specs: ['Eigenschaft 1'] }),
  modul: () => ({ title: 'MODUL XX // NEU', text: 'Beschreibung', rows: [] }),
  rang:  () => ({ num: 'R?', name: 'Neuer Rang' }),
  cert:  () => ({ title: 'NEUE FORTBILDUNG', badge: 'INFO', text: 'Beschreibung' }),
  block: () => ({ title: 'NEU', badge: 'STANDARD', rows: [{ l: 'Torso', v: '-' }] }),
  group: () => ({ group: 'NEUE GRUPPE', blocks: [] })
};

// Editierbarer Text: im Bearbeiten-Modus contenteditable, sonst normal.
function E(path, val, cls = '') {
  const content = nl2br(esc(val));
  return EDIT_MODE
    ? `<span class="editable ${cls}" contenteditable="true" spellcheck="false" data-edit="${path}">${content}</span>`
    : `<span class="${cls}">${content}</span>`;
}
function DELBTN(path, idx) {
  return EDIT_MODE ? `<button class="x-del" data-del="${path}:${idx}" title="Löschen">✕</button>` : '';
}
function ADDBTN(path, tpl, label) {
  return EDIT_MODE ? `<button class="x-add" data-add="${path}" data-tpl="${tpl}">+ ${label}</button>` : '';
}

function collectEdits() {
  document.querySelectorAll('[data-edit]').forEach(el => {
    setPath(CONTENT, el.dataset.edit, el.innerText.trim());
  });
}

function bindEditControls() {
  if (!EDIT_MODE) return;
  document.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      collectEdits();
      const [path, idx] = btn.dataset.del.split(':');
      getPath(CONTENT, path).splice(+idx, 1);
      renderNow(CURRENT_PAGE);
    });
  });
  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      collectEdits();
      getPath(CONTENT, btn.dataset.add).push(ADD_TEMPLATES[btn.dataset.tpl]());
      renderNow(CURRENT_PAGE);
    });
  });
}

function updateEditBar() {
  const bar = document.getElementById('edit-bar');
  if (!bar) return;
  const show = !!getSession() && EDITABLE_PAGES.includes(CURRENT_PAGE);
  bar.style.display = show ? 'flex' : 'none';
  document.getElementById('eb-toggle').style.display = EDIT_MODE ? 'none' : '';
  document.getElementById('eb-actions').style.display = EDIT_MODE ? 'flex' : 'none';
}

function initEditBar() {
  document.getElementById('eb-toggle').addEventListener('click', () => {
    EDIT_MODE = true;
    renderNow(CURRENT_PAGE);
  });
  document.getElementById('eb-save').addEventListener('click', async () => {
    collectEdits();
    saveContent();
    EDIT_MODE = false;
    renderNow(CURRENT_PAGE);
    if (SERVER_MODE) {
      const ok = await pushServerData();
      if (!ok) alert('Achtung: Speichern auf dem Server fehlgeschlagen — die Änderungen liegen nur lokal in diesem Browser.');
    }
  });
  document.getElementById('eb-cancel').addEventListener('click', () => {
    CONTENT = loadContent();
    EDIT_MODE = false;
    renderNow(CURRENT_PAGE);
  });
}

// ─── INTERN: LOGIN ───────────────────────────────────────────
// Passwörter werden als SHA-256-Hash hinterlegt (kein Klartext im Code).
// Neuen Hash erzeugen: Seite öffnen, F12-Konsole, dann:
//   await asdHash('meinNeuesPasswort')
// und den ausgegebenen Hash hier eintragen.
// Standard-Passwort aktuell: asd2026
const ASD_USERS = [
  { name: 'Director',    hash: '1629feb4b5a5f5620601d0e0646699e503b523b67cbd61878fe28858d76e751f' },
  { name: 'Co-Director', hash: '1629feb4b5a5f5620601d0e0646699e503b523b67cbd61878fe28858d76e751f' }
];

async function asdHash(pass) {
  const data = new TextEncoder().encode('ASD//' + pass);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
window.asdHash = asdHash;

function getSession() { return sessionStorage.getItem('asd_user'); }

// ─── TEAM-DATEN ──────────────────────────────────────────────
const TEAM_ROLES = ['Director', 'Co-Director', 'Instructor', 'Officer', 'Student'];
const LEAD_ROLES = ['Director', 'Co-Director', 'Instructor'];

const DEFAULT_TEAM = [
  { id: 'pd111', callsign: 'PD-111', name: 'Vince Kowalski',        role: 'Director',    rank: 'Lieutenant II' },
  { id: 'pd236', callsign: 'PD-236', name: 'Harvey Nilo Navarro',   role: 'Co-Director', rank: 'Officer III' },
  { id: 'pd104', callsign: 'PD-104', name: 'Moritz Bauer',          role: 'Instructor',  rank: 'Lieutenant II' },
  { id: 'pd113', callsign: 'PD-113', name: 'David Leonel Kay',      role: 'Instructor',  rank: 'Lieutenant I' },
  { id: 'pd157', callsign: 'PD-157', name: 'Leano Cruelo',          role: 'Officer',     rank: 'Staff Sergeant' },
  { id: 'pd147', callsign: 'PD-147', name: 'Gabriel Joel Cronwell', role: 'Officer',     rank: 'Sergeant' },
  { id: 'pd109', callsign: 'PD-109', name: 'Yumiko Moriya',         role: 'Officer',     rank: 'Lieutenant II' },
  { id: 'pd159', callsign: 'PD-159', name: 'Miguel Stone',          role: 'Officer',     rank: 'Senior Officer' },
  { id: 'pd151', callsign: 'PD-151', name: 'Raven Black',           role: 'Officer',     rank: 'Senior Officer' },
  { id: 'pd262', callsign: 'PD-262', name: 'Jim Barns',             role: 'Student',     rank: 'Officer I' }
];

function isLeitung(role) { return LEAD_ROLES.includes(role); }
function getTeam() {
  if (SERVER_MODE && PUBLISHED && Array.isArray(PUBLISHED.team)) {
    return PUBLISHED.team.map(m => ({ ...m })); // Server ist die Wahrheit
  }
  try {
    const stored = JSON.parse(localStorage.getItem('asd_team'));
    if (stored && Array.isArray(stored.data)) {
      if (!PUBLISHED || stored.basedOn === PUBLISHED.updated) return stored.data;
      localStorage.removeItem('asd_team'); // veröffentlichter Stand ist neuer
    } else if (Array.isArray(stored)) {
      return stored; // altes Speicherformat
    }
  } catch {}
  if (PUBLISHED && Array.isArray(PUBLISHED.team)) return PUBLISHED.team.map(m => ({ ...m }));
  return DEFAULT_TEAM.map(m => ({ ...m }));
}
function saveTeam(team) {
  if (SERVER_MODE && PUBLISHED) PUBLISHED.team = team.map(m => ({ ...m }));
  localStorage.setItem('asd_team', JSON.stringify({
    basedOn: PUBLISHED ? PUBLISHED.updated : null,
    data: team
  }));
  pushServerData();
}

// ─── BEWERTUNGEN ─────────────────────────────────────────────
const RATING_CRITERIA = [
  { key: 'flug',    label: 'Flugverhalten' },
  { key: 'kamera',  label: 'Kameranutzung' },
  { key: 'selbst',  label: 'Selbstsicherheit' },
  { key: 'gewandt', label: 'Gewandtheit' },
  { key: 'funk',    label: 'Funkdisziplin' },
  { key: 'regeln',  label: 'Regelkenntnis' },
  { key: 'landung', label: 'Landetechnik' },
  { key: 'team',    label: 'Teamfähigkeit' }
];

function getEvals() {
  try { return JSON.parse(localStorage.getItem('asd_evals') || '[]'); }
  catch { return []; }
}
function saveEvals(evals) {
  localStorage.setItem('asd_evals', JSON.stringify(evals));
  pushServerEvals();
}

function evalStatus(rec) {
  const passed = rec.theorie && rec.s1.ok && rec.s2.ok && rec.einsatz.ok && rec.avg >= 5;
  return passed ? 'BESTANDEN' : 'OFFEN';
}

// ─── PAGE DATA ───────────────────────────────────────────────
const pages = {

  startseite: () => `
    <div class="hero">
      <div class="hero-content">
        <div class="hero-meta">00 // INITIATION</div>
        <h1 class="hero-title">
          <span class="line"><span>AIR SUPPORT</span></span>
          <span class="line"><span>DIVISION</span></span>
        </h1>
        <p class="hero-desc">Offizielles Handbuch der A.S.D.</p>
        <div class="hero-actions">
          <a href="#" class="btn btn-primary magnetic" data-page="vorschriften">Zu den Vorschriften</a>
          <a href="#" class="btn magnetic" data-page="ausbildung">Zur Ausbildung</a>
        </div>
      </div>
      <div class="hero-image">
        <video autoplay loop muted playsinline class="hero-video">
          <source src="assets/Conada Animation.mp4" type="video/mp4">
        </video>
        <div class="hero-video-overlay"></div>
      </div>
    </div>

    <div class="footer">
      <span>A.S.D. OP-COM SYSTEM</span>
      <span>V 3.0.0 // ENCRYPTED</span>
    </div>
  `,

  vorschriften: () => `
    <div class="page-header">
      <div class="ph-content">
        <div class="ph-tag">01 // PROTOCOLS</div>
        <h1 class="ph-title">Vorschriften</h1>
        <p class="ph-desc">Rules of Engagement und Einsatzrichtlinien.</p>
      </div>
    </div>

    <div class="rule-grid">
      ${CONTENT.vorschriften.map((r, i) => `
      <div class="rule-card">
        <div class="rule-id">${String(i + 1).padStart(2, '0')}</div>
        <div class="rule-info">
          <div class="rule-text">${E(`vorschriften.${i}.text`, r.text)}</div>
          ${(r.sub || EDIT_MODE) ? `<div class="rule-sub">${E(`vorschriften.${i}.sub`, r.sub)}</div>` : ''}
        </div>
        ${DELBTN('vorschriften', i)}
      </div>`).join('')}
    </div>
    ${EDIT_MODE ? `<div class="edit-actions">${ADDBTN('vorschriften', 'rule', 'Vorschrift')}</div>` : ''}
  `,

  kleidung: () => `
    <div class="page-header" style="background-image: url('https://lh3.googleusercontent.com/sitesv/AA5AbUBu6lP0uF-FiW5daQ3Z4aYcsmJlXWdBWgcQI_A9x5GzkdSSyLHLU-NLwpuAN1H_WB2fsIo-1e45_KbCsEGnFaH-i6QSpyVg2mo9p5tlNnE8x0loCQitUXNYaxW1X8wCl0oxZxZztp33S-Mb8IJ9HsPqhBKEgClUsTQZ0HEX3I264VtS7uLkGx-fdW0=w16383')">
      <div class="ph-content">
        <div class="ph-tag">02 // UNIFORMS</div>
        <h1 class="ph-title">Kleidung</h1>
        <p class="ph-desc">Zugelassene Loadouts. Strikte Einhaltung der IDs erforderlich.</p>
      </div>
    </div>

    ${CONTENT.kleidung.map((g, gi) => `
    <section class="section" ${gi === CONTENT.kleidung.length - 1 && !EDIT_MODE ? 'style="border-bottom:none;"' : ''}>
      <div class="section-meta">
        <div class="sm-title">${E(`kleidung.${gi}.group`, g.group)}</div>
      </div>
      <div class="section-content">
        <div class="data-grid">
          ${g.blocks.map((b, bi) => `
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">${E(`kleidung.${gi}.blocks.${bi}.title`, b.title)}</span>
              <span style="display:flex;align-items:center;gap:8px;">
                <span class="db-badge ${b.badge === 'TACTICAL' ? 'warn' : ''}">${E(`kleidung.${gi}.blocks.${bi}.badge`, b.badge)}</span>
                ${DELBTN(`kleidung.${gi}.blocks`, bi)}
              </span>
            </div>
            <div class="db-body">
              ${b.rows.map((row, ri) => `
              <div class="db-row">
                <span class="db-label">${E(`kleidung.${gi}.blocks.${bi}.rows.${ri}.l`, row.l)}</span>
                <span style="display:flex;align-items:center;gap:8px;">
                  ${E(`kleidung.${gi}.blocks.${bi}.rows.${ri}.v`, row.v)}
                  ${DELBTN(`kleidung.${gi}.blocks.${bi}.rows`, ri)}
                </span>
              </div>`).join('')}
              ${ADDBTN(`kleidung.${gi}.blocks.${bi}.rows`, 'row', 'Zeile')}
            </div>
          </div>`).join('')}
        </div>
        ${ADDBTN(`kleidung.${gi}.blocks`, 'block', 'Loadout')}
      </div>
    </section>`).join('')}
    ${EDIT_MODE ? `<div class="edit-actions">${ADDBTN('kleidung', 'group', 'Gruppe')}</div>` : ''}
  `,

  fahrzeuge: () => `
    <div class="page-header" style="background-image: url('https://lh3.googleusercontent.com/sitesv/AA5AbUCL7jXWYJ_JsZfnXdvvBRZuFAeENRLHOKfd-G0wxt_6j55cH1OsmsVP9cCX3xUqWpmgxIaVV9wQS8F0dfF5T0cLXpgvlQNPFtkuGqdDvHXH5QoQlwNKOf6JxuyDTlH_dlSelFn6F_JuLxqb-PL1FPk7l4gEsvwfZtoxLOVaTGfohLEwuYdNJMhLEVI=w16383')">
      <div class="ph-content">
        <div class="ph-tag">03 // FLEET</div>
        <h1 class="ph-title">Fahrzeuge</h1>
        <p class="ph-desc">Spezifikationen der Luftfahrzeuge.</p>
      </div>
    </div>

    <div class="veh-grid">
      ${CONTENT.fahrzeuge.map((v, vi) => `
      <div class="veh-card">
        <div class="veh-img" style="background-image: url('${esc(v.img)}')"></div>
        <div class="veh-info">
          <div class="veh-name ${v.special ? 'special' : ''}" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            ${E(`fahrzeuge.${vi}.name`, v.name)}
            ${DELBTN('fahrzeuge', vi)}
          </div>
          ${v.specs.map((s, si) => `
          <div class="veh-spec" ${/^(REQUIREMENT|DEPLOYMENT|HINWEIS):/.test(s) ? 'style="color:var(--accent)"' : ''}>
            ${E(`fahrzeuge.${vi}.specs.${si}`, s)}
            ${DELBTN(`fahrzeuge.${vi}.specs`, si)}
          </div>`).join('')}
          ${EDIT_MODE ? `
          <div class="veh-spec" style="border-bottom:none;">BILD: ${E(`fahrzeuge.${vi}.img`, v.img)}</div>
          ${ADDBTN(`fahrzeuge.${vi}.specs`, 'spec', 'Eigenschaft')}` : ''}
        </div>
      </div>`).join('')}
    </div>
    ${EDIT_MODE ? `<div class="edit-actions">${ADDBTN('fahrzeuge', 'veh', 'Fahrzeug')}</div>` : ''}

    <section class="section" style="border-bottom:none;">
      <div class="section-meta"><div class="sm-title">FOLIERUNG</div></div>
      <div class="section-content">
        <div class="data-block">
          <div class="db-header">
            <span class="db-title">${E('folierung.title', CONTENT.folierung.title)}</span>
            <span class="db-badge warn">RESTRICTED</span>
          </div>
          <div class="db-body">
            <p style="color:var(--text-muted);line-height:1.6">${E('folierung.text', CONTENT.folierung.text)}</p>
          </div>
        </div>
      </div>
    </section>
  `,

  ausbildung: () => `
    <div class="page-header">
      <div class="ph-content">
        <div class="ph-tag">04 // MODULES</div>
        <h1 class="ph-title">Ausbildung</h1>
        <p class="ph-desc">Trainingsmatrix für Piloten.</p>
      </div>
    </div>

    <section class="section">
      <div class="section-meta"><div class="sm-title">TRAINING</div></div>
      <div class="section-content">
        <div class="data-grid">
          ${CONTENT.ausbildung.module.map((m, mi) => `
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">${E(`ausbildung.module.${mi}.title`, m.title)}</span>
              ${DELBTN('ausbildung.module', mi)}
            </div>
            <div class="db-body">
              ${(m.text || EDIT_MODE) ? `<p style="color:var(--text-muted);line-height:1.6;margin-bottom:${m.rows.length ? '16px' : '0'};">${E(`ausbildung.module.${mi}.text`, m.text)}</p>` : ''}
              ${m.rows.map((row, ri) => `
              <div class="db-row">
                <span class="db-label">${E(`ausbildung.module.${mi}.rows.${ri}.l`, row.l)}</span>
                <span style="display:flex;align-items:center;gap:8px;">
                  ${E(`ausbildung.module.${mi}.rows.${ri}.v`, row.v)}
                  ${DELBTN(`ausbildung.module.${mi}.rows`, ri)}
                </span>
              </div>`).join('')}
              ${ADDBTN(`ausbildung.module.${mi}.rows`, 'row', 'Zeile')}
            </div>
          </div>`).join('')}
        </div>
        ${ADDBTN('ausbildung.module', 'modul', 'Modul')}
      </div>
    </section>

    <section class="section">
      <div class="section-meta"><div class="sm-title">RANGSTRUKTUR</div></div>
      <div class="section-content">
        <div class="data-block">
          <div class="db-header">
            <span class="db-title">RÄNGE DER A.S.D.</span>
            <span class="db-badge">HIERARCHIE</span>
          </div>
          <div class="db-body">
            ${CONTENT.ausbildung.raenge.map((r, ri) => `
            <div class="db-row">
              <span class="db-label">${E(`ausbildung.raenge.${ri}.num`, r.num)}</span>
              <span style="display:flex;align-items:center;gap:8px;${r.name.includes('NEU') ? 'color:var(--accent);' : ''}">
                ${E(`ausbildung.raenge.${ri}.name`, r.name)}
                ${DELBTN('ausbildung.raenge', ri)}
              </span>
            </div>`).join('')}
            ${ADDBTN('ausbildung.raenge', 'rang', 'Rang')}
          </div>
        </div>
        <div class="rule-sub" style="margin-top:24px;">${E('ausbildung.raengeHinweis', CONTENT.ausbildung.raengeHinweis)}</div>
      </div>
    </section>

    <section class="section">
      <div class="section-meta"><div class="sm-title">WEITERFÜHREND</div></div>
      <div class="section-content" style="display:flex;gap:20px;flex-wrap:wrap;">
        <a href="#" class="btn magnetic" data-page="fortbildung">Zur Fortbildung</a>
        <a href="#" class="btn magnetic" data-page="flugsteuerung">Zur Steuerung</a>
      </div>
    </section>

    <div class="alert-box">
      <h3 class="alert-title">${E('ausbildung.alert.title', CONTENT.ausbildung.alert.title)}</h3>
      <p class="alert-desc">${E('ausbildung.alert.text', CONTENT.ausbildung.alert.text)}</p>
    </div>
  `,

  flugsteuerung: () => `
    <div class="page-header">
      <div class="ph-content">
        <div class="ph-tag">06 // CALIBRATION</div>
        <h1 class="ph-title">Steuerung</h1>
      </div>
    </div>

    <section class="section">
      <div class="section-meta"><div class="sm-title">SYSTEMS</div></div>
      <div class="section-content">
        <div class="data-block" style="margin-bottom:40px;">
          <div class="db-header"><span class="db-title">EMPFEHLUNG DER LEITUNG</span></div>
          <div class="db-body"><p style="color:var(--text-muted);line-height:1.6">${E('flugsteuerung.text', CONTENT.flugsteuerung.text)}</p></div>
        </div>
        <div class="alert-box">
          <h3 class="alert-title">${E('flugsteuerung.alert.title', CONTENT.flugsteuerung.alert.title)}</h3>
          <p class="alert-desc">${E('flugsteuerung.alert.text', CONTENT.flugsteuerung.alert.text)}</p>
        </div>
      </div>
    </section>
  `,

  fortbildung: () => `
    <div class="page-header">
      <div class="ph-content">
        <div class="ph-tag">07 // ADVANCED</div>
        <h1 class="ph-title">Fortbildung</h1>
      </div>
    </div>

    <section class="section">
      <div class="section-meta"><div class="sm-title">CERTIFICATES</div></div>
      <div class="section-content">
        <div class="data-grid">
          ${CONTENT.fortbildung.map((c, ci) => `
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">${E(`fortbildung.${ci}.title`, c.title)}</span>
              <span style="display:flex;align-items:center;gap:8px;">
                <span class="db-badge ${c.badge === 'RESTRICTED' ? 'warn' : ''}">${E(`fortbildung.${ci}.badge`, c.badge)}</span>
                ${DELBTN('fortbildung', ci)}
              </span>
            </div>
            <div class="db-body"><p style="color:var(--text-muted);line-height:1.6">${E(`fortbildung.${ci}.text`, c.text)}</p></div>
          </div>`).join('')}
        </div>
        ${ADDBTN('fortbildung', 'cert', 'Fortbildung')}
      </div>
    </section>
  `,

  team: () => {
    const team = getTeam();
    const lead = team.filter(m => isLeitung(m.role));
    const members = team.filter(m => !isLeitung(m.role));

    const card = (m, isLead) => `
      <div class="team-card${isLead ? ' lead' : ''}">
        <div>
          <div class="tc-name">[${esc(m.callsign)}] ${esc(m.name)}</div>
          <div class="tc-role">${esc(m.role)}</div>
        </div>
        <div class="tc-rank">${esc(m.rank) || '—'}<br><span>#${esc(m.callsign)}</span></div>
      </div>`;

    return `
    <div class="page-header" style="background-image: url('assets/team.png')">
      <div class="ph-content">
        <div class="ph-tag">08 // PERSONNEL</div>
        <h1 class="ph-title">Team</h1>
        <p class="ph-desc">${team.length} Mitglieder // ${lead.length} Leitung</p>
      </div>
    </div>

    <section class="section">
      <div class="section-meta"><div class="sm-title">LEITUNG</div></div>
      <div class="section-content">
        <div class="team-grid">${lead.map(m => card(m, true)).join('')}</div>
      </div>
    </section>

    <section class="section" style="border-bottom:none;">
      <div class="section-meta"><div class="sm-title">MITGLIEDER</div></div>
      <div class="section-content">
        <div class="team-grid">${members.map(m => card(m, false)).join('')}</div>
      </div>
    </section>
    `;
  },

  intern: () => {
    const user = getSession();

    if (!user) {
      return `
      <div class="login-wrap">
        <div class="login-card">
          <div class="ph-tag">05 // RESTRICTED ACCESS</div>
          <h1 class="login-title">OP-COM Login</h1>
          <p class="login-desc">Interner Bereich für die Leitungsebene. Zugriff nur für Director & Co-Director.</p>
          <form id="login-form" autocomplete="off">
            <label class="f-label" for="login-user">Callsign</label>
            <input class="f-input" type="text" id="login-user" placeholder="DIRECTOR" required>
            <label class="f-label" for="login-pass">Passwort</label>
            <input class="f-input" type="password" id="login-pass" placeholder="••••••••" required>
            <div class="login-error" id="login-error"></div>
            <button type="submit" class="btn btn-primary magnetic" style="width:100%;">Authentifizieren</button>
          </form>
        </div>
      </div>`;
    }

    return `
    <div class="page-header">
      <div class="ph-content">
        <div class="ph-tag">05 // INTERNAL</div>
        <h1 class="ph-title">Bewertung</h1>
        <p class="ph-desc">Bewertungssystem für Flight Students. Strecken, Einsatzausbildung und Einzelkriterien.</p>
      </div>
    </div>

    <div class="intern-bar">
      <span class="mono-text">ANGEMELDET ALS: <b style="color:var(--accent)">${esc(user.toUpperCase())}</b> // BEARBEITEN-MODUS AUF ALLEN SEITEN VERFÜGBAR</span>
      <button class="btn btn-small magnetic" id="logout-btn">Logout</button>
    </div>

    <section class="section">
      <div class="section-meta"><div class="sm-title">NEUE BEWERTUNG</div></div>
      <div class="section-content">
        <form id="eval-form" autocomplete="off">
          <input type="hidden" id="ev-id">
          <div class="form-grid">
            <div>
              <label class="f-label" for="ev-name">Pilot / Flight Student</label>
              <input class="f-input" type="text" id="ev-name" placeholder="NAME" required>
            </div>
            <div>
              <label class="f-label" for="ev-pruefer">Prüfer</label>
              <input class="f-input" type="text" id="ev-pruefer" value="${esc(user)}" readonly>
            </div>
          </div>

          <div class="data-grid" style="margin-top:40px;">
            <div class="data-block">
              <div class="db-header"><span class="db-title">THEORIE</span><span class="db-badge">MODUL 01</span></div>
              <div class="db-body">
                <p style="color:var(--text-muted);font-size:.85rem;line-height:1.6;">Vorschriften, Funksprüche und Verhaltensregeln.</p>
                <label class="f-check"><input type="checkbox" id="ev-theorie-ok"> Bestanden</label>
              </div>
            </div>
            <div class="data-block">
              <div class="db-header"><span class="db-title">STRECKE 1</span><span class="db-badge">LIMIT 03:30</span></div>
              <div class="db-body">
                <label class="f-label" for="ev-s1-zeit">Zeit (MM:SS)</label>
                <input class="f-input" type="text" id="ev-s1-zeit" placeholder="03:00">
                <label class="f-label" for="ev-s1-hits">Hits (+10 Sek / Hit)</label>
                <input class="f-input" type="number" id="ev-s1-hits" min="0" placeholder="0">
                <label class="f-check"><input type="checkbox" id="ev-s1-ok"> Bestanden</label>
              </div>
            </div>
            <div class="data-block">
              <div class="db-header"><span class="db-title">STRECKE 2</span><span class="db-badge">LIMIT 02:30</span></div>
              <div class="db-body">
                <label class="f-label" for="ev-s2-zeit">Zeit (MM:SS)</label>
                <input class="f-input" type="text" id="ev-s2-zeit" placeholder="02:00">
                <label class="f-label" for="ev-s2-hits">Hits (+10 Sek / Hit)</label>
                <input class="f-input" type="number" id="ev-s2-hits" min="0" placeholder="0">
                <label class="f-check"><input type="checkbox" id="ev-s2-ok"> Bestanden</label>
              </div>
            </div>
            <div class="data-block">
              <div class="db-header"><span class="db-title">EINSATZAUSBILDUNG</span><span class="db-badge warn">TAKTIK</span></div>
              <div class="db-body">
                <p style="color:var(--text-muted);font-size:.85rem;line-height:1.6;">Luft-Boden Verfolgungsjagd und Verhalten in Einsatzlagen.</p>
                <label class="f-check"><input type="checkbox" id="ev-einsatz-ok"> Bestanden</label>
              </div>
            </div>
          </div>

          <div class="data-block" style="margin-top:40px;">
            <div class="db-header">
              <span class="db-title">EINZELKRITERIEN // 0–10</span>
              <span class="db-badge warn" id="ev-avg">Ø 5.0</span>
            </div>
            <div class="db-body">
              ${RATING_CRITERIA.map(c => `
              <div class="slider-row">
                <span class="db-label">${c.label}</span>
                <input type="range" class="f-range" id="ev-r-${c.key}" min="0" max="10" step="1" value="5">
                <span class="slider-val" id="ev-rv-${c.key}">5</span>
              </div>`).join('')}
            </div>
          </div>

          <label class="f-label" for="ev-notes" style="margin-top:40px;">Bemerkungen</label>
          <textarea class="f-input" id="ev-notes" rows="3" placeholder="OPTIONAL"></textarea>

          <div style="display:flex;gap:16px;margin-top:24px;">
            <button type="submit" class="btn btn-primary magnetic" id="ev-submit">Bewertung speichern</button>
            <button type="button" class="btn magnetic" id="ev-cancel" style="display:none;">Abbrechen</button>
          </div>
        </form>
      </div>
    </section>

    <section class="section">
      <div class="section-meta"><div class="sm-title">AKTEN</div></div>
      <div class="section-content"><div id="eval-list"></div></div>
    </section>

    <section class="section">
      <div class="section-meta"><div class="sm-title">TEAM-VERWALTUNG</div></div>
      <div class="section-content">
        <form id="team-form" autocomplete="off">
          <input type="hidden" id="tm-id">
          <div class="team-form-grid">
            <div>
              <label class="f-label" for="tm-callsign">Callsign</label>
              <input class="f-input" type="text" id="tm-callsign" placeholder="PD-000" required>
            </div>
            <div>
              <label class="f-label" for="tm-name">Name</label>
              <input class="f-input" type="text" id="tm-name" placeholder="VORNAME NACHNAME" required>
            </div>
            <div>
              <label class="f-label" for="tm-role">A.S.D. Rolle</label>
              <select class="f-input" id="tm-role">
                ${TEAM_ROLES.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="f-label" for="tm-rank">PD-Rang</label>
              <input class="f-input" type="text" id="tm-rank" placeholder="OFFICER I">
            </div>
          </div>
          <div style="display:flex;gap:16px;margin-top:24px;">
            <button type="submit" class="btn btn-primary magnetic" id="tm-submit">Hinzufügen</button>
            <button type="button" class="btn magnetic" id="tm-cancel" style="display:none;">Abbrechen</button>
          </div>
        </form>
        <div id="team-admin-list" style="margin-top:40px;"></div>
      </div>
    </section>

    <section class="section" style="border-bottom:none;">
      <div class="section-meta"><div class="sm-title">DATEN</div></div>
      <div class="section-content">
        ${SERVER_MODE ? `
        <div class="data-block" style="margin-bottom:40px;">
          <div class="db-header">
            <span class="db-title">SERVER-SPEICHERUNG</span>
            <span class="db-badge warn">AKTIV</span>
          </div>
          <div class="db-body">
            <p style="color:var(--text-muted);line-height:1.6;">
              Alle Änderungen (Inhalte, Team, Bewertungen) werden automatisch
              direkt beim Server gespeichert und gelten
              <b style="color:var(--text)">sofort für alle Besucher</b>.
              Kein Export nötig.
              <br><br>
              <span class="mono-text" style="font-size:.7rem;">LETZTE ÄNDERUNG: <span id="data-published-info">—</span></span>
            </p>
          </div>
        </div>` : `
        <div class="data-block" style="margin-bottom:40px;">
          <div class="db-header">
            <span class="db-title">VERÖFFENTLICHEN</span>
            <span class="db-badge warn">OFFLINE-MODUS</span>
          </div>
          <div class="db-body">
            <p style="color:var(--text-muted);line-height:1.6;margin-bottom:24px;">
              Kein Server erreichbar — Änderungen gelten erst nur auf diesem PC.
              "Veröffentlichen" erzeugt eine <b style="color:var(--text)">data.json</b>,
              die auf dem Host neben der index.html liegen muss, damit
              <b style="color:var(--text)">alle Besucher</b> den neuen Stand sehen.
            </p>
            <button class="btn btn-primary magnetic" id="data-publish">Veröffentlichen (data.json)</button>
            <span class="mono-text" style="font-size:.7rem;color:var(--text-muted);margin-left:16px;">STAND: <span id="data-published-info">—</span></span>
          </div>
        </div>`}

        <p style="color:var(--text-muted);line-height:1.6;max-width:700px;margin-bottom:24px;">
          Backup enthält den kompletten Stand inklusive Bewertungsakten —
          als Sicherung oder zum Übertragen auf einen anderen PC.
        </p>
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          <button class="btn magnetic" id="data-export">Backup exportieren</button>
          <label class="btn magnetic" for="data-import" style="display:inline-flex;">Backup importieren</label>
          <input type="file" id="data-import" accept="application/json,.json" style="display:none;">
          <button class="btn magnetic" id="data-reset" style="border-color:var(--danger);color:var(--danger);">Lokale Änderungen verwerfen</button>
        </div>
        <div class="login-error" id="data-msg" style="margin-top:16px;"></div>
      </div>
    </section>
    `;
  }
};

// ─── ROUTER & ANIMATIONS ──────────────────────────────────────
function bindPageLinks(root) {
  root.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });
}

function afterRender(page) {
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
  bindPageLinks(document.getElementById('app'));
  initCursor();
  if (page === 'intern') initIntern();
  bindEditControls();
  updateEditBar();
}

// Sofortiges Rendern ohne Fade (für Bearbeiten-Modus)
function renderNow(page) {
  CURRENT_PAGE = page;
  const app = document.getElementById('app');
  gsap.set(app, { opacity: 1, y: 0 });
  app.innerHTML = (pages[page] || pages.startseite)();
  afterRender(page);
}

function render(page) {
  CURRENT_PAGE = page;
  const app = document.getElementById('app');

  gsap.to(app, {
    opacity: 0, y: 10, duration: 0.3, onComplete: () => {
      app.innerHTML = (pages[page] || pages.startseite)();
      afterRender(page);
      window.scrollTo(0, 0);

      gsap.fromTo(app, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });

      if (page === 'startseite') {
        gsap.to('.hero-title span', { y: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 });
        gsap.to(['.hero-desc', '.hero-actions'], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
      }
    }
  });
}

function navigate(page) {
  if (EDIT_MODE) {
    if (!confirm('Bearbeiten-Modus verlassen? Ungespeicherte Änderungen gehen verloren.')) return;
    CONTENT = loadContent();
    EDIT_MODE = false;
  }
  history.pushState({ page }, '', '#' + page);
  render(page);
}

// ─── INTERN-LOGIK ─────────────────────────────────────────────
function renderEvalList() {
  const list = document.getElementById('eval-list');
  if (!list) return;
  const evals = getEvals();

  if (!evals.length) {
    list.innerHTML = '<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:.85rem;">// KEINE AKTEN VORHANDEN</p>';
    return;
  }

  list.innerHTML = evals.map(rec => `
    <div class="eval-card">
      <div class="eval-head">
        <div>
          <div class="eval-name">${esc(rec.name)}</div>
          <div class="eval-meta">${esc(rec.date)} // PRÜFER: ${esc(rec.pruefer)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span class="db-badge ${evalStatus(rec) === 'BESTANDEN' ? 'warn' : ''}">${evalStatus(rec)}</span>
          <span class="db-badge">Ø ${rec.avg.toFixed(1)}</span>
          <button class="btn btn-small magnetic" data-ev-edit="${rec.id}">Bearbeiten</button>
          <button class="btn btn-small magnetic" data-ev-del="${rec.id}">Löschen</button>
        </div>
      </div>
      <div class="eval-body">
        <div class="eval-tags">
          <span class="tag ${rec.theorie ? 'ok' : 'fail'}">THEORIE ${rec.theorie ? '✓' : '✗'}</span>
          <span class="tag ${rec.s1.ok ? 'ok' : 'fail'}">STRECKE 1 ${rec.s1.ok ? '✓' : '✗'} ${rec.s1.zeit ? '// ' + esc(rec.s1.zeit) : ''} ${rec.s1.hits ? '// ' + esc(rec.s1.hits) + ' HITS' : ''}</span>
          <span class="tag ${rec.s2.ok ? 'ok' : 'fail'}">STRECKE 2 ${rec.s2.ok ? '✓' : '✗'} ${rec.s2.zeit ? '// ' + esc(rec.s2.zeit) : ''} ${rec.s2.hits ? '// ' + esc(rec.s2.hits) + ' HITS' : ''}</span>
          <span class="tag ${rec.einsatz.ok ? 'ok' : 'fail'}">EINSATZAUSBILDUNG ${rec.einsatz.ok ? '✓' : '✗'}</span>
        </div>
        <div class="eval-ratings">
          ${RATING_CRITERIA.map(c => `<div class="eval-rating"><span>${c.label}</span><span style="color:var(--accent)">${rec.ratings[c.key]}/10</span></div>`).join('')}
        </div>
        ${rec.notes ? `<div class="rule-sub" style="margin-top:16px;">${nl2br(esc(rec.notes))}</div>` : ''}
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-ev-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Bewertung wirklich löschen?')) return;
      saveEvals(getEvals().filter(r => r.id !== btn.dataset.evDel));
      renderEvalList();
    });
  });

  list.querySelectorAll('[data-ev-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const rec = getEvals().find(r => r.id === btn.dataset.evEdit);
      if (!rec) return;
      document.getElementById('ev-id').value = rec.id;
      document.getElementById('ev-name').value = rec.name;
      document.getElementById('ev-theorie-ok').checked = !!rec.theorie;
      document.getElementById('ev-s1-zeit').value = rec.s1.zeit || '';
      document.getElementById('ev-s1-hits').value = rec.s1.hits || '';
      document.getElementById('ev-s1-ok').checked = !!rec.s1.ok;
      document.getElementById('ev-s2-zeit').value = rec.s2.zeit || '';
      document.getElementById('ev-s2-hits').value = rec.s2.hits || '';
      document.getElementById('ev-s2-ok').checked = !!rec.s2.ok;
      document.getElementById('ev-einsatz-ok').checked = !!rec.einsatz.ok;
      document.getElementById('ev-notes').value = rec.notes || '';
      RATING_CRITERIA.forEach(c => {
        const val = rec.ratings[c.key] ?? 5;
        document.getElementById('ev-r-' + c.key).value = val;
        document.getElementById('ev-rv-' + c.key).innerText = val;
      });
      document.getElementById('ev-submit').innerText = 'Aktualisieren';
      document.getElementById('ev-cancel').style.display = '';
      document.getElementById('ev-avg').dispatchEvent(new Event('refresh'));
      window.scrollTo({ top: document.getElementById('eval-form').offsetTop - 120, behavior: 'smooth' });
    });
  });
}

function initIntern() {
  // ── Login-Ansicht ──
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const u = document.getElementById('login-user').value.trim();
      const p = document.getElementById('login-pass').value;
      const hash = await asdHash(p);
      const found = ASD_USERS.find(x => x.name.toLowerCase() === u.toLowerCase() && x.hash === hash);
      if (found) {
        sessionStorage.setItem('asd_user', found.name);
        sessionStorage.setItem('asd_auth', hash); // für Server-API
        render('intern');
      } else {
        document.getElementById('login-error').innerText = 'ACCESS DENIED // FALSCHE ZUGANGSDATEN';
      }
    });
    return;
  }

  // ── Dashboard-Ansicht ──
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('asd_user');
    sessionStorage.removeItem('asd_auth');
    render('intern');
  });

  const updateAvg = () => {
    const vals = RATING_CRITERIA.map(c => +document.getElementById('ev-r-' + c.key).value);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    document.getElementById('ev-avg').innerText = 'Ø ' + avg.toFixed(1);
    return avg;
  };
  document.getElementById('ev-avg').addEventListener('refresh', updateAvg);

  RATING_CRITERIA.forEach(c => {
    const range = document.getElementById('ev-r-' + c.key);
    range.addEventListener('input', () => {
      document.getElementById('ev-rv-' + c.key).innerText = range.value;
      updateAvg();
    });
  });
  updateAvg();

  const resetEvalForm = () => {
    const form = document.getElementById('eval-form');
    form.reset();
    document.getElementById('ev-id').value = '';
    document.getElementById('ev-pruefer').value = getSession();
    RATING_CRITERIA.forEach(c => {
      document.getElementById('ev-r-' + c.key).value = 5;
      document.getElementById('ev-rv-' + c.key).innerText = '5';
    });
    document.getElementById('ev-submit').innerText = 'Bewertung speichern';
    document.getElementById('ev-cancel').style.display = 'none';
    updateAvg();
  };

  document.getElementById('ev-cancel').addEventListener('click', resetEvalForm);

  document.getElementById('eval-form').addEventListener('submit', e => {
    e.preventDefault();
    const ratings = {};
    RATING_CRITERIA.forEach(c => ratings[c.key] = +document.getElementById('ev-r-' + c.key).value);

    const editId = document.getElementById('ev-id').value;
    const evals = getEvals();
    const existing = editId ? evals.find(r => r.id === editId) : null;

    const rec = {
      id: existing ? existing.id : Date.now().toString(36),
      name: document.getElementById('ev-name').value.trim(),
      pruefer: getSession(),
      date: existing ? existing.date : new Date().toLocaleDateString('de-DE') + ' ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      theorie: document.getElementById('ev-theorie-ok').checked,
      s1: {
        zeit: document.getElementById('ev-s1-zeit').value.trim(),
        hits: document.getElementById('ev-s1-hits').value,
        ok: document.getElementById('ev-s1-ok').checked
      },
      s2: {
        zeit: document.getElementById('ev-s2-zeit').value.trim(),
        hits: document.getElementById('ev-s2-hits').value,
        ok: document.getElementById('ev-s2-ok').checked
      },
      einsatz: { ok: document.getElementById('ev-einsatz-ok').checked },
      ratings,
      avg: updateAvg(),
      notes: document.getElementById('ev-notes').value.trim()
    };

    if (existing) {
      evals[evals.indexOf(existing)] = rec;
    } else {
      evals.unshift(rec);
    }
    saveEvals(evals);

    resetEvalForm();
    renderEvalList();
    window.scrollTo({ top: document.getElementById('eval-list').offsetTop - 120, behavior: 'smooth' });
  });

  renderEvalList();
  initTeamAdmin();
  initDataAdmin();

  // Im Server-Modus: Akten vom Server holen und Liste aktualisieren
  pullServerEvals().then(ok => { if (ok) renderEvalList(); });
}

function renderTeamAdmin() {
  const list = document.getElementById('team-admin-list');
  if (!list) return;
  const team = getTeam();

  list.innerHTML = team.map(m => `
    <div class="tm-row${isLeitung(m.role) ? ' lead' : ''}">
      <span class="tm-callsign">${esc(m.callsign)}</span>
      <span>${esc(m.name)}</span>
      <span class="tm-role">${esc(m.role)}</span>
      <span class="tm-rank">${esc(m.rank) || '—'}</span>
      <span class="tm-actions">
        <button class="btn btn-small magnetic" data-tm-edit="${m.id}">Bearbeiten</button>
        <button class="btn btn-small magnetic" data-tm-del="${m.id}">Löschen</button>
      </span>
    </div>
  `).join('');

  list.querySelectorAll('[data-tm-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Mitglied wirklich entfernen?')) return;
      saveTeam(getTeam().filter(m => m.id !== btn.dataset.tmDel));
      renderTeamAdmin();
    });
  });

  list.querySelectorAll('[data-tm-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = getTeam().find(x => x.id === btn.dataset.tmEdit);
      if (!m) return;
      document.getElementById('tm-id').value = m.id;
      document.getElementById('tm-callsign').value = m.callsign;
      document.getElementById('tm-name').value = m.name;
      document.getElementById('tm-role').value = m.role;
      document.getElementById('tm-rank').value = m.rank || '';
      document.getElementById('tm-submit').innerText = 'Speichern';
      document.getElementById('tm-cancel').style.display = '';
      document.getElementById('tm-callsign').focus();
    });
  });
}

function initTeamAdmin() {
  const form = document.getElementById('team-form');
  if (!form) return;

  const resetForm = () => {
    form.reset();
    document.getElementById('tm-id').value = '';
    document.getElementById('tm-submit').innerText = 'Hinzufügen';
    document.getElementById('tm-cancel').style.display = 'none';
  };

  document.getElementById('tm-cancel').addEventListener('click', resetForm);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const entry = {
      id: document.getElementById('tm-id').value || Date.now().toString(36),
      callsign: document.getElementById('tm-callsign').value.trim().toUpperCase(),
      name: document.getElementById('tm-name').value.trim(),
      role: document.getElementById('tm-role').value,
      rank: document.getElementById('tm-rank').value.trim()
    };

    const team = getTeam();
    const idx = team.findIndex(m => m.id === entry.id);
    if (idx >= 0) team[idx] = entry;
    else team.push(entry);
    saveTeam(team);

    resetForm();
    renderTeamAdmin();
  });

  renderTeamAdmin();
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function initDataAdmin() {
  const exportBtn = document.getElementById('data-export');
  if (!exportBtn) return;
  const msg = document.getElementById('data-msg');

  const info = document.getElementById('data-published-info');
  if (PUBLISHED && PUBLISHED.updated) {
    info.innerText = new Date(PUBLISHED.updated).toLocaleString('de-DE');
  } else {
    info.innerText = SERVER_MODE ? 'NOCH KEINE DATEN GESPEICHERT' : 'KEINE DATA.JSON GELADEN';
  }

  const publishBtn = document.getElementById('data-publish');
  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      downloadJSON({
        updated: new Date().toISOString(),
        content: CONTENT,
        team: getTeam()
      }, 'data.json');
      msg.style.color = 'var(--accent)';
      msg.innerText = 'DATA.JSON ERSTELLT // AUF DEM HOST NEBEN DER INDEX.HTML ABLEGEN';
    });
  }

  exportBtn.addEventListener('click', () => {
    downloadJSON({
      version: 1,
      exported: new Date().toISOString(),
      content: CONTENT,
      team: getTeam(),
      evals: getEvals()
    }, 'asd-backup-' + new Date().toISOString().slice(0, 10) + '.json');
    msg.style.color = 'var(--accent)';
    msg.innerText = 'BACKUP ERSTELLT';
  });

  document.getElementById('data-import').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data || typeof data !== 'object' || (!data.content && !data.team && !data.evals)) {
        throw new Error('invalid');
      }
      if (!confirm('Import überschreibt die Daten auf diesem PC. Fortfahren?')) { e.target.value = ''; return; }
      if (data.content) { CONTENT = data.content; saveContent(); }
      if (Array.isArray(data.team)) saveTeam(data.team);
      if (Array.isArray(data.evals)) saveEvals(data.evals);
      renderNow('intern');
    } catch {
      msg.style.color = 'var(--danger)';
      msg.innerText = 'IMPORT FEHLGESCHLAGEN // UNGÜLTIGE DATEI';
    }
    e.target.value = '';
  });

  document.getElementById('data-reset').addEventListener('click', () => {
    if (!confirm('Lokale Änderungen an Inhalten und Team verwerfen und auf den veröffentlichten Stand zurücksetzen? (Bewertungen bleiben erhalten)')) return;
    localStorage.removeItem('asd_content');
    localStorage.removeItem('asd_team');
    CONTENT = loadContent();
    renderNow('intern');
  });
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initEditBar();

  document.querySelectorAll('.nav-link, .nav-brand a').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });

  window.addEventListener('popstate', e => {
    if (EDIT_MODE) { CONTENT = loadContent(); EDIT_MODE = false; }
    render(e.state?.page || 'startseite');
  });

  // Veröffentlichten Stand (data.json) laden, dann erst rendern
  await fetchPublished();
  CONTENT = loadContent();

  const hash = location.hash.replace('#', '') || 'startseite';
  renderNow(Object.prototype.hasOwnProperty.call(pages, hash) ? hash : 'startseite');

  if (CURRENT_PAGE === 'startseite') {
    gsap.to('.hero-title span', { y: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 });
    gsap.to(['.hero-desc', '.hero-actions'], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
  }
});
