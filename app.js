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
  if(clock) {
    const now = new Date();
    clock.innerText = now.toLocaleTimeString('de-DE') + ' LOCAL';
  }
}
setInterval(updateClock, 1000);
updateClock();

// ─── INTERN: LOGIN & BEWERTUNGSSYSTEM ────────────────────────
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

// ─── TEAM-DATEN ──────────────────────────────────────────────
const TEAM_ROLES = ['Director', 'Co-Director', 'Instructor', 'Officer', 'Student'];
const LEAD_ROLES = ['Director', 'Co-Director', 'Instructor'];

const DEFAULT_TEAM = [
  { id: 'pd111', callsign: 'PD-111', name: 'Vince Kowalski',       role: 'Director',    rank: 'Lieutenant II' },
  { id: 'pd236', callsign: 'PD-236', name: 'Harvey Nilo Navarro',  role: 'Co-Director', rank: 'Officer III' },
  { id: 'pd104', callsign: 'PD-104', name: 'Moritz Bauer',         role: 'Instructor',  rank: 'Lieutenant II' },
  { id: 'pd113', callsign: 'PD-113', name: 'David Leonel Kay',     role: 'Instructor',  rank: 'Lieutenant I' },
  { id: 'pd157', callsign: 'PD-157', name: 'Leano Cruelo',         role: 'Officer',     rank: 'Staff Sergeant' },
  { id: 'pd147', callsign: 'PD-147', name: 'Gabriel Joel Cronwell',role: 'Officer',     rank: 'Sergeant' },
  { id: 'pd109', callsign: 'PD-109', name: 'Yumiko Moriya',        role: 'Officer',     rank: 'Lieutenant II' },
  { id: 'pd159', callsign: 'PD-159', name: 'Miguel Stone',         role: 'Officer',     rank: 'Senior Officer' },
  { id: 'pd151', callsign: 'PD-151', name: 'Raven Black',          role: 'Officer',     rank: 'Senior Officer' },
  { id: 'pd262', callsign: 'PD-262', name: 'Jim Barns',            role: 'Student',     rank: 'Officer I' }
];

function isLeitung(role) { return LEAD_ROLES.includes(role); }
function getTeam() {
  try {
    const stored = JSON.parse(localStorage.getItem('asd_team'));
    if (Array.isArray(stored)) return stored;
  } catch {}
  return DEFAULT_TEAM.map(m => ({ ...m }));
}
function saveTeam(team) { localStorage.setItem('asd_team', JSON.stringify(team)); }

const RATING_CRITERIA = [
  { key: 'flug',     label: 'Flugverhalten' },
  { key: 'kamera',   label: 'Kameranutzung' },
  { key: 'selbst',   label: 'Selbstsicherheit' },
  { key: 'gewandt',  label: 'Gewandtheit' },
  { key: 'funk',     label: 'Funkdisziplin' },
  { key: 'regeln',   label: 'Regelkenntnis' },
  { key: 'landung',  label: 'Landetechnik' },
  { key: 'team',     label: 'Teamfähigkeit' }
];

function getSession() { return sessionStorage.getItem('asd_user'); }
function getEvals() {
  try { return JSON.parse(localStorage.getItem('asd_evals') || '[]'); }
  catch { return []; }
}
function saveEvals(evals) { localStorage.setItem('asd_evals', JSON.stringify(evals)); }

