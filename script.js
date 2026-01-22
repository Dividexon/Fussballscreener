// Matrix Background Animation
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * canvas.height / fontSize;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#4a9f8c';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Fußball Screener Logic
const API_BASE = 'https://api.openligadb.de';
let currentLeague = 'bl1';
// Saison-Berechnung: Jan-Juli = Vorjahr (z.B. Jan 2026 → Saison 2025/26 = 2025)
const now = new Date();
let currentSeason = now.getMonth() < 7 ? now.getFullYear() - 1 : now.getFullYear();
let autoRefreshInterval;

// Liga-Konfiguration
const leagues = {
    bl1: {
        name: '1. Bundesliga',
        apiName: 'bl1'
    },
    bl2: {
        name: '2. Bundesliga',
        apiName: 'bl2'
    },
    cl: {
        name: 'Champions League (DE)',
        apiName: 'ucl2025'
    }
};

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadMatches();
    startAutoRefresh();
});

function setupEventListeners() {
    // Liga-Buttons
    document.querySelectorAll('.matrix-btn[data-league]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.matrix-btn[data-league]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentLeague = e.target.dataset.league;
            loadMatches();
        });
    });

    // Refresh-Button
    document.getElementById('refresh').addEventListener('click', () => {
        loadMatches();
    });
}

async function loadMatches() {
    const matchesContainer = document.getElementById('matches');
    matchesContainer.innerHTML = `
        <div class="loading">
            <span class="loading-text">LOADING DATA...</span>
            <div class="loading-bar"></div>
        </div>
    `;

    updateStatus('FETCHING DATA...');

    try {
        // Aktuellen Spieltag abrufen
        const currentMatchdayResponse = await fetch(
            `${API_BASE}/getcurrentgroup/${leagues[currentLeague].apiName}`
        );

        if (!currentMatchdayResponse.ok) {
            throw new Error('API request failed');
        }

        const currentMatchday = await currentMatchdayResponse.json();
        const matchdayNumber = currentMatchday.groupOrderID;

        // Spiele des aktuellen Spieltags abrufen
        const matchesResponse = await fetch(
            `${API_BASE}/getmatchdata/${leagues[currentLeague].apiName}/${currentSeason}/${matchdayNumber}`
        );

        if (!matchesResponse.ok) {
            throw new Error('Failed to fetch matches');
        }

        const matches = await matchesResponse.json();
        displayMatches(matches, matchdayNumber);
        updateStatus('SYSTEM ONLINE');
        updateLastUpdate();

    } catch (error) {
        console.error('Error:', error);
        matchesContainer.innerHTML = `
            <div class="no-matches">
                ERROR: CONNECTION FAILED<br>
                <small>${error.message}</small>
            </div>
        `;
        updateStatus('ERROR - RETRYING...');
    }
}

function displayMatches(matches, matchday) {
    const matchesContainer = document.getElementById('matches');

    if (!matches || matches.length === 0) {
        matchesContainer.innerHTML = '<div class="no-matches">NO MATCHES FOUND</div>';
        return;
    }

    let html = '';

    matches.forEach(match => {
        const matchDate = new Date(match.matchDateTime);
        const status = getMatchStatus(match);
        const isLive = status === 'live';

        html += `
            <div class="match-card">
                <div class="match-status ${status}">${getStatusText(status, match)}</div>

                <div class="match-header">
                    <div class="match-time">${formatDateTime(matchDate)}</div>
                    <div class="matchday">SPIELTAG ${matchday}</div>
                </div>

                <div class="match-teams">
                    <div class="team">
                        <div class="team-logo">⚽</div>
                        <div class="team-name">${match.team1.teamName}</div>
                    </div>

                    <div class="score ${isLive ? 'live' : ''}">
                        ${getScore(match)}
                    </div>

                    <div class="team">
                        <div class="team-logo">⚽</div>
                        <div class="team-name">${match.team2.teamName}</div>
                    </div>
                </div>

                <div class="match-info">
                    <div>📍 ${match.location ? match.location.locationCity : 'N/A'}</div>
                    <div>${leagues[currentLeague].name}</div>
                </div>
            </div>
        `;
    });

    matchesContainer.innerHTML = html;
}

function getMatchStatus(match) {
    if (!match.matchIsFinished) {
        const now = new Date();
        const matchDate = new Date(match.matchDateTime);
        const diffMinutes = (now - matchDate) / (1000 * 60);

        if (diffMinutes >= 0 && diffMinutes <= 120) {
            return 'live';
        } else if (now < matchDate) {
            return 'scheduled';
        }
    }
    return 'finished';
}

function getStatusText(status, match) {
    switch(status) {
        case 'live':
            return '🔴 LIVE';
        case 'finished':
            return '✓ BEENDET';
        case 'scheduled':
            return '⏱ ANGESETZT';
        default:
            return 'UNKNOWN';
    }
}

function getScore(match) {
    if (!match.matchResults || match.matchResults.length === 0) {
        return '<span class="vs">VS</span>';
    }

    // Halbzeit- oder Endergebnis anzeigen
    const result = match.matchResults.find(r => r.resultTypeID === 2) || match.matchResults[0];

    return `${result.pointsTeam1} : ${result.pointsTeam2}`;
}

function formatDateTime(date) {
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('de-DE', options).toUpperCase();
}

function updateStatus(text) {
    document.getElementById('status').textContent = text;
}

function updateLastUpdate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE');
    document.getElementById('last-update').textContent = `LAST UPDATE: ${timeString}`;
}

function startAutoRefresh() {
    // Aktualisiere alle 60 Sekunden
    autoRefreshInterval = setInterval(() => {
        loadMatches();
    }, 60000);
}

// Cleanup beim Verlassen der Seite
window.addEventListener('beforeunload', () => {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});

// Scanline-Effekt hinzufügen
const scanline = document.createElement('div');
scanline.className = 'scanline';
document.body.appendChild(scanline);
