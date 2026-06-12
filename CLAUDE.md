# A.S.D. OP-COM — Handbuch-Website der Air Support Division

Statische Single-Page-Website (HTML/CSS/JS mit GSAP) plus Mini-Server in purem
Node.js. **Kein Build-Schritt, keine npm-Abhängigkeiten, kein `npm install`.**

## Deployment / Hosting (Hauptaufgabe auf dem Server)

1. Voraussetzung: Node.js (LTS reicht). Sonst nichts.
2. Starten: `node server.js` — Port über Umgebungsvariable `PORT` (Standard 8080).
3. Dauerbetrieb empfohlen mit pm2:
   ```
   npm install -g pm2
   pm2 start server.js --name asd
   pm2 save
   pm2 startup    # einmalig, den ausgegebenen Befehl ausführen
   ```
4. Optional: Domain per Reverse Proxy (nginx/Caddy) auf den Port legen, mit HTTPS.

## KRITISCH: Live-Daten

Der Server erzeugt und beschreibt im Projektordner zwei Dateien — das ist die
Datenbank der Seite:

- `data.json` — Seiteninhalte + Team-Aufstellung
- `evals.json` — Bewertungsakten der Piloten

Beide sind in `.gitignore`. **Niemals löschen, überschreiben, zurücksetzen oder
ins Repo committen.** `git pull` für Updates ist dadurch sicher. Diese Dateien
in Server-Backups einbeziehen. Fehlen sie (Erstinstallation), startet die Seite
mit den eingebauten Standardinhalten aus `app.js` und legt die Dateien beim
ersten Speichern selbst an — das ist normal und kein Fehler.

## Struktur

- `index.html`, `style.css`, `app.js` — komplettes Frontend (SPA; Seiten als
  Templates im `pages`-Objekt in `app.js`, Inhalte aus `DEFAULT_CONTENT` bzw.
  zur Laufzeit vom Server)
- `server.js` — liefert statische Dateien aus und stellt die Speicher-API:
  - `GET /api/data` (öffentlich), `POST /api/data` (auth)
  - `GET/POST /api/evals` (auth)
  - Auth = Header `X-ASD-Auth` mit SHA-256-Hash des Passworts
- `assets/` — Bilder/Video der Seite

## Login / Passwörter

Login-Daten (Bereich „Intern" auf der Seite) sind als SHA-256-Hashes an **zwei
Stellen** hinterlegt, die synchron bleiben müssen:

- `app.js` → `ASD_USERS`
- `server.js` → `ALLOWED_HASHES`

Neuen Hash erzeugen: Seite im Browser öffnen → F12-Konsole →
`await asdHash('neuesPasswort')`. Nach Änderung in `server.js` den Server
neu starten (`pm2 restart asd`).
