# A.S.D. OP-COM — Handbuch-Website der Air Support Division

Statische Single-Page-Website (HTML/CSS/JS mit GSAP) plus Mini-Server in purem
Node.js. **Kein Build-Schritt, keine npm-Abhängigkeiten, kein `npm install`.**

---

## Deployment — bitte exakt so (für den Hoster / KI-Assistenten)

> **Kernregel:** Diese Seite MUSS über den mitgelieferten Node-Server laufen.
> Sie darf **nicht** als reine statische Seite betrieben werden (also nicht nur
> die HTML-Dateien von nginx/Apache ausliefern lassen). Ohne den Node-Server
> fehlt die Speicher-API `/api/...`, und die Seite landet im **OFFLINE-MODUS**:
> Änderungen bleiben dann nur im Browser des Bearbeiters und sind für andere
> Besucher unsichtbar. Das ist der einzige typische Fehler — unbedingt vermeiden.

### 1. Starten
1. Node.js installieren (LTS genügt). Sonst nichts — kein `npm install` nötig.
2. Im Projektordner:
   ```
   node server.js
   ```
   (oder `npm start` — macht dasselbe). Port über Umgebungsvariable `PORT`,
   Standard **8080**.
3. Aufrufen: `http://<SERVER-IP>:8080`

### 2. Dauerbetrieb (empfohlen, mit Autostart)
```
npm install -g pm2
pm2 start server.js --name asd
pm2 save
pm2 startup        # einmalig, den ausgegebenen Befehl ausführen
```

### 3. PFLICHT-CHECK nach dem Aufsetzen
Prüfen, dass der Server-Modus wirklich aktiv ist — sonst speichert die Seite
nicht zentral:
- Im Browser: Seite öffnen → Bereich **„Intern"** → einloggen → Abschnitt
  **„Daten"**. Dort MUSS **„SERVER-SPEICHERUNG // AKTIV"** stehen.
  Steht dort **„OFFLINE-MODUS"**, läuft die Seite nicht über `server.js` →
  siehe Troubleshooting unten.
- Oder am Terminal:
  ```
  curl http://localhost:8080/api/data
  ```
  Korrekt = JSON, das einen `content`-Schlüssel enthält. Ein 404/Fehler
  bedeutet, dass der Server die Seite nicht bedient.

### 4. Domain + HTTPS per Reverse Proxy (optional)
**ALLE** Pfade auf den Node-Port leiten — nicht nur einzelne, sonst fehlt `/api`.

Caddy (`Caddyfile`, inkl. automatischem HTTPS):
```
asd.deine-domain.de {
    reverse_proxy localhost:8080
}
```

nginx:
```
server {
    server_name asd.deine-domain.de;
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
    }
}
```
**Wichtig:** kein separates `root ...;` für statische Dateien setzen — der
gesamte Verkehr muss durch den Node-Server, sonst ist `/api` nicht erreichbar.

### 5. Troubleshooting: Seite zeigt „OFFLINE-MODUS"
Heißt: `/api/data` ist nicht erreichbar. Mögliche Ursachen:
- `node server.js` läuft nicht → prüfen mit `pm2 status` bzw. neu starten.
- Ein Webserver liefert den Ordner direkt als statische Dateien aus, statt an
  den Node-Server zu proxien.
- Der Reverse Proxy leitet nur manche Pfade weiter; `/api` fehlt.

Lösung: Auslieferung ausschließlich über `server.js`, bzw. im Reverse Proxy
**alle** Pfade auf den Node-Port weiterleiten.

---

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
- `package.json` — nur ein `start`-Script (`node server.js`), keine Abhängigkeiten
- `assets/` — Bilder/Video der Seite

## Login / Passwörter

Login-Daten (Bereich „Intern" auf der Seite) sind als SHA-256-Hashes an **zwei
Stellen** hinterlegt, die synchron bleiben müssen:

- `app.js` → `ASD_USERS`
- `server.js` → `ALLOWED_HASHES`

Neuen Hash erzeugen: Seite im Browser öffnen → F12-Konsole →
`await asdHash('neuesPasswort')`. Nach Änderung in `server.js` den Server
neu starten (`pm2 restart asd`).
