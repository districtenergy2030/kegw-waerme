# Wärme & Kühle · Landing Page, Rechner, PDF-Angebot

Version 1.2 · Stand 13.10.2026

Die Datei `kegw-waerme.js` enthält die komplette Landing Page, den Wärmepumpen- und Klimaanlagen-Rechner und den PDF-Export. Daneben liegt `kegw-pdf-fonts.js` mit der Hausschrift Satoshi für das PDF. Sie liegt auf GitHub und wird über jsDelivr in Webflow geladen. In Webflow steht nur ein kurzes Embed mit rund 30 Zeilen.

## Einbau in 10 Minuten

### 1 · GitHub: Repository anlegen (einmalig)

1. Auf github.com einloggen und oben rechts **+ → New repository** wählen.
2. Name: `kegw-waerme`, Sichtbarkeit **Public**. jsDelivr liest nur öffentliche Repositories. Der Code enthält keine Geheimnisse.
3. **Create repository** klicken, dann **uploading an existing file** anklicken.
4. Diese Dateien per Drag & Drop hineinziehen:
   - `kegw-waerme.js`
   - `kegw-pdf-fonts.js`
   - `vorschau.html`
   - `README.md`
5. Unten auf **Commit changes** klicken.

### 2 · Webflow: Seite einbauen

1. Neue Seite anlegen, z. B. `/waerme`.
2. Ein **Section**-Element ohne Padding anlegen. Darin ein **Code Embed** platzieren.
3. Den Inhalt von `webflow-embed.html` einfügen.
4. `DEIN-GITHUB-NAME` durch Ihren GitHub-Benutzernamen ersetzen.
5. Die Firmendaten in `KEGW_CONFIG` ausfüllen. Werte in `[eckigen Klammern]` erscheinen nicht im PDF.
6. **Publish** klicken.

Im Webflow-Designer bleibt das Embed leer. Das ist normal, denn Webflow führt dort keine Skripte aus. Sichtbar wird die Seite in der Vorschau-URL bzw. auf der veröffentlichten Seite.

Die Seite ist randlos (full-bleed). Sie funktioniert in jedem Container und auf dem Handy.

### 3 · Webflow: Anfragen empfangen (optional, empfohlen)

Wenn ein Kunde beim PDF-Download den Haken bei der Einwilligung setzt, schickt der Rechner das Angebot an ein Webflow-Formular. So landet die Anfrage ohne Zusatzdienst bei Ihnen.

1. Auf derselben Seite unter das Embed einen **Form Block** ziehen.
2. In den Form-Einstellungen bei **Form Name** exakt `Angebot Waerme Kuehle` eintragen.
3. Den Form Block auf **Display: None** setzen. Die vorhandenen Felder können bleiben.
4. Unter **Site settings → Forms** die E-Mail-Benachrichtigung einschalten.

Übertragen werden diese Felder:
- Angebotsnummer und Produkt
- Brutto, Zuschuss und Eigenanteil
- Name, Adresse, E-Mail und Telefon
- alle Positionen

Ohne Haken wird nichts übertragen.

Alternativ geht auch ein Webhook, z. B. Make, Zapier oder n8n:
```js
lead: { modus: 'webhook', webhook: 'https://…' }
```
Mit `modus: 'aus'` wird nie etwas übertragen.

## Änderungen veröffentlichen

1. Neue `kegw-waerme.js` in GitHub hochladen: **Add file → Upload files**, dann **Commit**.
2. Einmal diesen Link im Browser öffnen. Er leert den Cache von jsDelivr sofort:
   ```
   https://purge.jsdelivr.net/gh/DEIN-GITHUB-NAME/kegw-waerme@main/kegw-waerme.js
   ```
3. Fertig. In Webflow muss nichts geändert werden, auch kein neues Publish.

Firmendaten, Kontaktadresse und Lead-Einstellung ändern Sie direkt im Webflow-Embed. GitHub brauchen Sie dafür nicht.

**Kleinere Datei:** jsDelivr liefert automatisch eine verkleinerte Version, wenn Sie in der URL `kegw-waerme.min.js` statt `kegw-waerme.js` schreiben.

## Preise und Annahmen anpassen

Alles steht im oberen Teil von `kegw-waerme.js`. In GitHub öffnen Sie die Datei mit dem Stift-Symbol.

