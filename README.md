# ⚽ Fußball Screener - Matrix Style

Ein Echtzeit-Fußball-Screener für die deutsche Bundesliga im legendären Matrix-Stil.

## 🎯 Features

- **Matrix-Design**: Grüner Text auf schwarzem Hintergrund mit fallenden Matrix-Zeichen
- **Live-Daten**: Echtzeit-Spielstände von 1. und 2. Bundesliga
- **Automatische Aktualisierung**: Daten werden automatisch alle 60 Sekunden aktualisiert
- **Responsive Design**: Funktioniert auf Desktop und mobilen Geräten
- **Live-Status**: Spiele werden mit Live-, Beendet- oder Angesetzt-Status angezeigt

## 📋 Angezeigte Informationen

- **Mannschaften**: Namen beider Teams
- **Ergebnis**: Aktueller Spielstand (Live oder Endergebnis)
- **Zeit**: Datum und Uhrzeit des Spiels
- **Spieltag**: Aktuelle Spieltag-Nummer
- **Stadion**: Austragungsort
- **Status**: Live (🔴), Beendet (✓), oder Angesetzt (⏱)

## 🚀 Nutzung

1. Öffnen Sie `index.html` in einem modernen Webbrowser
2. Wählen Sie zwischen 1. und 2. Bundesliga
3. Die Daten werden automatisch geladen und aktualisiert

### Buttons

- **1. BUNDESLIGA**: Zeigt Spiele der 1. Bundesliga
- **2. BUNDESLIGA**: Zeigt Spiele der 2. Bundesliga
- **↻ REFRESH**: Manuelles Aktualisieren der Daten

## 🎨 Design-Elemente

- **Matrix-Hintergrund**: Animierte fallende Zeichen
- **Glühende Effekte**: Text-Schatten und Box-Schatten für den Matrix-Look
- **Scanline-Effekt**: Simuliert einen alten CRT-Monitor
- **Flackern**: Subtile Animationen für authentischen Retro-Look
- **Live-Blinken**: Blinkende rote Anzeige für laufende Spiele

## 📡 API

Verwendet die kostenlose [OpenLigaDB API](https://www.openligadb.de/) für:
- Aktuelle Spieltagsdaten
- Live-Ergebnisse
- Spielpläne
- Team-Informationen

## 🛠 Technologien

- **HTML5**: Struktur
- **CSS3**: Matrix-Styling mit Animationen
- **Vanilla JavaScript**: Logik und API-Integration
- **Canvas API**: Matrix-Hintergrundanimation

## 📱 Browser-Kompatibilität

Funktioniert mit allen modernen Browsern:
- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Opera

## 🔧 Anpassungen

Sie können folgende Werte in `script.js` anpassen:

```javascript
// Auto-Refresh-Intervall (Standard: 60000ms = 60 Sekunden)
autoRefreshInterval = setInterval(() => {
    loadMatches();
}, 60000);

// Matrix-Animationsgeschwindigkeit (Standard: 35ms)
setInterval(drawMatrix, 35);
```

## 📄 Lizenz

Dieses Projekt ist Open Source und kann frei verwendet werden.

## 🙏 Credits

- Daten: [OpenLigaDB](https://www.openligadb.de/)
- Design-Inspiration: The Matrix (1999)
