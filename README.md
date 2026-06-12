# A.S.D. OP-COM

Handbuch-Seite der Air Support Division mit internem Bewertungssystem.

## Hosting (Anleitung für Tommy)

Voraussetzung: Node.js (keine weiteren Abhängigkeiten, kein `npm install`).

```
node server.js
```

- Läuft standardmäßig auf Port **8080** (änderbar über die Umgebungsvariable `PORT`).
- Der Server liefert die Seite aus **und** speichert alle Daten direkt im Projektordner:
  - `data.json` — Seiteninhalte + Team (öffentlich lesbar)
  - `evals.json` — Bewertungsakten (nur mit Login abrufbar, wird automatisch angelegt)

**Wichtig:** `data.json` und `evals.json` sind die Datenbank — nicht löschen oder
durch alte Versionen ersetzen. Beide stehen bereits in der `.gitignore`, dadurch
ist `git pull` für Updates sicher. Fehlen die Dateien (Erstinstallation), startet
die Seite mit den eingebauten Standardinhalten und legt sie beim ersten Speichern
selbst an. Beide Dateien in Server-Backups einbeziehen.

Damit der Server nach einem Neustart weiterläuft, z. B. mit `pm2`:

```
npm install -g pm2
pm2 start server.js --name asd
pm2 save
```

## Ohne Server (Fallback)

Die Seite funktioniert auch rein statisch (nur `index.html` + Dateien hosten).
Dann werden Inhalte aus der `data.json` gelesen; Änderungen im Intern-Bereich
müssen über den Button „Veröffentlichen (data.json)" exportiert und die Datei
auf dem Host ersetzt werden. Bewertungen bleiben dann pro Browser.

## Login / Passwörter

- Login unter **Intern** (Standard: `Director` bzw. `Co-Director` / `asd2026`).
- Passwörter sind als SHA-256-Hash hinterlegt — an **zwei Stellen** ändern:
  - `app.js` → `ASD_USERS`
  - `server.js` → `ALLOWED_HASHES`
- Neuen Hash erzeugen: Seite öffnen → F12-Konsole → `await asdHash('neuesPasswort')`