| Was | Wo in der Datei |
|---|---|
| Aufschlag netto (WP 3.000 €, Klima 2.000 €) | `aufschlag: { wp: 3000, klima: 2000 }` |
| Energiepreise, Fixkosten, Preisanstieg | `energie: { … }` |
| Gültigkeit, Angebotsnummer-Präfix (A2030-WP / A2030-KL) | `angebot: { … }` |
| WP-Gerätepreise je Größe (5/7/10/12/16 kW) | `WP_T` |
| WP-Pauschalen (Zählerschrank, Fundament, Heizkörper …) | `WP_P` |
| Klima-Innengeräte und Außengeräte | `IG` und `AG` |
| Klima-Montage, Leitung je Meter, Kondensatpumpe | `KL` |
| Förderstufen KfW 458 (Bonus und Höchstbeträge je Zeitraum) | `FOE.stufen` |

**Wichtig:** Ändert die KfW die Förderung, passen Sie `FOE.stufen` an. Die Quelle ist www.kfw.de/458.

## Wie gerechnet wird

**Kalibrierung:** Die Preise sind auf zwei reale Belege kalibriert. Beide Rechnerwerte treffen die Belege auf den Cent.

| Beleg | Rechnerwert |
|---|---|
| Wärmepumpe 7 kW: Angebot Natelberg 22.451,30 € + Inbetriebnahme 448,50 € + Zählerschrank 2.500 € + Abdeckung 375,25 € | 25.775,05 € netto, mit Aufschlag 28.775,05 € netto |
| Klimaanlage, 3 Räume (Wohnzimmer 32 m² EG, Schlaf 14 m² OG, Kind 12 m² OG): Schlussrechnung Eneto | 8.404 € netto, mit Aufschlag 10.404 € netto bzw. 12.380,76 € brutto |

**Andere Größen** werden je Position abgeleitet:
- Gerätepaket, Hydraulik und Montagestunden nach Leistung
- Abgleich je Heizkörper
- Kältemittelleitung je Meter nach Etage (8 m + 3 m je Etage)
- günstigstes passendes Außengerät, auf 1 bis 3 Außengeräte verteilt

**Aufschlag:** Er wird anteilig auf die Basispositionen verteilt und nie separat ausgewiesen.

**Fundament:** Es ist nicht im Preis enthalten. Wählbar sind:
- **Eigenvergabe** an den Garten- und Landschaftsbau, Richtwert 800 bis 1.600 € brutto. Die Maßskizze steht im PDF.
- **Partnerbetrieb**, Natelberg-Preis 1.265,50 € netto
- **Bodenkonsole**
- **Wandkonsole**, nur bis 7 kW

**Förderung** nach KfW 458, Richtlinie ab 21.07.2026:
- 30 % Grundförderung
- Klimageschwindigkeitsbonus 16 % bis 31.01.2027, danach halbjährlich 4 Punkte weniger
- Einkommensbonus 40/30/10 %, mit Familienzuschlag
- Deckel 70 % bzw. 80 %
- förderfähige Kosten 28.000 €, die halbjährlich sinken

**Klimaanlage:** Als Ergänzung zur bestehenden Heizung keine Förderung.

## Dateien

| Datei | Zweck |
|---|---|
| `kegw-waerme.js` | Die komplette Anwendung (auf GitHub legen) |
| `kegw-pdf-fonts.js` | Satoshi Bold, Medium, Light und Italic für das PDF (auf GitHub neben die App legen) |
| `webflow-embed.html` | Inhalt für das Webflow-Code-Embed |
| `vorschau.html` | Lokale Vorschau: neben `kegw-waerme.js` legen und doppelklicken |
| `README.md` | Diese Anleitung |

## Technik

- Scope `#kw`, alle IDs mit Präfix `kw-`, keine Konflikte mit Webflow-Klassen.
- Schriften: Satoshi (Fontshare) und JetBrains Mono (Google Fonts) werden automatisch geladen.
- PDF: jsPDF 2.5.1 von cdnjs, erst beim Klick geladen. Das PDF entsteht im Browser des Kunden.
- PDF-Gestaltung nach Markenprofil: Satoshi eingebettet (Bold für Überschriften, Medium für Kennzahlen und Tabellen, Light für Fließtext, Italic für Anmerkungen). Die Schriftdatei wird automatisch neben `kegw-waerme.js` gesucht. Fehlt sie, entsteht das PDF mit Ersatzschrift.
- Logos als Vektoren: „The mission is no emission“ im Kopf jeder Seite, die ansvar2030-Wortmarke in der Fußzeile. Ausschalten der Fußzeilen-Marke mit `pdf: { logos: false }`, Text darüber mit `pdf: { logoLabel: 'Ein Projekt von' }`.
- Absender ist standardmäßig ansvar2030. Name, Adresse und Rechtsangaben setzen Sie im Webflow-Embed unter `firma`.
- Eingaben bleiben pro Besucher im Browser gespeichert (localStorage).
- `prefers-reduced-motion` schaltet alle Animationen ab. Barrierearm mit aria-Labels und Tastaturbedienung.