function evalStatus(rec) {
  const passed = rec.theorie && rec.s1.ok && rec.s2.ok && rec.einsatz.ok && rec.avg >= 5;
  return passed ? 'BESTANDEN' : 'OFFEN';
}

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
          <div class="eval-name">${rec.name}</div>
          <div class="eval-meta">${rec.date} // PRÜFER: ${rec.pruefer}</div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <span class="db-badge ${evalStatus(rec) === 'BESTANDEN' ? 'warn' : ''}">${evalStatus(rec)}</span>
          <span class="db-badge">Ø ${rec.avg.toFixed(1)}</span>
          <button class="btn btn-small magnetic" data-del="${rec.id}">Löschen</button>
        </div>
      </div>
      <div class="eval-body">
        <div class="eval-tags">
          <span class="tag ${rec.theorie ? 'ok' : 'fail'}">THEORIE ${rec.theorie ? '✓' : '✗'}</span>
          <span class="tag ${rec.s1.ok ? 'ok' : 'fail'}">STRECKE 1 ${rec.s1.ok ? '✓' : '✗'} ${rec.s1.zeit ? '// ' + rec.s1.zeit : ''} ${rec.s1.hits ? '// ' + rec.s1.hits + ' HITS' : ''}</span>
          <span class="tag ${rec.s2.ok ? 'ok' : 'fail'}">STRECKE 2 ${rec.s2.ok ? '✓' : '✗'} ${rec.s2.zeit ? '// ' + rec.s2.zeit : ''} ${rec.s2.hits ? '// ' + rec.s2.hits + ' HITS' : ''}</span>
          <span class="tag ${rec.einsatz.ok ? 'ok' : 'fail'}">EINSATZAUSBILDUNG ${rec.einsatz.ok ? '✓' : '✗'}</span>
        </div>
        <div class="eval-ratings">
          ${RATING_CRITERIA.map(c => `<div class="eval-rating"><span>${c.label}</span><span style="color:var(--accent)">${rec.ratings[c.key]}/10</span></div>`).join('')}
        </div>
        ${rec.notes ? `<div class="rule-sub" style="margin-top:16px;">${rec.notes}</div>` : ''}
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Bewertung wirklich löschen?')) return;
      saveEvals(getEvals().filter(r => r.id !== btn.dataset.del));
      renderEvalList();
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
    render('intern');
  });

  const updateAvg = () => {
    const vals = RATING_CRITERIA.map(c => +document.getElementById('ev-r-' + c.key).value);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    document.getElementById('ev-avg').innerText = 'Ø ' + avg.toFixed(1);
    return avg;
  };

  RATING_CRITERIA.forEach(c => {
    const range = document.getElementById('ev-r-' + c.key);
    range.addEventListener('input', () => {
      document.getElementById('ev-rv-' + c.key).innerText = range.value;
      updateAvg();
    });
  });
  updateAvg();

  document.getElementById('eval-form').addEventListener('submit', e => {
    e.preventDefault();
    const ratings = {};
    RATING_CRITERIA.forEach(c => ratings[c.key] = +document.getElementById('ev-r-' + c.key).value);

    const rec = {
      id: Date.now().toString(36),
      name: document.getElementById('ev-name').value.trim(),
      pruefer: getSession(),
      date: new Date().toLocaleDateString('de-DE') + ' ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
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

    const evals = getEvals();
    evals.unshift(rec);
    saveEvals(evals);

    e.target.reset();
    document.getElementById('ev-pruefer').value = getSession();
    RATING_CRITERIA.forEach(c => {
      document.getElementById('ev-r-' + c.key).value = 5;
      document.getElementById('ev-rv-' + c.key).innerText = '5';
    });
    updateAvg();
    renderEvalList();
    window.scrollTo({ top: document.getElementById('eval-list').offsetTop - 120, behavior: 'smooth' });
  });

  renderEvalList();
  initTeamAdmin();
}

function renderTeamAdmin() {
  const list = document.getElementById('team-admin-list');
  if (!list) return;
  const team = getTeam();

  list.innerHTML = team.map(m => `
    <div class="tm-row${isLeitung(m.role) ? ' lead' : ''}">
      <span class="tm-callsign">${m.callsign}</span>
      <span>${m.name}</span>
      <span class="tm-role">${m.role}</span>
      <span class="tm-rank">${m.rank || '—'}</span>
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
      <span>V 2.5.0 // ENCRYPTED</span>
    </div>
  `,

  kleidung: () => `
    <div class="page-header" style="background-image: url('https://lh3.googleusercontent.com/sitesv/AA5AbUBu6lP0uF-FiW5daQ3Z4aYcsmJlXWdBWgcQI_A9x5GzkdSSyLHLU-NLwpuAN1H_WB2fsIo-1e45_KbCsEGnFaH-i6QSpyVg2mo9p5tlNnE8x0loCQitUXNYaxW1X8wCl0oxZxZztp33S-Mb8IJ9HsPqhBKEgClUsTQZ0HEX3I264VtS7uLkGx-fdW0=w16383')">
      <div class="ph-content">
        <div class="ph-tag">02 // UNIFORMS</div>
        <h1 class="ph-title">Kleidung</h1>
        <p class="ph-desc">Zugelassene Loadouts. Strikte Einhaltung der IDs erforderlich.</p>
      </div>
    </div>
    
    <section class="section">
      <div class="section-meta"><div class="sm-title">MÄNNLICH</div></div>
      <div class="section-content">
        <div class="data-grid">
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">NORMAL</span>
              <span class="db-badge">STANDARD</span>
            </div>
            <div class="db-body">
              <div class="db-row"><span class="db-label">Torso</span><span>1067 (0/18)</span></div>
              <div class="db-row"><span class="db-label">Weste</span><span>159 (2/9)</span></div>
              <div class="db-row"><span class="db-label">Hose</span><span>476 (16/18)</span></div>
              <div class="db-row"><span class="db-label">T-Shirt</span><span>122</span></div>
              <div class="db-row"><span class="db-label">Arme</span><span>30 (0/10)</span></div>
              <div class="db-row"><span class="db-label">Schuhe</span><span>51</span></div>
            </div>
          </div>
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">HOLSTER</span>
              <span class="db-badge warn">TACTICAL</span>
            </div>
            <div class="db-body">
              <div class="db-row"><span class="db-label">Torso</span><span>1067 (0/18)</span></div>
              <div class="db-row"><span class="db-label">Weste</span><span>159 (2/9)</span></div>
              <div class="db-row"><span class="db-label">Hose</span><span>476 (16/18)</span></div>
              <div class="db-row"><span class="db-label">T-Shirt</span><span>15</span></div>
              <div class="db-row"><span class="db-label">Kette</span><span>325 (0/2)</span></div>
              <div class="db-row"><span class="db-label">Arme</span><span>30 (0/10)</span></div>
              <div class="db-row"><span class="db-label">Schuhe</span><span>51</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="border-bottom:none;">
      <div class="section-meta"><div class="sm-title">WEIBLICH</div></div>
      <div class="section-content">
        <div class="data-grid">
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">NORMAL</span>
              <span class="db-badge">STANDARD</span>
            </div>
            <div class="db-body">
              <div class="db-row"><span class="db-label">Torso</span><span>1610 (4/16)</span></div>
              <div class="db-row"><span class="db-label">Weste</span><span>219 (1/2)</span></div>
              <div class="db-row"><span class="db-label">Hose</span><span>326</span></div>
              <div class="db-row"><span class="db-label">T-Shirt</span><span>152</span></div>
              <div class="db-row"><span class="db-label">Arme</span><span>33</span></div>
              <div class="db-row"><span class="db-label">Schuhe</span><span>27</span></div>
            </div>
          </div>
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">HOLSTER</span>
              <span class="db-badge warn">TACTICAL</span>
            </div>
            <div class="db-body">
              <div class="db-row"><span class="db-label">Torso</span><span>1610 (4/16)</span></div>
              <div class="db-row"><span class="db-label">Weste</span><span>219 (1/2)</span></div>
              <div class="db-row"><span class="db-label">Hose</span><span>326</span></div>
              <div class="db-row"><span class="db-label">T-Shirt</span><span>-</span></div>
              <div class="db-row"><span class="db-label">Kette</span><span>-</span></div>
              <div class="db-row"><span class="db-label">Arme</span><span>33</span></div>
              <div class="db-row"><span class="db-label">Schuhe</span><span>27</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      <div class="rule-card">
        <div class="rule-id">01</div>
        <div class="rule-info">
          <div class="rule-text">Aus Helikoptern darf ausschließlich von Helikopter zu Helikopter geschossen werden. Beschuss von Personen oder Fahrzeugen ist verboten. Nur gezielter Beschuss des Heckrotors ist erlaubt.</div>
          <div class="rule-sub">AUSNAHME: Wird Feuer auf unsere Einheit eröffnet, ist Gegenfeuer zur Selbstverteidigung zulässig.</div>
        </div>
      </div>
      <div class="rule-card">
        <div class="rule-id">02</div>
        <div class="rule-info"><div class="rule-text">Der Helikopter ist maximal mit 2 Personen zu besetzen.</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-id">03</div>
        <div class="rule-info"><div class="rule-text">Pro Einsatzsituation ist maximal ein Helikopter der A.S.D. erlaubt. Ein Helikopter darf nicht nachbesetzt werden.</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-id">04</div>
        <div class="rule-info"><div class="rule-text">Wenn nach 3 Sekunden zum Helikopter kein Sichtkontakt mehr besteht, muss der "Lock" zum Fahrzeug abgebrochen werden.</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-id">05</div>
        <div class="rule-info">
          <div class="rule-text">Landeprotokolle:</div>
          <div class="rule-sub">VERBOTEN: Im SG, hinter den Zellen, auf Grünflächen vor/um PD.<br>ERLAUBT: Ausschließlich auf Dachflächen oder in abgesperrten Bereichen.</div>
        </div>
      </div>
      <div class="rule-card">
        <div class="rule-id">06</div>
        <div class="rule-info"><div class="rule-text">Ab 20 Uhr bis 0 Uhr ist der Helikopter mit Doppelbesatzung zu fliegen (Pilot & Co. Pilot).</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-id">07</div>
        <div class="rule-info"><div class="rule-text">Entwickelt sich eine Luft-Boden 10-80 zu einer Luft-Luft 10-80, darf direkt der Beschuss auf den Heckrotor 3-mal angekündigt und danach aufgenommen werden.</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-id">08</div>
        <div class="rule-info"><div class="rule-text">Ab dem Rang Flight Officer ist es gestattet, eine SMG zu nutzen.</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-id">09</div>
        <div class="rule-info"><div class="rule-text">Ab dem Rang Flight Officer dürfen auf allen Waffen Aufsätze getragen werden.</div></div>
      </div>
      <div class="rule-card">
        <div class="rule-id">10</div>
        <div class="rule-info">
          <div class="rule-text">Es ist gestattet, jede Art von Raub/Diebstahl anzufliegen, solange es verhältnismäßig bleibt:</div>
          <div class="rule-sub">VSTR vor Ort -> NICHT anfliegen (Nicht verhältnismäßig)<br>BF vor Ort -> Anfliegen erlaubt, solange es nicht zu oft passiert.</div>
        </div>
      </div>
    </div>
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
      <div class="veh-card">
        <div class="veh-img" style="background-image: url('assets/Conada.png')"></div>
        <div class="veh-info">
          <div class="veh-name">CONADA</div>
          <div class="veh-spec">Steigt sehr schnell</div>
          <div class="veh-spec">Sinkt langsam</div>
          <div class="veh-spec">Sehr gut geschützt (ummantelter Heckrotor)</div>
          <div class="veh-spec">Beschleunigt sehr gut</div>
        </div>
      </div>
      <div class="veh-card">
        <div class="veh-img" style="background-image: url('assets/Supervolito.png')"></div>
        <div class="veh-info">
          <div class="veh-name">SUPERVOLITO</div>
          <div class="veh-spec">Standard Helikopter</div>
          <div class="veh-spec">Steigt langsam, sinkt schnell</div>
          <div class="veh-spec">Nicht besonders gut geschützt</div>
          <div class="veh-spec">Sehr wendig, moderate Beschleunigung</div>
        </div>
      </div>
      <div class="veh-card">
        <div class="veh-img" style="background-image: url('assets/Black%20Hawk.png')"></div>
        <div class="veh-info">
          <div class="veh-name special">BLACK HAWK</div>
          <div class="veh-spec">Transportiert 6 Personen</div>
          <div class="veh-spec">Steigt langsam, sinkt schnell</div>
          <div class="veh-spec">Schlechter geschützt als Conada</div>
          <div class="veh-spec" style="color:var(--accent)">REQUIREMENT: Spezielle Fortbildung</div>
          <div class="veh-spec" style="color:var(--accent)">DEPLOYMENT: Nur durch SWAT/Leitung</div>
        </div>
      </div>
    </div>

    <section class="section" style="border-bottom:none;">
      <div class="section-meta"><div class="sm-title">FOLIERUNG</div></div>
      <div class="section-content">
        <div class="data-block">
          <div class="db-header">
            <span class="db-title">SCHWARZE FOLIERUNG</span>
            <span class="db-badge warn">RESTRICTED</span>
          </div>
          <div class="db-body">
            <p style="color:var(--text-muted);line-height:1.6">
              Die schwarze Helikopter-Folierung gebührt ausschließlich dem
              <b style="color:var(--accent)">Director</b> und <b style="color:var(--accent)">Co-Director</b>.
              Allen anderen Rängen ist das Führen der schwarzen Folierung untersagt.
            </p>
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
          <div class="data-block">
            <div class="db-header"><span class="db-title">MODUL 01 // THEORIE</span></div>
            <div class="db-body"><p style="color:var(--text-muted);line-height:1.6">Grundlagenwissen für A.S.D.-Piloten. Vorschriften, Funksprüche und Verhaltensregeln.</p></div>
          </div>
          <div class="data-block">
            <div class="db-header"><span class="db-title">MODUL 02 // STRECKE 1</span></div>
            <div class="db-body">
              <div class="db-row"><span class="db-label">TIME LIMIT</span><span>03:30 MIN</span></div>
              <div class="db-row"><span class="db-label">PENALTY</span><span>+10 SEK / HIT</span></div>
              <div class="db-row"><span class="db-label">MIN SPEED</span><span>100 KM/H</span></div>
            </div>
          </div>
          <div class="data-block">
            <div class="db-header"><span class="db-title">MODUL 03 // STRECKE 2</span></div>
            <div class="db-body">
              <div class="db-row"><span class="db-label">TIME LIMIT</span><span>02:30 MIN</span></div>
              <div class="db-row"><span class="db-label">PENALTY</span><span>+10 SEK / HIT</span></div>
              <div class="db-row"><span class="db-label">MIN SPEED</span><span>100 KM/H</span></div>
            </div>
          </div>
          <div class="data-block">
            <div class="db-header"><span class="db-title">MODUL 04 // TAKTIK</span></div>
            <div class="db-body"><p style="color:var(--text-muted);line-height:1.6">Luft-Boden Verfolgungsjagd. Praktische Anwendung der Tracking-Fähigkeiten.</p></div>
          </div>
        </div>
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
            <div class="db-row"><span class="db-label">R1</span><span>Flight Student</span></div>
            <div class="db-row"><span class="db-label">R2</span><span>Flight Officer</span></div>
            <div class="db-row"><span class="db-label">R3</span><span style="color:var(--accent)">Senior Flight Officer // NEU</span></div>
            <div class="db-row"><span class="db-label">R4</span><span>Co-Director</span></div>
            <div class="db-row"><span class="db-label">R5</span><span>Director</span></div>
          </div>
        </div>
        <div class="rule-sub" style="margin-top:24px;">
          HINWEIS: Für den Senior Flight Officer wird KEINE neue Strecke eingeführt.
          Es werden ausschließlich die vorhandenen Flugstrecken (Strecke 1 & Strecke 2) angeboten —
          weitere Flugstrecken sind nicht vorgesehen.
        </div>
      </div>
    </section>

    <div class="alert-box">
      <h3 class="alert-title">MANDATORY DIRECTIVE: Spezielle Einsatzlagen</h3>
      <p class="alert-desc">Innerhalb von zwei Wochen muss eine Fortbildung zu "speziellen Einsatzlagen" erfolgen. Diese Fortbildung ist essentiell. Wer dies nicht tut, besteht die Ausbildung der A.S.D. nicht.</p>
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
          <div class="db-body"><p style="color:var(--text-muted);line-height:1.6">Das sind reine Empfehlungen. Jeder Pilot fliegt anders, aber dies ist die anfängerfreundlichste und komfortabelste Steuerung.</p></div>
        </div>
        <div class="alert-box">
          <h3 class="alert-title">CRITICAL ERROR AVOIDANCE</h3>
          <p class="alert-desc">Es darf kein rotes Ausrufezeichen in der Keybind-Übersicht vorhanden sein. Alles MUSS belegt sein.</p>
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
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">BLACK HAWK</span>
              <span class="db-badge warn">RESTRICTED</span>
            </div>
            <div class="db-body"><p style="color:var(--text-muted);line-height:1.6">Zertifizierung für den Transporthelikopter. Einsatzfreigabe ausschließlich durch SWAT oder Leitungsebene.</p></div>
          </div>
          <div class="data-block">
            <div class="db-header">
              <span class="db-title">SPEZIELLE EINSATZLAGEN</span>
              <span class="db-badge">PFLICHT</span>
            </div>
            <div class="db-body"><p style="color:var(--text-muted);line-height:1.6">Musterverhalten von Piloten. Muss von jedem Flight Student innerhalb von 14 Tagen absolviert werden.</p></div>
          </div>
        </div>
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
          <div class="tc-name">[${m.callsign}] ${m.name}</div>
          <div class="tc-role">${m.role}</div>
        </div>
        <div class="tc-rank">${m.rank || '—'}<br><span>#${m.callsign}</span></div>
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
      <span class="mono-text">ANGEMELDET ALS: <b style="color:var(--accent)">${user.toUpperCase()}</b></span>
      <button class="btn btn-small magnetic" id="logout-btn">Logout</button>
    </div>

    <section class="section">
      <div class="section-meta"><div class="sm-title">NEUE BEWERTUNG</div></div>
      <div class="section-content">
        <form id="eval-form" autocomplete="off">
          <div class="form-grid">
            <div>
              <label class="f-label" for="ev-name">Pilot / Flight Student</label>
              <input class="f-input" type="text" id="ev-name" placeholder="NAME" required>
            </div>
            <div>
              <label class="f-label" for="ev-pruefer">Prüfer</label>
              <input class="f-input" type="text" id="ev-pruefer" value="${user}" readonly>
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

          <button type="submit" class="btn btn-primary magnetic" style="margin-top:24px;">Bewertung speichern</button>
        </form>
      </div>
    </section>

    <section class="section">
      <div class="section-meta"><div class="sm-title">AKTEN</div></div>
      <div class="section-content"><div id="eval-list"></div></div>
    </section>

    <section class="section" style="border-bottom:none;">
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
    `;
  }
};

// ─── ROUTER & ANIMATIONS ──────────────────────────────────────
function render(page) {
  const app = document.getElementById('app');
  const fn = pages[page] || pages['startseite'];
  
  // Fade out current content
  gsap.to(app, {
    opacity: 0, y: 10, duration: 0.3, onComplete: () => {
      app.innerHTML = fn();
      
      // Update Active Nav
      document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.dataset.page === page);
      });

      // Bind Links
      app.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', e => {
          e.preventDefault();
          navigate(el.dataset.page);
        });
      });

      window.scrollTo(0, 0);

      // Re-init magnets
      initCursor();

      // Page-specific logic
      if (page === 'intern') initIntern();

      // IN ANIMATION
      gsap.fromTo(app, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });

      // Special Hero Animations
      if (page === 'startseite') {
        gsap.to('.hero-title span', { y: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 });
        gsap.to(['.hero-desc', '.hero-actions'], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
      }
    }
  });
}

function navigate(page) {
  history.pushState({ page }, '', '#' + page);
  render(page);
}

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();

  document.querySelectorAll('.nav-link, .nav-brand a').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });

  window.addEventListener('popstate', e => {
    render(e.state?.page || 'startseite');
  });

  const hash = location.hash.replace('#', '') || 'startseite';
  // Fast initial render without fade out
  document.getElementById('app').innerHTML = (pages[hash] || pages['startseite'])();
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === hash);
  });
  
  // Bind Links on first load
  document.getElementById('app').querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.page);
    });
  });

  if (hash === 'startseite') {
    gsap.to('.hero-title span', { y: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.2 });
    gsap.to(['.hero-desc', '.hero-actions'], { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
  }

  if (hash === 'intern') initIntern();

  initCursor();
});
